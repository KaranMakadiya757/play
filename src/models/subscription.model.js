import { Schema, model } from "mongoose";

const subscriptionSchema = Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Subscription = model("Subscription", subscriptionSchema);