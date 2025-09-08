import { Schema, model } from "mongoose";
import { IPlaylist, PlaylistModel } from "../types/playlist.types";

const playlistSchema = new Schema<IPlaylist>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Playlist = model<IPlaylist, PlaylistModel>("Playlist", playlistSchema);
