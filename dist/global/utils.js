"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponseStatus = exports.createToken = exports.createHashedToken = exports.comparePassword = exports.hashPassword = exports.extend = exports.getModelUID = void 0;
const crypto_1 = require("crypto");
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
const getModelUID = (prefix) => {
    const token = crypto_1.randomBytes(10).toString('hex');
    return `${prefix}_${token}`;
};
exports.getModelUID = getModelUID;
const extend = (baseSchema, obj) => new mongoose_1.Schema(Object.assign({}, baseSchema.obj, obj));
exports.extend = extend;
const hashPassword = (password) => bcrypt_1.hash(password, 12);
exports.hashPassword = hashPassword;
const comparePassword = (candidatePassword, userPassword) => bcrypt_1.compare(candidatePassword, userPassword);
exports.comparePassword = comparePassword;
const createHashedToken = (token) => crypto_1.createHash('sha256').update(token).digest('hex');
exports.createHashedToken = createHashedToken;
const createToken = () => {
    const token = crypto_1.randomBytes(32).toString('hex');
    const hashedToken = exports.createHashedToken(token);
    return { token, hashedToken };
};
exports.createToken = createToken;
const getResponseStatus = (responseObj, isCreate = false) => {
    const { errors } = responseObj;
    if (errors && Object.keys(errors).length) {
        if (errors.unknown) {
            return 500;
        }
        if (errors.NotFound) {
            return 404;
        }
        return 400;
    }
    return isCreate ? 201 : 200;
};
exports.getResponseStatus = getResponseStatus;
