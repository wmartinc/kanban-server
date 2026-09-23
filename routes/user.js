const express = require('express')
const { transporter, emailTemplate, generateOTP } = require('../controllers/email');
const { checkEmail } = require('../utils/format');
const { saveOtp, getOtp, validateOtp, checkOtpValidation, changePassword } = require('../databaseActions/user');
const { verifyOtp } = require('../utils/verifications');
const userRoute = express.Router()

userRoute.put('/reset-password', async (req, res) => {
  const { email } = req.body;
  const isEmailCorrect = checkEmail(email)
  if (!isEmailCorrect) {
    return res.status(400).json({ confirmation: false, message: 'Email no valido' });
  }
  
  const otp = generateOTP()
  saveOtp(otp)
  await transporter.sendMail({
    from: "mcox4525@gmail.com",
    to: email,
    html: emailTemplate(otp)
  })


  return res.json({ confirmation: true, message: "Correo enviado exitosamente" })
})

userRoute.post('/check-otp', async (req, resp) => {
  const { otp } = req.body
  const isOtpValid = verifyOtp(otp.otp)
  if(!isOtpValid) return resp.json({message: "Codigo invalido", confirmation: false})

  const otpFromDb = await getOtp()
  if(otp.otp !== otpFromDb) {
    return resp.json({message: 'Codigo incorrecto', confirmation: false})
  }
  validateOtp(otpFromDb)
  return resp.json({message: "Codigo correcto", confirmation: true})
})

userRoute.put('/change-password', async (req, res) => {
  const { password, passwordConfirmation } = req.body;

  if(!password || !passwordConfirmation) return res.status(400).json({message: "Ocurrio un error", confirmation: false});
  const isOtpValid = await checkOtpValidation();
  if(!isOtpValid) return res.json({message: "Codigo de verificación expirado", confirmation: false});

  const isPasswordChanged = await changePassword(password, passwordConfirmation);
  if(!isPasswordChanged) return res.json({message: "Algo salio mal", confirmation: false})
  
  return res.json({message: "Contraseña cambiada exitosamente", confirmation: true})
})

module.exports = {
  userRoute
}