import Joi from "joi";

export default Joi.object({
  name: Joi.string().max(3).messages({
    "string.base": "The name must be of type string",
    "string.max": "The name must be 3 characters or less"
  }),
  description: Joi.string().max(100).messages({
    "string.base": "The description must be of type string",
    "string.max": "The description must be 100 characters or less"    
  })
}).required();