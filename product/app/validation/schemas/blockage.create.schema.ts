import Joi from "joi";

export default Joi.object({
  name: Joi.string().min(3).max(3).messages({
    "string.base": "The product blockage code must be of type string",
    "string.min": "The product blockage code must be 3 characters long",
    "string.max": "The product blockage code must be 3 characters long"
  }),
  description: Joi.string().max(100).messages({
    "string.base": "The product blockage code description must be of type string",
    "string.max": "The product blockage code description must be equal or less than 100 characters"
  })
}).required();