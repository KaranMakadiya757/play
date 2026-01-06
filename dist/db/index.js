"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants");
const connectDB = async () => {
    try {
        const connection = await mongoose_1.default.connect(`${process.env.MONGODB_URL}/${constants_1.DB_NAME}`);
        console.log(`MongoDB connected !! DB Host : ${connection.connection.name} ✅`);
    }
    catch (error) {
        console.error("connection error ❌", error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=index.js.map