import { HydratedDocument, Model, Types } from "mongoose";

export interface IUser {
    username: string;
    email: string;
    fullname: string;
    avatar: string;
    coverimage?: string;
    refreshToken?: string;
    password: string;
    otp?: string;
    otp_expiry?: Date;
    watchhistory: Types.ObjectId[];
}

export interface IUserMethods {
    isPasswordCorrect(password: string): Promise<boolean>;
    isOtpCorrect(otp: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    generateAccessAndRefreshTokens(): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {}

export type IUserDocument = HydratedDocument<IUser, IUserMethods>;
