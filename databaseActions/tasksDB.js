const { conexion } = require('../controllers/connection');

const getTasksByColumnId = async (columnId) => {
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

const createTask = async (task, columnId) => {
  task = {...task, column_id: columnId}
  try {
    const { data } = await conexion.from('tasks').insert(task).select();
    return data[0];
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const removeTask = async (taskId, columnId) => {
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
