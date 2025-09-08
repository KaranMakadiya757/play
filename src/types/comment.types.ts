import { AggregatePaginateModel, HydratedDocument, Model, Types } from "mongoose";

export interface IComment {
    content: string;
    video: Types.ObjectId;
    owner: Types.ObjectId;
}

export type ICommentDocument = HydratedDocument<IComment>;

export type CommentModel = Model<ICommentDocument> & AggregatePaginateModel<ICommentDocument>;
