"use strict";
/* eslint-disable */
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
exports.Factory = void 0;
const catchAsync_1 = require("./catchAsync");
// import { AppError } from './appError'
// import { ITag, ITask, IComment } from '../modules/tasks/types/Tasks.types'
const createOne = (Model) => catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.create(req.body);
    res.status(201).json({
        status: 'created',
        data: {
            data: doc,
        },
    });
}));
class Factory {
    constructor({ model, data = null, uid = null, schema = null }) {
        this.model = model;
        this.data = data;
        this.schema = schema;
        this.uid = uid;
        this.responseObj = { success: false, errors: {}, data: null };
    }
    serverError(error, errorType) {
        this.responseObj.errors[errorType] = error.message;
        this.responseObj.data = undefined;
        return this.responseObj;
    }
    success(doc) {
        this.responseObj.data = doc;
        this.responseObj.success = true;
        this.responseObj.errors = undefined;
        return this.responseObj;
    }
    doesNotExists() {
        this.responseObj.data = undefined;
        this.responseObj.success = false;
        this.responseObj.errors.NotFound = 'Requested resource does not exists.';
        return this.responseObj;
    }
    performCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDoc = yield this.model.create(this.data);
                this.responseObj.data = newDoc;
                this.responseObj.success = true;
                this.responseObj.errors = undefined;
                return this.responseObj;
            }
            catch (err) {
                return this.serverError(err, 'createError');
            }
        });
    }
    createOne() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.schema) {
                    const isValid = this.schema.validate(this.data);
                    if (isValid.error) {
                        this.responseObj.errors = unescape(isValid.error.message);
                        this.responseObj.data = undefined;
                        return this.responseObj;
                    }
                }
                const response = yield this.performCreate();
                return response;
            }
            catch (err) {
                return this.serverError(err, 'unknown');
            }
        });
    }
    getOne() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.model.findOne({ uid: this.uid, isDeleted: false });
                if (doc) {
                    this.responseObj.data = doc;
                    this.responseObj.success = true;
                    this.responseObj.errors = undefined;
                    return this.responseObj;
                }
                else {
                    return this.doesNotExists();
                }
            }
            catch (err) {
                return this.serverError(err, 'unknown');
            }
        });
    }
    updateOne() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { uid: this.uid };
                const doc = yield this.model.findOneAndUpdate(filter, this.data, {
                    new: true,
                });
                if (doc) {
                    // doc.save()
                    return this.success(doc);
                }
                return this.doesNotExists();
            }
            catch (err) {
                return this.serverError(err, 'unknown');
            }
        });
    }
    deleteOne() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { uid: this.uid, isDeleted: false };
                const update = Object.assign({ isDeleted: true }, this.data);
                const doc = yield this.model.findOneAndUpdate(filter, update);
                if (doc) {
                    return this.success(undefined);
                }
                return this.doesNotExists();
            }
            catch (err) {
                return this.serverError(err, 'unknown');
            }
        });
    }
}
exports.Factory = Factory;
exports.default = {
    createOne,
};
