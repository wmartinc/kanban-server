const { conexion } = require("../controllers/connection")

const changeColumnName = async (columnInformation) => {
  try {
    console.log(columnInformation)
    const { data } = await conexion.from("columns").update(columnInformation).eq("id", columnInformation.id).select("*")
    console.log (data)
  } catch (error) {
    console.log('Ocurrio un error en cambiar el nombre de la columna', error.message)
  }
}

const deleteColumn = async (columnId) => {
  try {
    const { data } = await conexion.from("columns").delete().eq("id", columnId).select("*")
    console.log (data)
  } catch (error) {
  }
}

module.exports = { changeColumnName, deleteColumn }