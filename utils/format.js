const checkEmail = (email) => {
  const match = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/)
  return match;
}

const checkTitleBoard = (title) => {
  const titleRegex = /^(?=.*[\p{L}\p{N}])[\p{L}\p{N} _\-?!.,:'¿¡]{1,30}$/u;
  if(title.match(titleRegex)) return true
  return false
}

const checkDescriptionBoard = (description) => {
  if(description.length == 0) return true
  const descriptionRegex = /^(?=.*[\p{L}\p{N}])[\p{L}\p{N} _\-?!.,:'¿¡]{1,100}$/u;
  if(description.match(descriptionRegex)) return true
  return false
}

const checkGeneralText = (text) => {
}

module.exports = {
  checkEmail,
  checkTitleBoard,
  checkDescriptionBoard,
  checkGeneralText
}