import Joi from "joi";

export default Joi.object({
  zone: Joi.string().min(1).max(1).optional().messages({
    "string.base": "The zone must be of type string",
    "string.min": "The zone must be 1 character long",
    "string.max": "The zone must be 1 character long",
  }),
  alley: Joi.string().min(3).max(3).optional().messages({
    "string.base": "The alley must be of type string",
    "string.min": "The alley must be 3 character long",
    "string.max": "The alley must be 3 character long",
  }),
  position: Joi.string().min(4).max(4).optional().messages({
    "string.base": "The position must be of type string",
    "string.min": "The position must be 4 character long",
    "string.max": "The position must be 4 character long",
  }),
  lvl: Joi.string().min(1).max(1).optional().messages({
    "string.base": "The lvl must be of type string",
    "string.min": "The lvl must be 1 character long",
    "string.max": "The lvl must be 1 character long",
  }),
  lvl_position: Joi.string().min(2).max(2).optional().messages({
    "string.base": "The lvl_position must be of type string",
    "string.min": "The lvl_position must be 2 character long",
    "string.max": "The lvl_position must be 2 character long",
  }),
  location_type_name: Joi.string().max(5).optional().messages({
    "string.base": "The location_type_name must be of type string",
    "string.max": "The location_type_name must be 5 characters long or less"
  }),
  location_blockage_name: Joi.string().max(3).optional().messages({
    "string.base": "The location_blockage_name must be of type string",
    "string.max": "The location_blockage_name must be 3 characters long or less"
  }),
}).min(1);