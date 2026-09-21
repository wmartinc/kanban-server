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
    const { data } = await conexion.from('boards').select('*').eq("is_favorite", true)
    if(data.length > 0) return data
    return false;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

const getBoardInfo = async (boardId="8c2ffdc7-bb9c-4060-bd99-e59bb0266c9f") => {
  try {
    // Check if the board really exists
    let converData = []
    const { data } = await conexion.from('boards').select('*, columns(*)').eq('id', boardId)
    if (data.length > 0) {
      for (const item of data[0].columns) {
        const tasks = await getTasks(item)
        converData = { ...converData, [item.title]: { tasks, columnId: item.id } }
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
  const { data } = await conexion.from('columns').select("tasks(*)").eq("id", column.id).order("created_at")
  return data[0].tasks
}

const getFavorite = async (boardId) => {
  try {
    const { data } = await conexion.from('boards').select("is_favorite").eq('id', boardId);
    if(!data) return false
    return data[0].is_favorite
  } catch (error) {
    console.log('Ocurrio un error en verificar la informacion.')
    console.log(error.message)
  }
}

const createColumn = async (name) => { 
  try{
    const { data } = await conexion.from('columns').insert({title: name, id_board: "8c2ffdc7-bb9c-4060-bd99-e59bb0266c9f" }).select()
    // additionally it would be perfect to check if the id is really belonging to this client. 
    console.log("aca esta la informacion de mi data: ", data)
    if (data) return data;
    return false;
  } catch(e) {
    console.error(e)
    return false
  }
}

module.exports = {
  getAllBoards,
  createBoard,
  getFavorites,
  getBoardInfo,
  getFavorite,
  createColumn
}