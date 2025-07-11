import { Schema, model } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { deleteFromCloudinary } from "../utils/fileOperation.js";

const videoSchema = new Schema(
    {
        video: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
)


videoSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());

    if (doc) {
        await deleteFromCloudinary(doc.video, "video");
        await deleteFromCloudinary(doc.thumbnail);
    }

    next();
});


videoSchema.plugin(aggregatePaginate)

export const Video = model("Video", videoSchema)