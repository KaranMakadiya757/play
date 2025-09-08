import { HydratedDocument, Model, Types } from "mongoose";

export interface ISubscription {
    subscriber: Types.ObjectId;
    channel: Types.ObjectId;
}

export type ISubscriptionDocument = HydratedDocument<ISubscription>;

export type SubscriptionModel = Model<ISubscriptionDocument>;
