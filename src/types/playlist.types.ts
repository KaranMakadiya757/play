import { HydratedDocument, Model, Types } from "mongoose";

export interface IPlaylist {
    name: string;
    description: string;
    videos: Types.ObjectId[];
    owner: Types.ObjectId;
}

export type IPlaylistDocument = HydratedDocument<IPlaylist>;

export type PlaylistModel = Model<IPlaylistDocument>;
