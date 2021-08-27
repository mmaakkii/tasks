import { Document } from 'mongoose'

import { IUserModel } from '../../modules/users/types/user'

export interface IBaseModel extends Document {
  uid: string
  isDeleted: boolean
}

export interface ITrackedModel extends IBaseModel {
  creator: IUserModel
  editor: IUserModel
}
