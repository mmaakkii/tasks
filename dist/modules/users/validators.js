"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.createUserAccountSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserAccountSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().required(),
    lastName: joi_1.default.string().trim().required(),
    email: joi_1.default.string().trim().required(),
    userType: joi_1.default.string().trim().required(),
    password: joi_1.default.string().min(8).max(64).required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().trim().required(),
    password: joi_1.default.string().trim().required(),
});
