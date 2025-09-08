import { AggregatePaginateModel, HydratedDocument, Model, Types } from "mongoose";

export interface IVideo {
    video: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: Number;
    views: Number;
    isPublished: Boolean;
    owner: Types.ObjectId;
}

export type IVideoDocument = HydratedDocument<IVideo>;

export type VideoModel = Model<IVideoDocument> & AggregatePaginateModel<IVideoDocument>;

export interface SearchParams {
    page?: string;
    limit?: string;
    query?: string;
    sortBy?: string;
    sortType?: string;
}
