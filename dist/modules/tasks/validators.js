"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskListSchema = exports.createTaskSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createTaskSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    taskList: joi_1.default.string().trim(),
    description: joi_1.default.string().trim(),
    media: joi_1.default.string().trim(),
    dueDate: joi_1.default.date(),
    creator: joi_1.default.object().required(),
});
exports.createTaskListSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    owner: joi_1.default.string().trim().required(),
    ownerType: joi_1.default.string().trim().required(),
    showOnBoard: joi_1.default.boolean(),
    creator: joi_1.default.object().required(),
});
