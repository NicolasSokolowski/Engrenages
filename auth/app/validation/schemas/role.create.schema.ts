import Joi from "joi";

export default Joi.object({
  name: Joi.string().max(10).messages({
    "string.base": "The role must be of type string",
    "string.max": "The role must 10 characters or less"
  })
}).required();