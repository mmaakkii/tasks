import { randomBytes, createHash } from 'crypto'
import { hash, compare } from 'bcrypt'
import { Schema, SchemaDefinition } from 'mongoose'

import { CreateToken } from './types/utils.types'

export const getModelUID = (prefix: string): string => {
  const token = randomBytes(10).toString('hex')
  return `${prefix}_${token}`
}

export const extend = (baseSchema: SchemaDefinition, obj) =>
  new Schema(Object.assign({}, baseSchema.obj, obj))

export const hashPassword = (password: string): Promise<string> => hash(password, 12)

export const comparePassword = (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> => compare(candidatePassword, userPassword)

export const createHashedToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex')

export const createToken = (): CreateToken => {
  const token = randomBytes(32).toString('hex')
  const hashedToken = createHashedToken(token)
  return { token, hashedToken }
}

export const getResponseStatus = (responseObj: any, isCreate = false): number => {
  const { errors } = responseObj
  if (errors && Object.keys(errors).length) {
    if (errors.unknown) {
      return 500
    }
    if (errors.NotFound) {
      return 404
    }
    return 400
  }
  return isCreate ? 201 : 200
}
