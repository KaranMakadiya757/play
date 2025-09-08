import { Request } from "express";
import { IUserDocument } from "./user.types";
import { IVideoDocument } from "./video.types";
import { ICommentDocument } from "./comment.types";
import { ILikeDocument } from "./like.types";
import { IPlaylistDocument } from "./playlist.types";
import { ISubscriptionDocument } from "./subscription.types";
import { ITweetDocument } from "./tweet.types";

export interface IRequest extends Request {
    user?: IUserDocument;
    channel?: IUserDocument;
    video?: IVideoDocument;
    comment?: ICommentDocument;
    like?: ILikeDocument;
    playlist?: IPlaylistDocument;
    subscription?: ISubscriptionDocument;
    tweet?: ITweetDocument;
}
