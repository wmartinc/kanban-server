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
    let converData = []
    const { data } = await conexion.from('boards').select('*, columns(*)').eq('board_name', boardName)

    if (data.length > 0) {
      for (const item of data[0].columns) {
        const tasks = await getTasks(item)
        converData = { ...converData, [item.column_name]: tasks }
      }
      return converData
    }
    return false
  } catch (error) {
    console.log(error.message)
    return false;
  }
}

const getTasks = async (column) => {
  const { data } = await conexion.from('columns').select("tasks(*)").eq("id", column.id)
  return data[0].tasks
}
module.exports = {
  getAllBoards,
  createBoard,
  getFavorites,
  getBoardInfo
}