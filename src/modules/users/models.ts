/* tslint:disable */

import { model, Schema, HookNextFunction } from 'mongoose';
import { BaseModelSchema } from '@global/Models';

import {
  getModelUID,
  hashPassword,
  comparePassword,
  createToken,
} from '@global/utils';
import { UserTypes } from './constants';
import {
  IInvitedUserDocument,
  IInvitedUserModel,
  IUserDocument,
  IUserModel,
  UserSchemaDefinition,
} from './types/user';

const InvitedUserSchema = new Schema<IInvitedUserDocument, IInvitedUserModel>(
  {
    ...BaseModelSchema.obj,
    uid: {
      type: String,
      auto: true,
      unique: true,
      default: () => {
        return getModelUID('inv_user');
      },
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'A User account with this email already exists.'],
      lowercase: true,
      dropDups: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    uid: {
      type: String,
      auto: true,
      unique: true,
      default: () => {
        return getModelUID('user');
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
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: false,
    },
    userType: {
      type: String,
      enum: [UserTypes.INDIVIDUAL, UserTypes.ORGANIZATION],
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
  },
  {
    timestamps: true,
  }
);

// https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1

UserSchema.pre<IUserDocument>('save', async function (next: HookNextFunction) {
  // Only run this if the password has been modified.
  if (!this.isModified('password')) return next();

  // Has password with cost of 12.
  this.password = await hashPassword(this.password);
  next();
});

// Will do on controller
// UserSchema.pre<IUserDocument>(/^find/, function (next: HookNextFunction) {
//   this.find({ isActive: { $ne: false } });

//   next()
// })

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return comparePassword(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (
  this: IUserDocument,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function (this: IUserDocument) {
  const { token, hashedToken } = createToken();
  this.passwordResetToken = hashedToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

UserSchema.methods.createSignUpToken = function (this: IUserDocument) {
  const { token, hashedToken } = createToken();
  this.signUpToken = hashedToken;
  this.signUpTokenExpires = Date.now() + 60 * 60000 * 24 * 3; // Setting signup reset token expiration to 3 days.
  console.log(token);
  return token;
};

UserSchema.methods.isUserActive = async function (this: IUserDocument) {
  const user: IUserDocument = await User.findOne({ _id: this.id }).select(
    '+isActive'
  );
  return user.isActive;
};

UserSchema.methods.isUserVerified = async function (this: IUserDocument) {
  const user: IUserDocument = await User.findOne({ _id: this.id }).select(
    '+isVerified'
  );
  return user.isVerified;
};

export const User = model<IUserDocument, IUserModel>('User', UserSchema);
export const InvitedUser = model<IInvitedUserDocument, IInvitedUserModel>(
  'InvitedUser',
  InvitedUserSchema
);
