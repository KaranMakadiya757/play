import { Schema, model } from "mongoose";
import { ISubscription, SubscriptionModel } from "../types/subscription.types";

const subscriptionSchema = new Schema<ISubscription>({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

export const Subscription = model<ISubscription, SubscriptionModel>("Subscription", subscriptionSchema);
