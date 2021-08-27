"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.protect = exports.verifyEmail = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.isLoggedIn = exports.getAccessToken = exports.createAccount = void 0;
const HttpErrors = __importStar(require("http-errors"));
const catchAsync_1 = require("@global/catchAsync");
const models_1 = require("./models");
const email_1 = __importDefault(require("@global/email"));
const utils_1 = require("@global/utils");
const appError_1 = __importDefault(require("@global/appError"));
const utils_2 = require("./utils");
const validators_1 = require("./validators");
const constants_1 = require("./constants");
const createAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        body.userType = constants_1.UserTypes.INDIVIDUAL;
        const isValid = validators_1.createUserAccountSchema.validate(body);
        if (isValid.error) {
            return next(new appError_1.default(unescape(isValid.error.message), 400));
        }
        const newUser = yield models_1.User.create(body);
        const token = newUser.createSignUpToken();
        const url = `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${token}`;
        yield newUser.save({ validateBeforeSave: false });
        yield new email_1.default(newUser, url).sendWelcome();
        res.status(201).json({
            success: true,
            doc: newUser,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            error: err.code && err.code === 11000 ? 'A user with that email already exists' : err.message,
        });
    }
});
exports.createAccount = createAccount;
exports.getAccessToken = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const isValid = validators_1.loginSchema.validate(body);
    if (isValid.error) {
        throw new HttpErrors.BadRequest(unescape(isValid.error.message));
    }
    const { email, password } = body;
    // Check if user exists and the password is correct
    const user = yield models_1.User.findOne({ email }).select('+password +isVerified');
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next(new appError_1.default(constants_1.AuthErrors.INCORRECT_CREDENTIALS, 401));
    }
    if (!user.isVerified) {
        return next(new appError_1.default(constants_1.AuthErrors.USER_NOT_VERIFIED, 401));
    }
    // If everything is ok, send token to the client.
    utils_2.createSendToken(user, 200, res);
}));
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = utils_2.decodeToken(token);
            // Checking if the user still exists.
            const currentUser = yield models_1.User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
            if (!currentUser) {
                return next();
            }
            // Checking if user changed password after token was issued.
            if (currentUser.changedPasswordAfter(decodedToken.iat)) {
                return next();
            }
            // All good, we have a user. Attach it to the response for further use.
            res.locals.user = currentUser;
            return next();
        }
    }
    catch (err) {
        return next();
    }
    next();
});
exports.isLoggedIn = isLoggedIn;
// export const restrictTo = (...roles) => {
//   // roles = ['admin', 'lead-guide']
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(new AppError(AuthErrors.USER_NOT_PERMITTED, 403));
//     }
//     next();
//   };
// };
// https://www.npmjs.com/package/express-jwt
exports.refreshToken = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting token and checking if it exists
    const { body } = req;
    if (!exports.refreshToken)
        return next(new appError_1.default(constants_1.AuthErrors.REFRESH_TOKEN_NOT_FOUND, 404));
    const decodedToken = utils_2.decodeToken(body === null || body === void 0 ? void 0 : body.refreshToken);
    const currentUser = yield models_1.User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
    if (!currentUser) {
        res.status(401).json({
            success: false,
            message: constants_1.AuthErrors.INVALID_TOKEN,
        });
    }
    if (currentUser.changedPasswordAfter(decodedToken.iat)) {
        res.status(401).json({
            success: false,
            message: constants_1.AuthErrors.USER_CHANGED_PASSWORD,
        });
    }
    utils_2.createSendToken(currentUser, 200, res, false);
}));
exports.forgotPassword = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting user based on POSTed email.
    const { body: { email }, } = req;
    const user = yield models_1.User.findOne({ email });
    if (!user) {
        res.status(200).json({
            success: true,
            message: 'Password reset email send if user exists.',
        });
    }
    // Generating a random reset token.
    if (user) {
        const resetToken = user.createPasswordResetToken();
        yield user.save({ validateBeforeSave: false });
        const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        try {
            yield new email_1.default(user, resetURL).sendPasswordReset();
            res.status(200).json({
                success: true,
                message: 'Password reset email send if user exists.',
            });
        }
        catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            yield user.save({ validateBeforeSave: false });
            return next(new appError_1.default('There was an error sending email. Try again later.', 500));
        }
    }
}));
exports.resetPassword = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { token }, } = req;
    const { body: { password }, } = req;
    const hashedToken = utils_1.createHashedToken(token);
    const user = yield models_1.User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    // If the token has not expired and there is user, Then setting the new password.
    if (!user) {
        return next(new appError_1.default(constants_1.AuthErrors.INVALID_TOKEN, 400));
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    // Updating changedPasswordAt property of the user. --Done at model level
    res.status(200).json({
        success: true,
        message: 'Password reset success',
    });
}));
exports.updatePassword = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting user from collection.
    const userData = yield utils_2.getUserById(req.user.id, ['+password']);
    const { user } = userData;
    // Checking if POSTed current password is correct.
    if (!(yield user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new appError_1.default(constants_1.AuthErrors.INVALID_CURRENT_PASSWORD, 401));
    }
    // If so, updating the password.
    user.password = req.body.password;
    yield user.save();
    // Log the user in, sending JWT.
    utils_2.createSendToken(user, 200, res);
}));
exports.verifyEmail = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { token }, } = req;
    if (!token) {
        return next(new appError_1.default(constants_1.AuthErrors.TOKEN_NOT_FOUND, 404));
    }
    // Getting user based on token
    const hashedToken = utils_1.createHashedToken(token);
    const user = yield models_1.User.findOne({
        signUpToken: hashedToken,
        signUpTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
        res.status(400).json({
            success: false,
            message: constants_1.AuthErrors.EMAIL_VERIFICATION_FAILED,
        });
    }
    // User found, set as verified.
    yield models_1.User.findByIdAndUpdate(user.id, { isVerified: true });
    return res.status(200).json({
        success: true,
        message: 'Email successfully verified',
    });
}));
exports.protect = catchAsync_1.catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Getting token and checking if it exists.
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else {
        return next(new appError_1.default(constants_1.AuthErrors.NOT_LOGGED_IN, 401));
    }
    // Verifying token.
    const decodedToken = utils_2.decodeToken(token);
    // Checking if the user still exists.
    const user = yield utils_2.createUserResponse(decodedToken.id, constants_1.UserIdentifierType.ID, res, next, true);
    // const userData: GetUserByParam = await getUserById(decodedToken.id)
    // const { user, isVerified, isActive, isDeleted } = userData
    if (user) {
        // Checking if user changed password after token was issued.
        if (user.changedPasswordAfter(decodedToken.iat)) {
            return next(new appError_1.default('User recently changed password. Please log in again.', 403));
        }
        // Grant access to protected route.
        req.user = user;
        res.locals.user = user;
        next();
    }
    else {
        return next(new appError_1.default('The user belonging to this token does no longer exist.', 403));
    }
}));
