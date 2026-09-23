const { conexion } = require('../controllers/connection');
const { checkTitleBoard, checkDescriptionBoard } = require('../utils/format');

const getAllBoards = async (userId) => {
  try {
    const { data } = await conexion.from('boards').select('*').eq('user_id', userId)
    return data;
  } catch (error) {
    console.log(error.message)
    return null
  }
}

const createBoard = async (boardName, boardDescription, userId, is_favorite = false) => {
  if (!checkTitleBoard(boardName)) return false;
  if (!checkDescriptionBoard(boardDescription)) return false;
  
  try {
    const { data } = await conexion.from('boards').insert([{ board_name: boardName, description: boardDescription, user_id: userId, is_favorite: is_favorite }]).select()
    if(data.length > 0) return true;
    return false;
  } catch (error) {
    return false
  }
}

const getFavorites = async(userId) => {
  try {
    const { data } = await conexion.from('boards').select('*').eq("is_favorite", true).eq('user_id', userId)
    if(data.length > 0) return data
    return false;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

const getBoardInfo = async (boardId, userId) => {
  try {
    // Check if the board really exists and belongs to the user
    let converData = []
    const { data } = await conexion.from('boards').select('*, columns(*)').eq('id', boardId).eq('user_id', userId)
    if (data.length > 0) {
      for (const item of data[0].columns) {
        const tasks = await getTasks(item)
        converData = { ...converData, [item.id]: { tasks, columnId: item.id, title: item.title } }
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

const getFavorite = async (boardId, userId) => {
  try {
    const { data } = await conexion.from('boards').select("is_favorite").eq('id', boardId).eq('user_id', userId);
    if(!data || data.length === 0) return false
    return data[0].is_favorite
  } catch (error) {
    return false
  }
}

const removeBoard = async (boardId, userId) => {
  try {
    const { data, error } = await conexion
      .from('boards')
      .delete()
      .eq('id', boardId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting board:', error.message);
    return false;
  }
}

const createColumn = async (name, userId, boardId) => { 
  if (!checkTitleBoard(name)) return false;
  
  try{
    const { data: boardCheck } = await conexion.from('boards').select('id').eq('id', boardId).eq('user_id', userId)
    if (!boardCheck || boardCheck.length === 0) return false

    const { data } = await conexion.from('columns').insert({title: name, id_board: boardId }).select()
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
  createColumn,
  removeBoard
}