import Joi from "joi";

export default Joi.object({
  "first_name": Joi.string().max(20).optional().messages({
    "string.base": "The first name must be of type string",
    "string.max": "The first name must be 20 characters long or less"
  }),
  "last_name": Joi.string().max(50).optional().messages({
    "string.base": "The first name must be of type string",
    "string.max": "The last name must be 50 characters long or less"    
  }),
  "email": Joi.string().email({ minDomainSegments: 2 }).max(100).optional().messages({
    "string.base": "The email must be of type string",
    "string.max": "The email must be 100 characters long or less",
    "string.email": "Please enter a valid email"
  }),
  "password": Joi.string().min(8).optional().messages({
    "string.base": "The password must be of type string",
    "string.min": "The password must be between 8 and 64 characters long"
  }),
  "role_name": Joi.string().max(10).optional().messages({
    "string.base": "The role name must be of type string",
    "string.max": "The role name must be 10 characters long or less"
  })
}).min(1);