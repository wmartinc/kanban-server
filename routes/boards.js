const express = require('express');
const { getAllBoards, createBoard, getFavorites, getBoardInfo } = require('../databaseActions/boardsDB');
const boardRoute = express.Router()

boardRoute.get('/', async(req, resp)=> {
  console.log("laksdja")
  const boards = await getAllBoards();
  return resp.status(200).json({confirmation: true, content: boards});
})

// Adding sanitization to create boards.
boardRoute.post('/createBoard', async(req, resp) => {
  const {boardName, description} = req.body
  const boardCreated = await createBoard(boardName, description)
  if(boardCreated) return resp.status(201).json({confirmation: true});
  return resp.status(400).json({confirmation: false})
})

boardRoute.get("/favorites", async(req, resp) => {
  const favoriteTasks = await getFavorites();
  if(favoriteTasks) return resp.status(200).json({confirmation: true, favorites: favoriteTasks});
  return resp.status(400).json({confirmation: false})
})

boardRoute.get('/board/:boardName', async(req, res) => {
  const { boardName } = req.params;
  const boardInformation = await getBoardInfo(boardName);
  if(boardInformation) return res.status(200).json({confirmation: true, boardInformation});
  return res.status(400).json({confirmation: false})
})

module.exports = {
  boardRoute
}