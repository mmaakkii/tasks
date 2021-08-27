import { Response, Request, NextFunction } from 'express'
import * as HttpErrors from 'http-errors'

import { catchAsync } from '@global/catchAsync'
import { User } from './models'
import Email from '@global/email'
import { createHashedToken } from '@global/utils'
import AppError from '@global/appError'
import { createSendToken, createUserResponse, decodeToken, getUserById } from './utils'
import { createUserAccountSchema, loginSchema } from './validators'
import { IUserDocument, GetUserByParam } from './types/user'
import { AuthErrors, UserIdentifierType, UserTypes } from './constants'

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req
    body.userType = UserTypes.INDIVIDUAL
    const isValid = createUserAccountSchema.validate(body)
    if (isValid.error) {
      return next(new AppError(unescape(isValid.error.message), 400))
    }
    const newUser = await User.create(body)
    const token = newUser.createSignUpToken()
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${token}`
    await newUser.save({ validateBeforeSave: false })
    await new Email(newUser, url).sendWelcome()
    res.status(201).json({
      success: true,
      doc: newUser,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.code && err.code === 11000 ? 'A user with that email already exists' : err.message,
    })
  }
}

export const getAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req
    const isValid = loginSchema.validate(body)
    if (isValid.error) {
      throw new HttpErrors.BadRequest(unescape(isValid.error.message))
    }
    const { email, password } = body
    // Check if user exists and the password is correct
    const user: IUserDocument = await User.findOne({ email }).select('+password +isVerified')
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError(AuthErrors.INCORRECT_CREDENTIALS, 401))
    }

    if (!user.isVerified) {
      return next(new AppError(AuthErrors.USER_NOT_VERIFIED, 401))
    }
    // If everything is ok, send token to the client.
    createSendToken(user, 200, res)
  }
)

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1]
      const decodedToken: any = decodeToken(token)
      // Checking if the user still exists.
      const currentUser: IUserDocument | null = await User.findById(decodedToken?.id)
      if (!currentUser) {
        return next()
      }
      // Checking if user changed password after token was issued.
      if (currentUser.changedPasswordAfter(decodedToken.iat)) {
        return next()
      }
      // All good, we have a user. Attach it to the response for further use.
      res.locals.user = currentUser
      return next()
    }
  } catch (err) {
    return next()
  }
  next()
}

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

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Getting token and checking if it exists
  const { body } = req
  if (!refreshToken) return next(new AppError(AuthErrors.REFRESH_TOKEN_NOT_FOUND, 404))
  const decodedToken: any = decodeToken(body?.refreshToken)
  const currentUser: IUserDocument = await User.findById(decodedToken?.id)
  if (!currentUser) {
    res.status(401).json({
      success: false,
      message: AuthErrors.INVALID_TOKEN,
    })
  }
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    res.status(401).json({
      success: false,
      message: AuthErrors.USER_CHANGED_PASSWORD,
    })
  }
  createSendToken(currentUser, 200, res, false)
})

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Getting user based on POSTed email.
    const {
      body: { email },
    } = req
    const user: IUserDocument | null = await User.findOne({ email })
    if (!user) {
      res.status(200).json({
        success: true,
        message: 'Password reset email send if user exists.',
      })
    }
    // Generating a random reset token.
    if (user) {
      const resetToken = user.createPasswordResetToken()
      await user.save({ validateBeforeSave: false })
      const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`
      try {
        await new Email(user, resetURL).sendPasswordReset()
        res.status(200).json({
          success: true,
          message: 'Password reset email send if user exists.',
        })
      } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })
        return next(new AppError('There was an error sending email. Try again later.', 500))
      }
    }
  }
)

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {
    params: { token },
  } = req
  const {
    body: { password },
  } = req
  const hashedToken = createHashedToken(token)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  // If the token has not expired and there is user, Then setting the new password.
  if (!user) {
    return next(new AppError(AuthErrors.INVALID_TOKEN, 400))
  }
  user.password = password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
  // Updating changedPasswordAt property of the user. --Done at model level
  res.status(200).json({
    success: true,
    message: 'Password reset success',
  })
})

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Getting user from collection.
    const userData = await getUserById(req.user.id, ['+password'])
    const { user } = userData
    // Checking if POSTed current password is correct.
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError(AuthErrors.INVALID_CURRENT_PASSWORD, 401))
    }
    // If so, updating the password.
    user.password = req.body.password
    await user.save()
    // Log the user in, sending JWT.
    createSendToken(user, 200, res)
  }
)

export const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {
    params: { token },
  } = req

  if (!token) {
    return next(new AppError(AuthErrors.TOKEN_NOT_FOUND, 404))
  }
  // Getting user based on token
  const hashedToken = createHashedToken(token)
  const user: IUserDocument = await User.findOne({
    signUpToken: hashedToken,
    signUpTokenExpires: { $gt: Date.now() },
  })
  if (!user) {
    res.status(400).json({
      success: false,
      message: AuthErrors.EMAIL_VERIFICATION_FAILED,
    })
  }
  // User found, set as verified.
  await User.findByIdAndUpdate(user.id, { isVerified: true })
  return res.status(200).json({
    success: true,
    message: 'Email successfully verified',
  })
})

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Getting token and checking if it exists.
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else {
    return next(new AppError(AuthErrors.NOT_LOGGED_IN, 401))
  }
  // Verifying token.
  const decodedToken: any = decodeToken(token)
  // Checking if the user still exists.
  const user: IUserDocument | void = await createUserResponse(
    decodedToken.id,
    UserIdentifierType.ID,
    res,
    next,
    true
  )
  // const userData: GetUserByParam = await getUserById(decodedToken.id)
  // const { user, isVerified, isActive, isDeleted } = userData
  if (user) {
    // Checking if user changed password after token was issued.
    if (user.changedPasswordAfter(decodedToken.iat)) {
      return next(new AppError('User recently changed password. Please log in again.', 403))
    }
    // Grant access to protected route.
    req.user = user
    res.locals.user = user
    next()
  } else {
    return next(new AppError('The user belonging to this token does no longer exist.', 403))
  }
})
