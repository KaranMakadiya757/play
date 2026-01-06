"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadOnCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
const uploadOnCloudinary = async (localFilePath, userId) => {
    try {
        if (!localFilePath)
            return null;
        const response = await cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: `users/${userId}`,
        });
        fs_1.default.unlinkSync(localFilePath);
        return response;
    }
    catch (error) {
        fs_1.default.unlinkSync(localFilePath);
        console.error("Upload Error:", error);
        return null;
    }
};
exports.uploadOnCloudinary = uploadOnCloudinary;
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
        return result;
    }
    catch (error) {
        console.error("Deletion Error:", error);
        return null;
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=fileOperation.js.map