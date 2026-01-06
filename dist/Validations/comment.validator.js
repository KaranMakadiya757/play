"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const commentValidationSchema = joi_1.default.object({
    content: joi_1.default.string().required().min(3).max(200).messages({
        "string.base": "Comment content must be a string.",
        "string.empty": "Comment content is required.",
        "string.min": "Comment content must be at least 3 characters long.",
        "string.max": "Comment content must not exceed 200 characters.",
        "any.required": "Comment content is required.",
    }),
});
exports.commentValidationSchema = commentValidationSchema;
//# sourceMappingURL=comment.validator.js.map