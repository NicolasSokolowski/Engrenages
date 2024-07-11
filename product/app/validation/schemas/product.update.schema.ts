import Joi from "joi";

export default Joi.object({
  title: Joi.string().max(15).optional().messages({
    "string.base": "The title must be of type string",
    "string.max": "Title has to be 100 characters or less"
  }),
  description: Joi.string().optional().messages({
    "string.base": "The description must be of type string"
  }),
  ean: Joi.string().min(13).max(13).optional().messages({
    "string.base": "The EAN must be of type string",
    "string.min": "Please provide a correct EAN",
    "string.max": "Please provide a correct EAN",
  }),
  length: Joi.number().optional().messages({
    "string.base": "The length must be of type number"
  }),
  width: Joi.number().optional().messages({
    "string.base": "The width must be of type number"
  }),
  height: Joi.number().optional().messages({
    "string.base": "The length must be of type number"
  }),
  product_img: Joi.string().optional().messages({
    "string.base": "The product image link must be of type string"
  }),
  price: Joi.number().optional().messages({
    "string.base": "The price must be of type number"
  }),
  product_blockage_name: Joi.string().min(3).max(3).optional().messages({
    "string.base": "The product blockage code name must be of type string",
    "string.min": "The product blockage code name must be 3 characters long",
    "string.max": "The product blockage code name must be 3 characters long",
  })
}).min(1);