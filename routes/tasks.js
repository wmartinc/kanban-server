const express = require('express');
const tasksRoute = express.Router();
const { getTasksByColumnId, createTask, removeTask } = require('../databaseActions/tasksDB')
const { verifySesion } = require('../utils/jwtVerifications');

tasksRoute.use(verifySesion)

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

tasksRoute.post("/", async (req, resp) => {
  const {task, columnId} = req.body
  const data = await createTask(task, columnId)

  if(!data) return resp.status(400).json({ confirmation: false, message: "Error, no se pudo crear la tarea" });
  resp.status(200).json({ confirmation: true, data })
})

tasksRoute.delete("/", async (req, resp) => {
  const { taskId, columnId } = req.body;
  const confirmation = await removeTask(taskId, columnId);

  if(confirmation) return resp.status(200).json({ confirmation: true, message: "Task removed correctly" });
  return resp.status(400).json({ confirmation: false, message: "Error, task not removed" })
})

module.exports = {
  tasksRoute
};
