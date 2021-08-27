import { Document, Model } from 'mongoose'

import { IBaseModel } from '../../../global/types/Models.types'
import { IUserDocument } from '../../users/types/user'

export interface IComment extends IBaseModel {
  text: string
  media: Array<string>
}

export interface ICommentDocument extends IComment, Document {
  getStatus: () => string
}

export interface ITag extends IBaseModel {
  name: string
}

export interface ITask extends IBaseModel {
  title: string
  description: string
  currentStatus: string
  assignee: IUserDocument
  media: Array<string>
  dueDate: Date
  comments: Array<IComment>
  tags: Array<ITag>
  linkedTasks: Array<ITask>
  subTasks: Array<ITask>
  collaborators: Array<IUserDocument>
  taskList: ITaskListDocument
}

export interface ITaskList extends IBaseModel {
  title: string
  owner: string
  ownerType: string
  showOnBoard: boolean
}

export interface ITaskDocument extends ITask, Document {
  getCollaboratorsNames: () => Array<string>
}

export interface ITaskListDocument extends ITaskList, Document {}

export interface ITaskListModel extends Model<ITaskListDocument> {}
export interface ITaskModel extends Model<ITaskDocument> {}
