import Joi from 'joi';

export const createUserAccountSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().required(),
  userType: Joi.string().trim().required(),
  password: Joi.string().min(8).max(64).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().required(),
});
