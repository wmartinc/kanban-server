const express = require('express');
const { getAllBoards, createBoard, getFavorites, getBoardInfo, getFavorite, createColumn } = require('../databaseActions/boardsDB');
const { checkTitleBoard, checkDescriptionBoard } = require('../utils/format');
const boardRoute = express.Router()

boardRoute.get('/', async(req, resp)=> {
  const boards = await getAllBoards();
  return resp.status(200).json({confirmation: true, content: boards});
})

// Adding sanitization to create boards.
boardRoute.post('/createBoard', async(req, resp) => {
  const {boardName, description} = req.body
  if (!checkTitleBoard(boardName) || !checkDescriptionBoard(description)) {
    return resp.status(400).json({ confirmation: false, message: 'Something went wrong...' });
  }

  const boardCreated = await createBoard(boardName, description)
  if(boardCreated) return resp.status(201).json({confirmation: true});
  return resp.status(400).json({confirmation: false})
})

boardRoute.get("/favorites", async(req, resp) => {
  const favoriteTasks = await getFavorites();
  if(favoriteTasks) return resp.status(200).json({confirmation: true, content: favoriteTasks});
  return resp.status(400).json({confirmation: false})
})

boardRoute.get('/checkFavorite/:id', async(req, resp) => {
  const boardId = req.params.id;
  const isFavorite = await getFavorite(boardId);
  if(!isFavorite) return resp.status(404).json({confirmation: false})
  return resp.status(200).json({confirmation: true, isFavorite});
})

boardRoute.get('/board/:boardName', async(req, res) => {
  const { boardName } = req.params;
  
  const boardInformation = await getBoardInfo(boardName);
  if(boardInformation) return res.status(200).json({confirmation: true, boardInformation});
  return res.status(400).json({confirmation: false})
})

boardRoute.post("/createColumn", async(req, resp) => {
  const { columnName } = req.body;

  console.log("here", columnName)

  const columnCreated = await createColumn(columnName)

  if(columnCreated) return resp.status(201).json({confirmation: true, content: columnCreated})
  return resp.status(400).json({confirmation: false})
})

module.exports = {
  boardRoute
}