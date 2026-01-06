"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    subscriber: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    channel: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
});
exports.Subscription = (0, mongoose_1.model)("Subscription", subscriptionSchema);
//# sourceMappingURL=subscription.model.js.map