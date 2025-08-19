import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {createTask,deleteTask, getTaskById, getTasks, updateTask} from '../controllers/taskController.js';

const taskRoute = express.Router();

taskRoute.route('/gp').get(authMiddleware, getTasks).post(authMiddleware, createTask);

taskRoute.route('/:id/gp').get(authMiddleware, getTaskById)
  .put(authMiddleware, updateTask).delete(authMiddleware, deleteTask);

export default taskRoute;