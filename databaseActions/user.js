const { conexion } = require('../controllers/connection')

const getUsuarioByEmail = async (email) => {
  try {
    const {data} = await conexion.from('user').select('*').eq('email', email)
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
    if(data.length > 0) return data[0]
    return false
  } catch (error) {
    console.log(error.message)
    return false
  }
}

module.exports = {
  getUsuarioByEmail,
  getUserById
}