const express = require('express');
const { getTasksByColumnId } = require('../databaseActions/tasksDB');
const tasksRoute = express.Router();

// Support query parameter: GET /api/tasks?columnId=xxx
tasksRoute.get('/', async (req, res) => {
  const { columnId } = req.query;
  if (!columnId) {
    return res.status(400).json({ confirmation: false, message: 'columnId is required as a query parameter or path parameter' });
  }
  const tasks = await getTasksByColumnId(columnId);
  if (tasks !== null) {
    return res.status(200).json({ confirmation: true, tasks });
  }
  return res.status(400).json({ confirmation: false });
});

// Support path parameter: GET /api/tasks/:columnId
tasksRoute.get('/:columnId', async (req, res) => {
  const { columnId } = req.params;
  const tasks = await getTasksByColumnId(columnId);
  if (tasks !== null) {
    return res.status(200).json({ confirmation: true, tasks });
  }
  return res.status(400).json({ confirmation: false });
});

module.exports = {
  tasksRoute
};
