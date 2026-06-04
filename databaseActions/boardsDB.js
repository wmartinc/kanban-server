const { conexion } = require('../controllers/connection')

const getAllBoards = async () => {
  try {
    const { data } = await conexion.from('boards').select('*')
    return data;
  } catch (error) {
    console.log(error.message)
    return null
  }
}

const createBoard = async (boardName, boardDescription) => {
  try {
    const { data } = await conexion.from('boards').insert([{ board_name: boardName, description: boardDescription }]).select()
    if(data.length > 0) return true;
    return false;
  } catch (error) {
    return false
  }
}

const getFavorites = async() => {
  try {
    const { data } = await conexion.from('favorite_tasks').select('*')
    if(data.length > 0) return true
    return false;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

module.exports = {
  getAllBoards,
  createBoard,
  getFavorites
}