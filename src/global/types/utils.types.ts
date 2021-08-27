import { IUserModel } from '../../modules/users/types/user'

export type FactoryModel = {
  Model: IUserModel
}

export type CreateToken = {
  token: string
  hashedToken: string
}
