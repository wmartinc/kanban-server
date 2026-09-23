const express = require('express');
const loginRoute = express.Router();
const { getUsuarioByEmail, getUserById, createUser } = require('../databaseActions/user')
const { createSesion, verifySesion } = require('../utils/jwtVerifications');
const { verifyPassword, checkPassword, verifyOtp } = require('../utils/verifications');
const { checkEmail } = require('../utils/format');
const { transporter, emailTemplate, generateOTP } = require('../controllers/email');

// Registrar usuario
loginRoute.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation, otp, userName } = req.body;

  if (!checkEmail(email)) {
    return res.status(400).json({ confirmation: false, message: 'Email invalido' });
  }

  if (!password || !passwordConfirmation) {
    return res.status(400).json({ confirmation: false, message: 'Las contraseñas son requeridas' });
  }

  if (password !== passwordConfirmation) {
    return res.status(400).json({ confirmation: false, message: 'Las contraseñas no coinciden' });
  }

  if (!checkPassword(password)) {
    return res.status(400).json({ confirmation: false, message: 'Contraseña invalida' });
  }

  // Chequeo del OTP guardado en la cookie por signup-check
  if (!verifyOtp(otp)) {
    return res.status(400).json({ confirmation: false, message: 'Codigo invalido' });
  }

  const cookieOtp = req.cookies?.signupOtp;
  if (!cookieOtp || cookieOtp !== otp) {
    return res.status(400).json({ confirmation: false, message: 'Codigo incorrecto' });
  }

  const existingUser = await getUsuarioByEmail(email);
  if (existingUser) {
    return res.status(409).json({ confirmation: false, message: 'El usuario ya existe' });
  }

  // El OTP hizo match: eliminar la cookie guardada
  res.clearCookie('signupOtp', {
    sameSite: "lax",
    secure: process.env.NODE_ENV === 'production'
  });

  const userCreated = await createUser(email, password, userName);
  if (!userCreated) {
    return res.status(500).json({ confirmation: false, message: 'No se pudo crear el usuario' });
  }

  const { password: _, ...newUser } = userCreated;
  return res.status(201).json({ confirmation: true, message: 'Usuario creado exitosamente', newUser })
})

// Enviar OTP de verificacion para el registro de un usuario
loginRoute.post('/signup-check', async (req, res) => {
  const { email } = req.body;

  if (!checkEmail(email)) {
    return res.status(400).json({ confirmation: false, message: 'Email invalido' });
  }
  
  const otp = generateOTP();

  // Guardar el OTP solo en una cookie
  try {
    res.cookie('signupOtp', otp, {
      sameSite: "lax",
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 10 * 60 * 1000
    });
  } catch (error) {
    console.log('Error guardando el OTP en la cookie:', error.message);
    return res.status(500).json({ confirmation: false, message: 'No se pudo guardar la cookie' });
  }

  try {
    await transporter.sendMail({
      from: "mcox4525@gmail.com",
      to: email,
      html: emailTemplate(otp)
    });
  } catch (error) {
    console.log('Error enviando el correo:', error.message);
    return res.status(500).json({ confirmation: false, message: 'No se pudo enviar el correo' });
  }

  return res.json({ confirmation: true, message: "Correo enviado exitosamente" })
})

// Iniciar sesion
loginRoute.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  const usuario = await getUsuarioByEmail(email)
  if (!usuario) return res.status(400).json({ confirmation: false, message: 'Something went wrong!' });
  
  const isPasswordValid = await verifyPassword(password, usuario.password)
  if (!isPasswordValid) return res.status(400).json({ confirmation: false, message: 'Something went wrong!' });

  const sesionCreated = createSesion(res, usuario);
  if (!sesionCreated) return res.status(500).json({ confirmation: false, message: 'Something went wrong!' });
  const {id, password:_, created_at, ...newUser} = usuario
  return res.status(200).json({ confirmation: true, newUser })
})

loginRoute.get('/login', verifySesion, async (req, resp) => {
  const savedUser = req.user  
  if(!savedUser)  return resp.status(500).json({ confirmation: false, content: 'Something went wrong!' });
  
  const dbUser = await getUserById(savedUser.id)
  if(!dbUser) return resp.status(500).json({confirmation: false, content: 'Something went wrong!'})
  savedUser.main_board = dbUser.main_board
  return resp.status(200).json({ confirmation: true, content: savedUser })
})      

// Cerrar sesion (elimina las cookies de sesion)
loginRoute.post('/logout', (req, res) => {
  try {
    res.clearCookie('accessToken', {
      sameSite: "lax",
      secure: process.env.NODE_ENV === 'production'
    });
    res.clearCookie('refreshToken', {
      sameSite: "lax",
      secure: process.env.NODE_ENV === 'production'
    });

    return res.json({ confirmation: true, message: "Sesion cerrada exitosamente" });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ confirmation: false, message: 'Something went wrong!' });
  }
})


module.exports = loginRoute;