import Joi from 'joi';

const userValidationSchema = Joi.object({
    username: Joi.string()
        .trim()
        .lowercase()
        .required()
        .min(3)
        .max(10)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .messages({
            'string.base': 'Username must be a string',
            'string.empty': 'Username is required',
            'any.required': 'Username is required',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must not exceed 10 characters',
            'string.pattern.base': 'Only alphanumeric characters and underscore are allowed'
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),

    fullname: Joi.string()
        .trim()
        .required()
        .min(3)
        .max(20)
        .messages({
            'string.base': 'Full name must be a string',
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 3 characters long',
            'string.max': 'Full name must not exceed 20 characters',
            'any.required': 'Full name is required'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
            'any.required': 'Password is required'
        })
});

const userUpdateValidationSchema = Joi.object({
    username: Joi.string()
        .trim()
        .lowercase()
        .optional()
        .min(3)
        .max(10)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .messages({
            'string.base': 'Username must be a string',
            'string.empty': 'Username is required',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must not exceed 10 characters',
            'string.pattern.base': 'Only alphanumeric characters and underscore are allowed'
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .optional()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address'
        }),

    fullname: Joi.string()
        .trim()
        .optional()
        .min(3)
        .max(20)
        .messages({
            'string.base': 'Full name must be a string',
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 3 characters long',
            'string.max': 'Full name must not exceed 20 characters'
        })
});

const userLoginValidationSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
            'any.required': 'Password is required'
        })
});

const changepasswordValidationSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
        .messages({
            "string.empty": "Old Password cannot be empty",
            "string.min": "Old Password must be at least 8 characters long",
            "string.pattern.base": "Old Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "any.required": "Old Password is required"
        }),

    newPassword: Joi.string()
        .required()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
        .invalid(Joi.ref('oldPassword'))
        .messages({
            "string.empty": "New Password cannot be empty",
            "string.min": "New Password must be at least 8 characters long",
            "string.pattern.base": "New Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "any.invalid": "New Password must not be the same as the Old Password",
            "any.required": "New Password is required"
        })
});

export {
    userValidationSchema,
    userLoginValidationSchema,
    changepasswordValidationSchema,
    userUpdateValidationSchema
};
