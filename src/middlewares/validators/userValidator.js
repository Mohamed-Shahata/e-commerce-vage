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
  phoneNumber: Joi.string().length(12).pattern(/^[0-9]+$/).messages({
    "string.length": "Phone number must be exactly 12 digits long",
    "string.pattern": "Phone must only contain digits"
  })
});

const userAddressUpdateValidation = Joi.object({
  streetAddress: Joi.string().trim().min(2).max(30).messages({
    "string.min": "Street address must be at least 2 characters long",
    "string.empty": "Street address cannot be empty"
  }),
  country: Joi.string().trim().min(2).max(30).messages({
    "string.min": "Country must be at least 2 characters long",
    "string.empty": "Country cannot be empty"
  }),
  states: Joi.string().trim().min(2).max(30).messages({
    "string.min": "State must be at least 2 characters long",
    "string.empty": "State cannot be empty"
  }),
  zipCode: Joi.string().trim().min(2).max(30).messages({
    "string.min": "Zip code must be at least 2 characters long",
    "string.empty": "Zip code cannot be empty"
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
export const validateorUpdateUserAddress = validate(userAddressUpdateValidation);