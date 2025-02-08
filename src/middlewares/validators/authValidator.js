import Joi from "joi";

const registerValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required"
  }),
  password: Joi.string().min(8).max(50).pattern(/[a-z]/)
    .message("Password must contain at least one lowercase letter")
    .pattern(/[A-Z]/).message("Password must contain at least one uppercase letter")
    .pattern(/\d/).message("Password must contain at least one number")
    .required()
    .messages({
      "string.min": "Password must be at least 8 charcaters long",
      "any.required": "Password is required"
    }),
  confirmPass: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password"
  })
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "any.required": "Email is required"
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required"
  })
});


// Genrate validation middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error)
    return res.status(400).json({ message: error.details.map(err => err.message) });
  next();
};

export const validateorRegister = validate(registerValidation);
export const validateorLogin = validate(loginValidation);