import { IUserDocument } from '../../modules/users/types/user'

export interface IEmail {
  to: string
  from: string
  firstName: string
  user: IUserDocument
  url?: string
}
