import Joi from "joi";

const userUpdateValidation = Joi.object({
  firstName: Joi.string().trim().min(2).max(30).messages({
    "string.min": "First name must be at least 2 charcaters long",
    "string.empty": "First Name is empty"
  }),
  lastName: Joi.string().trim().min(2).max(30).messages({
    "string.min": "Last name must be at least 2 charcaters long",
    "string.empty": "Last Name is empty"
  }),
  // email: Joi.string().email().messages({
  //   "string.email": "Invalid email address",
  // }),
  phoneNumber: Joi.string().length(12).pattern(/^[0-9]+$/).messages({
    "string.length": "Phone number must be exactly 12 digits long",
    "string.pattern": "Phone must only contain digits"
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

// Genrate validation middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error)
    return res.status(400).json({ message: error.details.map(err => err.message) });
  next();
};

export const validateorUpdateUser = validate(userUpdateValidation);