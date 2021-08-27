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
exports.deleteOrganization = exports.updateOrganization = exports.getOrganization = exports.createOrganization = void 0;
const catchAsync_1 = require("@global/catchAsync");
const handlerFactory_1 = require("@global/handlerFactory");
const utils_1 = require("@global/utils");
const models_1 = require("./models");
const validators_1 = require("./validators");
exports.createOrganization = catchAsync_1.catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req;
    const data = Object.assign(Object.assign({}, body), { creator: user });
    const factory = new handlerFactory_1.Factory({
        model: models_1.Organization,
        data,
        schema: validators_1.createOrganizationSchema,
    });
    const response = yield factory.createOne();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
exports.getOrganization = catchAsync_1.catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const factory = new handlerFactory_1.Factory({ model: models_1.Organization, uid });
    const response = yield factory.getOne();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
exports.updateOrganization = catchAsync_1.catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const { body, user } = req;
    const data = Object.assign(Object.assign({}, body), { editor: user, updatedAt: Date.now() });
    const factory = new handlerFactory_1.Factory({ model: models_1.Organization, uid, data });
    const response = yield factory.updateOne();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
exports.deleteOrganization = catchAsync_1.catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const { user } = req;
    const data = {
        editor: user,
        updatedAt: Date.now(),
    };
    const factory = new handlerFactory_1.Factory({ model: models_1.Organization, uid, data });
    const response = yield factory.deleteOne();
    const statusCode = utils_1.getResponseStatus(response);
    res.status(statusCode).json(response);
}));
