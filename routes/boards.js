const express = require('express');
const { getAllBoards, createBoard, getFavorites, getBoardInfo, getFavorite, createColumn, removeBoard } = require('../databaseActions/boardsDB');
const { checkTitleBoard, checkDescriptionBoard } = require('../utils/format');
const { verifySesion } = require('../utils/jwtVerifications');
const boardRoute = express.Router()

boardRoute.use(verifySesion)

boardRoute.get('/', async(req, resp)=> {
  const user = req.user
  if(!user) return resp.status(401).json({message: 'Something went wrong!', confirmation: false});
  const boards = await getAllBoards(user.id);
  return resp.status(200).json({confirmation: true, content: boards});
})

// Adding sanitization to create boards.
boardRoute.post('/createBoard', async(req, resp) => {
  const user = req.user
  if(!user) return resp.status(401).json({message: 'Something went wrong!', confirmation: false});

  const {boardName, description, is_favorite}   = req.body
  if (!checkTitleBoard(boardName) || !checkDescriptionBoard(description)) {
    return resp.status(400).json({ confirmation: false, message: 'Something went wrong...' });
  }

  const boardCreated = await createBoard(boardName, description, user.id, is_favorite)
  if(boardCreated) return resp.status(201).json({confirmation: true});
  return resp.status(400).json({confirmation: false})
})

boardRoute.get("/favorites", async(req, resp) => {
  const user = req.user
  if(!user) return resp.status(401).json({message: 'Something went wrong!', confirmation: false});

  const favoriteTasks = await getFavorites(user.id);
  if(favoriteTasks) return resp.status(200).json({confirmation: true, content: favoriteTasks});
  return resp.status(400).json({confirmation: false})
})

boardRoute.get('/checkFavorite/:id', async(req, resp) => {
  const user = req.user
  if(!user) return resp.status(401).json({message: 'Something went wrong!', confirmation: false});

  const boardId = req.params.id;
  const isFavorite = await getFavorite(boardId, user.id);
  if(!isFavorite) return resp.status(404).json({confirmation: false})
  return resp.status(200).json({confirmation: true, isFavorite});
})

boardRoute.get('/board/:boardId', async(req, res) => {
  const user = req.user
  if(!user) return res.status(401).json({message: 'Something went wrong!', confirmation: false});

  const { boardId } = req.params;
  const boardInformation = await getBoardInfo(boardId, user.id);
  if(boardInformation) return res.status(200).json({confirmation: true, boardInformation});
  return res.status(400).json({confirmation: false})
})

boardRoute.post("/createColumn", async(req, resp) => {
  const user = req.user
  if(!user) return resp.status(401).json({message: 'Something went wrong!', confirmation: false});

  const { columnName, boardId } = req.body;
  const columnCreated = await createColumn(columnName, user.id, boardId)

  if(columnCreated) return resp.status(201).json({confirmation: true, content: columnCreated})
  return resp.status(400).json({confirmation: false})
})

boardRoute.delete('/board/:boardId', async(req, resp) => {
  const user = req.user
  if(!user) return resp.status(401).json({message: 'Something went wrong!', confirmation: false});

  const { boardId } = req.params;
  const confirmation = await removeBoard(boardId, user.id);

  if(confirmation) return resp.status(200).json({ confirmation: true, message: "Board removed correctly" });
  return resp.status(400).json({ confirmation: false, message: "Error, board not removed" })
})

module.exports = {
  boardRoute
}