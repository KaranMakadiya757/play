"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tweetValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const tweetValidationSchema = joi_1.default.object({
    content: joi_1.default.string().required().min(3).max(500).messages({
        "string.base": "Tweet content must be a string.",
        "string.empty": "Tweet content is required.",
        "string.min": "Tweet content must be at least 3 characters long.",
        "string.max": "Tweet content must not exceed 500 characters.",
        "any.required": "Tweet content is required.",
    }),
});
exports.tweetValidationSchema = tweetValidationSchema;
//# sourceMappingURL=tweet.validator.js.map