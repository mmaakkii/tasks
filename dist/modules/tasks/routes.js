"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("../users/controller");
const controller_2 = require("./controller");
const taskRoutes = express_1.Router();
exports.taskRoutes = taskRoutes;
taskRoutes.post('/', controller_1.protect, controller_2.createTask);
taskRoutes
    .route('/:uid')
    .get(controller_1.protect, controller_2.getTask)
    .put(controller_1.protect, controller_2.updateTask)
    .delete(controller_1.protect, controller_2.deleteTask);
taskRoutes.post('/task-list', controller_1.protect, controller_2.createTaskList);
taskRoutes
    .route('/task-list/:uid')
    .get(controller_1.protect, controller_2.getTaskList)
    .put(controller_1.protect, controller_2.updateTaskList)
    .delete(controller_1.protect, controller_2.deleteTaskList);
