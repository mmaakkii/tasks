import { IUser } from '@entities/User'
import { IClientData } from '@shared/JwtService'
import { IUserDocument } from '../../modules/users/types/user'

declare module 'express' {
  export interface Request {
    user?: IUserDocument
    body: any
  }
}

declare global {
  namespace Express {
    export interface Response {
      sessionUser: IClientData
    }
  }
}
