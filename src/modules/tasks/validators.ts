import Joi from 'joi'

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().required(),
  taskList: Joi.string().trim(),
  description: Joi.string().trim(),
  media: Joi.string().trim(),
  dueDate: Joi.date(),
  creator: Joi.object().required(),
})

export const createTaskListSchema = Joi.object({
  title: Joi.string().trim().required(),
  owner: Joi.string().trim().required(),
  ownerType: Joi.string().trim().required(),
  showOnBoard: Joi.boolean(),
  creator: Joi.object().required(),
})
