import { Schema, model } from "mongoose";
import { Playlist } from "./playlist.model";
import { Comment } from "./comment.model";
import { Like } from "./like.model";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { deleteFromCloudinary } from "../utils/fileOperation";
import { IVideo, VideoModel } from "../types/video.types";

const videoSchema = new Schema<IVideo>(
    {
        video: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

videoSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());

    if (doc) {
        await deleteFromCloudinary(doc.video, "video");
        await deleteFromCloudinary(doc.thumbnail);

        // Remove those videos from all playlists
        await Playlist.updateMany({ videos: { $in: [doc._id] } }, { $pull: { videos: { $in: [doc._id] } } });

        await Comment.deleteMany({ video: doc._id });
        await Like.deleteMany({ video: doc._id });
    }

    next();
});

videoSchema.pre("deleteMany", async function () {
    const filter = this.getFilter();

    const deletedVideos = await this.model.find(filter).select("_id thumbnail video");

    const videoIds = deletedVideos.map((v) => v._id);

    for (const video of deletedVideos) {
        await deleteFromCloudinary(video.video, "video");
        await deleteFromCloudinary(video.thumbnail);
    }

    await Playlist.updateMany({ videos: { $in: videoIds } }, { $pull: { videos: { $in: videoIds } } });

    await Comment.deleteMany({ video: { $in: videoIds } });
    await Like.deleteMany({ video: { $in: videoIds } });
});

videoSchema.plugin(aggregatePaginate);

export const Video = model<IVideo, VideoModel>("Video", videoSchema);
