import { Schema } from 'mongoose'
import { IBaseModel } from './types/Models.types'

export const BaseModelSchema = new Schema<IBaseModel>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, ''],
  },
  editor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

// https://stackoverflow.com/a/45378088
