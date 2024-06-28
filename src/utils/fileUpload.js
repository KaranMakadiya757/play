import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;

        const response = await cloudinary.uploader.upload(localfilepath, { resource_type: "auto" })
        console.log("file has been created sucessfully", response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null
    }
}

export { uploadOnCloudinary }