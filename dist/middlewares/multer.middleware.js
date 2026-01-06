"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const apiError_1 = require("../utils/apiError");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        const name = path_1.default.basename(file.originalname, ext).replace(/\s+/g, "_");
        const uniqueName = `${name}-${(0, uuid_1.v4)()}${ext}`;
        cb(null, uniqueName);
    },
});
// ✅ File Filter
const fileFilter = (req, file, cb) => {
    var _a;
    if ((_a = ["video"]) === null || _a === void 0 ? void 0 : _a.includes(file.fieldname)) {
        const allowedTypes = ["video/mp4", "video/mkv", "video/webm"];
        if (allowedTypes.includes(file.mimetype)) {
            return cb(null, true);
        }
        return cb(new apiError_1.ApiError(400, "Bad Request", ["Only mp4, mkv or webm files are allowed for videos!"]));
    }
    else {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            return cb(null, true);
        }
        return cb(new apiError_1.ApiError(400, "Bad Request", ["Only jpeg, png, jpg or webp files are allowed for thumbnails!"]));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
//# sourceMappingURL=multer.middleware.js.map