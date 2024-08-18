import Joi from "joi";

export default Joi.object({
  name: Joi.string().max(5).messages({
    "string.base": "The name must be of type string",
    "string.max": "The name must be 5 characters long or less"
  }),
  description: Joi.string().max(100).messages({
    "string.base": "The description must be of type string",
    "string.max": "The description must be 100 characters long or less"
  }),
  length: Joi.number().messages({
    "string.base": "The length must be of type number"
  }),
  width: Joi.number().messages({
    "string.base": "The width must be of type number"
  }),
  height: Joi.number().messages({
    "string.base": "The height must be of type number"
  }),
}).required();