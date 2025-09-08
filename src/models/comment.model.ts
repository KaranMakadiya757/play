import { Schema, model } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Like } from "./like.model";
import { CommentModel, IComment } from "../types/comment.types";

const commentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

commentSchema.plugin(aggregatePaginate);

commentSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getFilter());

    if (doc) await Like.deleteMany({ comment: doc._id });

    next();
});

commentSchema.pre("deleteMany", async function () {
    const filter = this.getFilter();

    const deletedComments = await this.model.find(filter).select("_id");

    const commentIds = deletedComments.map((v) => v._id);

    await Like.deleteMany({ comment: { $in: commentIds } });
});

export const Comment = model<IComment, CommentModel>("Comment", commentSchema);
