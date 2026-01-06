"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userOtpValidationSchema = exports.userLoginWithOtpValidationSchema = exports.userUpdateValidationSchema = exports.changepasswordValidationSchema = exports.userLoginValidationSchema = exports.userValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const userValidationSchema = joi_1.default.object({
    username: joi_1.default.string()
        .trim()
        .lowercase()
        .required()
        .min(3)
        .max(10)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .messages({
        "string.base": "Username must be a string",
        "string.empty": "Username is required",
        "any.required": "Username is required",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username must not exceed 10 characters",
        "string.pattern.base": "Only alphanumeric characters and underscore are allowed",
    }),
    email: joi_1.default.string().trim().lowercase().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    fullname: joi_1.default.string().trim().required().min(3).max(20).messages({
        "string.base": "Full name must be a string",
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 3 characters long",
        "string.max": "Full name must not exceed 20 characters",
        "any.required": "Full name is required",
    }),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
        .required()
        .messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
    }),
});
exports.userValidationSchema = userValidationSchema;
const userUpdateValidationSchema = joi_1.default.object({
    username: joi_1.default.string()
        .trim()
        .lowercase()
        .required()
        .min(3)
        .max(10)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .messages({
        "string.base": "Username must be a string",
        "string.empty": "Username is required",
        "any.required": "Username is required",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username must not exceed 10 characters",
        "string.pattern.base": "Only alphanumeric characters and underscore are allowed",
    }),
    email: joi_1.default.string().trim().lowercase().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    fullname: joi_1.default.string().trim().required().min(3).max(20).messages({
        "string.base": "Full name must be a string",
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 3 characters long",
        "string.max": "Full name must not exceed 20 characters",
        "any.required": "Full name is required",
    }),
    avatar: joi_1.default.string().trim().optional().messages({
        "string.empty": "Avatar Can not be Empty",
    }),
    coverimage: joi_1.default.string().trim().optional().allow(""),
});
exports.userUpdateValidationSchema = userUpdateValidationSchema;
const userLoginValidationSchema = joi_1.default.object({
    email: joi_1.default.string().trim().lowercase().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
        .required()
        .messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
    }),
});
exports.userLoginValidationSchema = userLoginValidationSchema;
const userLoginWithOtpValidationSchema = joi_1.default.object({
    email: joi_1.default.string().trim().lowercase().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
});
exports.userLoginWithOtpValidationSchema = userLoginWithOtpValidationSchema;
const userOtpValidationSchema = joi_1.default.object({
    email: joi_1.default.string().trim().lowercase().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    otp: joi_1.default.number().integer().min(100000).max(999999).required().messages({
        "number.base": "OTP must be a number",
        "number.min": "OTP must be 6 digits long",
        "number.max": "OTP must be 6 digits long",
        "any.required": "OTP is required",
    }),
});
exports.userOtpValidationSchema = userOtpValidationSchema;
const changepasswordValidationSchema = joi_1.default.object({
    oldPassword: joi_1.default.string()
        .required()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
        .messages({
        "string.empty": "Old Password cannot be empty",
        "string.min": "Old Password must be at least 8 characters long",
        "string.pattern.base": "Old Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Old Password is required",
    }),
    newPassword: joi_1.default.string()
        .required()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
        .invalid(joi_1.default.ref("oldPassword"))
        .messages({
        "string.empty": "New Password cannot be empty",
        "string.min": "New Password must be at least 8 characters long",
        "string.pattern.base": "New Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.invalid": "New Password must not be the same as the Old Password",
        "any.required": "New Password is required",
    }),
});
exports.changepasswordValidationSchema = changepasswordValidationSchema;
//# sourceMappingURL=user.validator.js.map