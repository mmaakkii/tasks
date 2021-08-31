"use strict";
/* tslint:disable */
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
exports.InvitedUser = exports.User = void 0;
const mongoose_1 = require("mongoose");
const Models_1 = require("@global/Models");
const utils_1 = require("@global/utils");
const constants_1 = require("./constants");
const InvitedUserSchema = new mongoose_1.Schema(Object.assign(Object.assign({}, Models_1.BaseModelSchema.obj), { uid: {
        type: String,
        auto: true,
        unique: true,
        default: () => {
            return utils_1.getModelUID('inv_user');
        },
    }, email: {
        type: String,
        required: true,
        unique: [true, 'A User account with this email already exists.'],
        lowercase: true,
        dropDups: true,
    }, organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    } }), {
    timestamps: true,
});
const UserSchema = new mongoose_1.Schema({
    uid: {
        type: String,
        auto: true,
        unique: true,
        default: () => {
            return utils_1.getModelUID('user');
        },
    },
    firstName: {
        type: String,
        required: [true, ''],
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'User account with this email already exists.'],
        lowercase: true,
        dropDups: true,
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
        required: false,
    },
    userType: {
        type: String,
        enum: [constants_1.UserTypes.INDIVIDUAL, constants_1.UserTypes.ORGANIZATION],
        required: true,
    },
    profileImage: String,
    password: {
        type: String,
        required: [true, 'A password is required'],
        select: false,
        minlength: 8,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    signUpToken: String,
    signUpTokenExpires: Date,
    isVerified: {
        type: Boolean,
        default: false,
        select: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        select: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only run this if the password has been modified.
        if (!this.isModified('password'))
            return next();
        // Has password with cost of 12.
        this.password = yield utils_1.hashPassword(this.password);
        next();
    });
});
// Will do on controller
// UserSchema.pre<IUserDocument>(/^find/, function (next: HookNextFunction) {
//   this.find({ isActive: { $ne: false } });
//   next()
// })
UserSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return utils_1.comparePassword(candidatePassword, userPassword);
    });
};
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};
UserSchema.methods.createPasswordResetToken = function () {
    const { token, hashedToken } = utils_1.createToken();
    this.passwordResetToken = hashedToken;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return token;
};
UserSchema.methods.createSignUpToken = function () {
    const { token, hashedToken } = utils_1.createToken();
    this.signUpToken = hashedToken;
    this.signUpTokenExpires = Date.now() + 60 * 60000 * 24 * 3; // Setting signup reset token expiration to 3 days.
    console.log(token);
    return token;
};
UserSchema.methods.isUserActive = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield exports.User.findOne({ _id: this.id }).select('+isActive');
        return user.isActive;
    });
};
UserSchema.methods.isUserVerified = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield exports.User.findOne({ _id: this.id }).select('+isVerified');
        return user.isVerified;
    });
};
exports.User = mongoose_1.model('User', UserSchema);
exports.InvitedUser = mongoose_1.model('InvitedUser', InvitedUserSchema);
