const express = require('express');
const loginRoute = express.Router();
const { getUsuarioByEmail } = require('../databaseActions/user')

// Iniciar sesion
loginRoute.post('/login', async (req, res) => {
  const { email, password } = req.body

  const usuario = await getUsuarioByEmail(email)
  if (!usuario) return res.status(400).json({ confirmation: false, message: 'Usuario no encontrado' });

  if (usuario[0].password !== password) return res.status(400).json({ confirmation: false, message: 'Contraseña incorrecta' });
  
  return res.status(200).json({ confirmation: true, usuario })
})

module.exports = loginRoute;