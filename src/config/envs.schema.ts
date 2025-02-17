import * as Joi from 'joi';

export const EnvSchema = Joi.object({
  MONGO_DB: Joi.string().required(),
  PORT: Joi.number().default(3000),
  DEFAULT_LIMIT: Joi.number().default(10),
});


