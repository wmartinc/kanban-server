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

module.exports = {
  getTasksByColumnId
};
