import { Router } from 'express';
import { protect } from '../users/controller';
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  createTaskList,
  getTaskList,
  updateTaskList,
  deleteTaskList,
} from './controller';

const taskRoutes = Router();

taskRoutes.post('/', protect, createTask);
taskRoutes
  .route('/:uid')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

taskRoutes.post('/task-list', protect, createTaskList);
taskRoutes
  .route('/task-list/:uid')
  .get(protect, getTaskList)
  .put(protect, updateTaskList)
  .delete(protect, deleteTaskList);

export { taskRoutes };
