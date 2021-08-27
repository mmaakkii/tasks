"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskList = exports.updateTaskList = exports.getTaskList = exports.createTaskList = exports.deleteTask = exports.updateTask = exports.getTask = exports.createTask = void 0;
const models_1 = require("./models");
const handlerFactory_1 = require("@global/handlerFactory");
const catchAsync_1 = require("@global/catchAsync");
const validators_1 = require("./validators");
const utils_1 = require("@global/utils");
const constants_1 = require("./constants");
/* Task List Controllers */
exports.createTask = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    body.creator = user;
    const factory = new handlerFactory_1.Factory({
        model: models_1.Task,
        data: body,
        schema: validators_1.createTaskSchema,
    });
    const response = yield factory.createOne();
    const statusCode = utils_1.getResponseStatus(response, true);
    res.status(statusCode).json(response);
}));
exports.getTask = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const factory = new handlerFactory_1.Factory({ model: models_1.Task, uid });
    const response = yield factory.getOne();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
exports.updateTask = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const { body, user } = req;
    const data = Object.assign(Object.assign({}, body), { editor: user, updatedAt: Date.now() });
    const factory = new handlerFactory_1.Factory({ model: models_1.Task, uid, data });
    const response = yield factory.updateOne();
    const task = yield models_1.Task.findOne({ uid });
    task.save();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
exports.deleteTask = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const { user } = req;
    const data = {
        editor: user,
        updatedAt: Date.now(),
    };
    const factory = new handlerFactory_1.Factory({ model: models_1.Task, uid, data });
    const response = yield factory.deleteOne();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
/* Task List Controllers */
exports.createTaskList = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    const data = Object.assign(Object.assign({}, body), { creator: user });
    if (user.organization) {
        data.owner = user.organization.id;
        data.ownerType = constants_1.TaskListOwnerTypes.ORGANIZATION;
    }
    else {
        data.owner = user.id;
        data.ownerType = constants_1.TaskListOwnerTypes.INDIVIDUAL;
    }
    const factory = new handlerFactory_1.Factory({
        model: models_1.TaskList,
        data,
        schema: validators_1.createTaskListSchema,
    });
    const response = yield factory.createOne();
    const statusCode = utils_1.getResponseStatus(response, true);
    res.status(statusCode).json(response);
}));
exports.getTaskList = catchAsync_1.catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const factory = new handlerFactory_1.Factory({ model: models_1.TaskList, uid });
    const response = yield factory.getOne();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
exports.updateTaskList = catchAsync_1.catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const { body, user } = req;
    const data = Object.assign(Object.assign({}, body), { editor: user, updatedAt: Date.now() });
    const factory = new handlerFactory_1.Factory({ model: models_1.TaskList, uid, data });
    const response = yield factory.updateOne();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
exports.deleteTaskList = catchAsync_1.catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const { user } = req;
    const data = {
        editor: user,
        updatedAt: Date.now(),
    };
    const factory = new handlerFactory_1.Factory({ model: models_1.TaskList, uid, data });
    const response = yield factory.deleteOne();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
