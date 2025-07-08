import multer from "multer"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { ApiError } from "../utils/apiError.js"

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/temp')
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname)
		const name = path.basename(file.originalname, ext).replace(/\s+/g, "_")
		const uniqueName = `${name}-${uuidv4()}${ext}`
		cb(null, uniqueName)
	}
})

// ✅ Photo filter
const photoFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new ApiError(400, 'Bad Request', ["Only jpeg, png, jpg or webp files are allowed!"]))
	}
}

// ✅ Video filter
const videoFilter = (req, file, cb) => {
	const allowedTypes = ["video/mp4", "video/mkv", "video/webm"]
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new ApiError(400, 'Bad Request', ["Only mp4, mkv or webm video files are allowed!"]))
	}
}

// ✅ Instances using common storage
export const uploadPhotos = multer({
	storage,
	fileFilter: photoFilter,
	limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

export const uploadVideos = multer({
	storage,
	fileFilter: videoFilter,
	limits: { fileSize: 100 * 1024 * 1024 } // 100MB
})