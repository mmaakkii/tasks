import { Router } from 'express'

import {
  createAccount,
  getAccessToken,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
} from './controller'

const userRoutes = Router()

userRoutes.post('/accounts/create', createAccount)
userRoutes.post('/accounts/token', getAccessToken)
userRoutes.post('/accounts/token/refresh', refreshToken)
userRoutes.post('/accounts/password/forgot', forgotPassword)
userRoutes.post('/accounts/password/reset/:token', resetPassword)
userRoutes.post('/accounts/password/update', updatePassword)
userRoutes.get('/verify-email/:token', verifyEmail)

export { userRoutes }
