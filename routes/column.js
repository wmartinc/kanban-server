const express = require('express');
const columnRoute = express.Router();
const { verifySesion } = require('../utils/jwtVerifications');
const { createColumn } = require('../databaseActions/columnsDB');

columnRoute.post('/new-column', verifySesion, async (req, resp) => {
  const { name } = req.body;
  if (!name) return resp.status(400).json({ confirmation: false, content: "Missing name" });

  const isCreated = await createColumn(name);

})

module.exports = columnRoute;