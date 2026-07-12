const express = require('express');
const loginRoute = express.Router();
const { getUsuarioByEmail, getUserById } = require('../databaseActions/user')
const { createSesion, verifySesion } = require('../utils/jwtVerifications');
const { verifyPassword } = require('../utils/verifications');

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


module.exports = loginRoute;