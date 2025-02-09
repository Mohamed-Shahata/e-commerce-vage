import Joi from "joi";

const createProductValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not exceed 50 characters",
    "string.empty": "Name is required"
  }),
  description: Joi.string().trim().min(5).max(200).required().messages({
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description must not exceed 200 characters",
    "string.empty": "Description is required"
  }),
  price: Joi.number().min(1).required().messages({
    "number.min": "Price must be at least 1",
    "any.required": "Price is required"
  }),
  discount: Joi.number().min(0).max(100).optional().messages({
    "number.min": "Discount must be at least 0%",
    "number.max": "Discount must not exceed 100%"
  }),
  category: Joi.string().trim().required().messages({
    "string.empty": "Category ID is required"
  })
});

const updateProductValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not exceed 50 characters"
  }),
  description: Joi.string().trim().min(5).max(200).optional().messages({
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description must not exceed 200 characters"
  }),
  price: Joi.number().min(1).optional().messages({
    "number.min": "Price must be at least 1"
  }),
  discount: Joi.number().min(0).max(100).optional().messages({
    "number.min": "Discount must be at least 0%",
    "number.max": "Discount must not exceed 100%"
  }),
  category: Joi.string().trim().optional().messages({
    "string.empty": "Category ID cannot be empty"
  }),
  imagesToDelete: Joi.string().optional().messages({
    "string.empty": "imagesToDelete is empty"
  })
});


// Genrate validation middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error)
    return res.status(400).json({ message: error.details.map(err => err.message) });
  next();
};

export const validateorCreateProduct = validate(createProductValidation);
export const validateorUpdateProduct = validate(updateProductValidation);