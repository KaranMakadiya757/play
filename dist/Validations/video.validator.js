"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const videoValidationSchema = joi_1.default.object({
    thumbnail: joi_1.default.string().optional(),
    title: joi_1.default.string().required().min(5).max(50).messages({
        "string.base": "Title must be a string.",
        "string.empty": "Title is required.",
        "string.min": "Title must be at least 5 characters long",
        "string.max": "Title must not exceed 50 characters",
        "any.required": "Title is required.",
    }),
    description: joi_1.default.string().required().min(5).max(505).messages({
        "string.base": "Description must be a string.",
        "string.empty": "Description is required.",
        "string.min": "Description must be at least 5 characters long",
        "string.max": "Description must not exceed 500 characters",
        "any.required": "Description is required.",
    }),
    isPublished: joi_1.default.boolean().optional().messages({
        "boolean.base": "isPublished must be a boolean value.",
    }),
});
exports.videoValidationSchema = videoValidationSchema;
//# sourceMappingURL=video.validator.js.map