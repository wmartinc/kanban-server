const bcrypt = require('bcrypt')
require('dotenv/config')

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, Number(process.env.HASH_SALT))
}

module.exports = {
  verifyPassword,
  hashPassword
}