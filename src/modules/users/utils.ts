import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

import { IUserDocument, GetUserByParam } from '../users/types/user';

import { ObjectId } from 'mongoose';
import { User } from './models';
import { AuthErrors, UserIdentifierType } from './constants';
import AppError from '@global/appError';

export const signToken = (id: ObjectId, sendRefreshToken: boolean) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
  if (!sendRefreshToken) {
    return { accessToken };
  }
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

export const createSendToken = (
  user: IUserDocument,
  statusCode: number,
  res: Response,
  sendRefreshToken = true
) => {
  const tokens = signToken(user._id, sendRefreshToken);
  let status = '';
  status = String(statusCode).startsWith('2') ? 'success' : 'fail';
  // Removing password from output
  user.password = undefined;
  res.status(statusCode).json({
    status,
    tokens,
  });
};

export const decodeToken = (token: string): string | JwtPayload =>
  jwt.verify(token, process.env.JWT_SECRET);

export const getUserById = async (
  id: string,
  selectProperties?: Array<string>
): Promise<GetUserByParam> => {
  let user: IUserDocument;
  if (selectProperties) {
    const selectors = selectProperties.join(' ');
    user = await User.findById(id).select(selectors);
  } else {
    user = await User.findById(id);
  }

  if (user) {
    const isActive = await user.isUserActive();
    const isVerified = await user.isUserVerified();
    return {
      user,
      isActive,
      isVerified,
      isDeleted: user.isDeleted,
    };
  }
  return { user: null };
};

export const getUserByEmail = async (
  email: string,
  selectProperties?: Array<string>
): Promise<GetUserByParam> => {
  let user: IUserDocument;
  if (selectProperties) {
    const selectors = selectProperties.join(' ');
    user = await User.findOne({ email }).select(selectors);
  } else {
    user = await User.findOne({ email });
  }
  if (user) {
    const isActive = await user.isUserActive();
    const isVerified = await user.isUserVerified();
    return {
      user,
      isActive,
      isVerified,
      isDeleted: user.isDeleted,
    };
  }
  return { user: null };
};

export const createUserResponse = async (
  identifier: string,
  identifierType: UserIdentifierType.ID | UserIdentifierType.EMAIL,
  res: Response,
  next?: NextFunction,
  isAppError?: boolean
) => {
  let userData: GetUserByParam;
  if (identifierType === UserIdentifierType.ID) {
    userData = await getUserById(identifier);
  } else if (identifierType === UserIdentifierType.EMAIL) {
    userData = await getUserByEmail(identifier);
  } else {
    userData = null;
  }
  if (userData && userData?.user) {
    const { isActive, isVerified, isDeleted, user } = userData;
    let message = '';
    if (!isActive) {
      message = AuthErrors.INACTIVE;
    } else if (!isVerified) {
      message = AuthErrors.USER_NOT_VERIFIED;
    } else {
      message = AuthErrors.USER_NOT_FOUND;
    }
    if (!isActive || !isVerified || isDeleted) {
      if (isAppError) {
        return next(new AppError(message, 403));
      } else {
        res.status(403).json({
          success: false,
          message,
        });
      }
    }
    return user;
  } else {
    res.status(403).json({
      success: false,
      message: AuthErrors.USER_NOT_FOUND,
    });
  }
};
