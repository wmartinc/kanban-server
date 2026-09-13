const { conexion } = require("../controllers/connection")

const createColumn = async (name, tableId="01f547e3-06dd-4195-a858-b17f3857aff9") => {
  try{
    const { data } = conexion.from('columns').insert({column_name: name, id_board: tableId})
    // additionally it would be perfect to check if the id is really belonging to this client. 
    
  } catch(e) {
    console.error(e)
    return false
  }
}

module.exports = { createColumn }