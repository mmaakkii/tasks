import Joi from 'joi';

export const createOrganizationSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
  creator: Joi.object().required(),
});
