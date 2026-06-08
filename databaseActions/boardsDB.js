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
    if(data.length > 0) return data
    return false;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

const getBoardInfo = async (boardName) => {
  try {
    // Check if the board really exists

    const { data } = await conexion.from('boards').select('*').eq('board_name', boardName)
    if(data.length > 0) {
      const columns = await getColumns(data[0].id)
      return {columns, data: data[0]}
    }
    return false
  } catch (error) { 
    console.log(error.message)
    return false;
  }
}

const getColumns = async (boardId) => {
  try {
    const { data } = await conexion.from('columns').select('*').eq("id_board", boardId)
    if(data.length > 0) return data;
    return false;
  } catch (error) {
    console.log("Error en columnas",error.message)
    return false;
  }

}

module.exports = {
  getAllBoards,
  createBoard,
  getFavorites,
  getColumns,
  getBoardInfo
}