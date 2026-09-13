const { conexion } = require('../controllers/connection')
const { checkPassword, hashPassword } = require('../utils/verifications')

const getUsuarioByEmail = async (email) => {
  try {
    const { data } = await conexion.from('user').select('*').eq('email', email)
    if (data.length > 0) return data[0]
    return false
  } catch (error) {
    console.log(error.message)
    return false
  }
}

const getUserById = async (userId) => {
  try {
    const { data } = await conexion
      .from('user')
      .select('*')
      .eq('id', userId);

    console.log("Datos desde data: ", data)
    if (data.length > 0) return data[0]
    return false
  } catch (error) {
    console.log(error.message)
    return false
  }
}

const saveOtp = async (otp, userId = 1) => {
  try {
    const { data } = await conexion.from('user').update({
      otp: {
        otp, verified: false
      }
    }).eq("id", userId)
    if (data) return true
  } catch (error) {
    console.log('Ocurrio un error en guardar el otp.')
    return false
  }
}

const getOtp = async (userId = 1) => {
  try {
    const { data } = await conexion.from('user').select('otp').eq("id", userId)
    if (data) return data[0].otp.otp
    return false
  } catch (error) {
    return false
  }
}

const validateOtp = async (otp, userId = 1) => {
  try {
    const { data } = await conexion.from('user').update({
      otp: {
        otp, verified: true
      }
    }).eq("id", userId)
    if (data) return true
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}

const checkOtpValidation = async ( userId = 1) => {
  try {
    const { data } = await conexion.from('user').select('otp').eq("id", userId)
    if (data[0].otp.verified) {
      return true
    }
    return false  
  } catch (error) {
    return false
  }
}

const changePassword = async (password, passwordConfirmation, userId = 1) => {
  try {
    if(password !== passwordConfirmation) return false;
    const isValid = await checkPassword(password);
    
    if(!isValid) return false;
    const hash = await hashPassword(password);
    const { data } = await conexion.from('user').update({
      password: hash
    }).eq("id", userId)

    if (data) return true
    return false
  } catch (error) {
    return false
  }
}

module.exports = {
  getUsuarioByEmail,
  getUserById,
  saveOtp,
  getOtp,
  validateOtp,
  checkOtpValidation,
  changePassword
}