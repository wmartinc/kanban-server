const bcrypt = require('bcrypt')
require('dotenv/config')

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, Number(process.env.HASH_SALT))
}


const checkPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|,.?~-])[A-Za-z\d!@#$%^&*()_+=[\]{}|,.?~-]{8,64}$/;
  if(password.match(passwordRegex)) return true
  return false
}

// Comprueba si el texto está compuesto ÚNICAMENTE por dígitos (0-9)
const NUMERIC_REGEX = /^[0-9]+$/

const verifyOtp = (otp) => {
  if(otp?.length !== 6) return false
  const isNumeric = NUMERIC_REGEX.test(otp)
  return isNumeric
}

module.exports = {
  verifyPassword,
  hashPassword,
  verifyOtp,
  checkPassword
}