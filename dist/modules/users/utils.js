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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserResponse = exports.getUserByEmail = exports.getUserById = exports.decodeToken = exports.createSendToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("./models");
const constants_1 = require("./constants");
const appError_1 = __importDefault(require("@global/appError"));
const signToken = (id, sendRefreshToken) => {
    const accessToken = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    if (!sendRefreshToken) {
        return { accessToken };
    }
    const refreshToken = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
};
exports.signToken = signToken;
const createSendToken = (user, statusCode, res, sendRefreshToken = true) => {
    const tokens = exports.signToken(user._id, sendRefreshToken);
    let status = '';
    status = String(statusCode).startsWith('2') ? 'success' : 'fail';
    // Removing password from output
    user.password = undefined;
    res.status(statusCode).json({
        status,
        tokens,
    });
};
exports.createSendToken = createSendToken;
const decodeToken = (token) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
exports.decodeToken = decodeToken;
const getUserById = (id, selectProperties) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    if (selectProperties) {
        const selectors = selectProperties.join(' ');
        user = yield models_1.User.findById(id).select(selectors);
    }
    else {
        user = yield models_1.User.findById(id);
    }
    if (user) {
        const isActive = yield user.isUserActive();
        const isVerified = yield user.isUserVerified();
        return {
            user,
            isActive,
            isVerified,
            isDeleted: user.isDeleted,
        };
    }
    return { user: null };
});
exports.getUserById = getUserById;
const getUserByEmail = (email, selectProperties) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    if (selectProperties) {
        const selectors = selectProperties.join(' ');
        user = yield models_1.User.findOne({ email }).select(selectors);
    }
    else {
        user = yield models_1.User.findOne({ email });
    }
    if (user) {
        const isActive = yield user.isUserActive();
        const isVerified = yield user.isUserVerified();
        return {
            user,
            isActive,
            isVerified,
            isDeleted: user.isDeleted,
        };
    }
    return { user: null };
});
exports.getUserByEmail = getUserByEmail;
const createUserResponse = (identifier, identifierType, res, next, isAppError) => __awaiter(void 0, void 0, void 0, function* () {
    let userData;
    if (identifierType === constants_1.UserIdentifierType.ID) {
        userData = yield exports.getUserById(identifier);
    }
    else if (identifierType === constants_1.UserIdentifierType.EMAIL) {
        userData = yield exports.getUserByEmail(identifier);
    }
    else {
        userData = null;
    }
    if (userData && (userData === null || userData === void 0 ? void 0 : userData.user)) {
        const { isActive, isVerified, isDeleted, user } = userData;
        let message = '';
        if (!isActive) {
            message = constants_1.AuthErrors.INACTIVE;
        }
        else if (!isVerified) {
            message = constants_1.AuthErrors.USER_NOT_VERIFIED;
        }
        else {
            message = constants_1.AuthErrors.USER_NOT_FOUND;
        }
        if (!isActive || !isVerified || isDeleted) {
            if (isAppError) {
                return next(new appError_1.default(message, 403));
            }
            else {
                res.status(403).json({
                    success: false,
                    message,
                });
            }
        }
        return user;
    }
    else {
        res.status(403).json({
            success: false,
            message: constants_1.AuthErrors.USER_NOT_FOUND,
        });
    }
});
exports.createUserResponse = createUserResponse;
