const { conexion } = require('../controllers/connection');

const columnBelongsToUser = async (columnId, userId) => {
  try {
    const { data: column } = await conexion.from('columns').select('id_board').eq('id', columnId)
    if (!column || column.length === 0) return false

    const { data: board } = await conexion.from('boards').select('user_id').eq('id', column[0].id_board)
    if (!board || board.length === 0) return false

    return board[0].user_id === userId
  } catch (error) {
    console.log(error.message);
    return false
  }
}

const getTasksByColumnId = async (columnId, userId) => {
  if (!(await columnBelongsToUser(columnId, userId))) return false;
  try {
    const { data } = await conexion
      .from('tasks')
      .select('*')
      .eq('column_id', columnId)
      .order('id_sort', { ascending: true });
      if(data.length > 0) return data;
      return false;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const createTask = async (task, columnId, userId) => {
  if (!(await columnBelongsToUser(columnId, userId))) return false;
  task = {...task, column_id: columnId}
  try {
    const { data } = await conexion.from('tasks').insert(task).select();
    return data[0];
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const removeTask = async (taskId, columnId, userId) => {
  if (!(await columnBelongsToUser(columnId, userId))) return false;
  try {
    const { data, error } = await conexion
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('column_id', columnId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting task:', error.message);
    return false;
  }
};


module.exports = {
  getTasksByColumnId,
  createTask,
  removeTask
};