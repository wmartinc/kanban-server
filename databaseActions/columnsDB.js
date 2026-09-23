const { conexion } = require("../controllers/connection")

const changeColumnName = async (columnInformation) => {
  try {
    const { data } = await conexion.from("columns").update(columnInformation).eq("id", columnInformation.id).select("*")
    return data
  } catch (error) {
    console.log('Ocurrio un error en cambiar el nombre de la columna', error.message)
    return false
  }
}

const deleteColumn = async (columnId) => {
  try {
    const { data } = await conexion.from("columns").delete().eq("id", columnId).select("*")
    return data
  } catch (error) {
    console.log('Ocurrio un error en eliminar la columna', error.message)
    return false
  }
}

module.exports = { changeColumnName, deleteColumn }