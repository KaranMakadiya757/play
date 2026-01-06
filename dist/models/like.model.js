"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    video: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Video",
    },
    comment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment",
    },
    tweet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tweet",
    },
    likedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
exports.Like = (0, mongoose_1.model)("Like", likeSchema);
//# sourceMappingURL=like.model.js.map