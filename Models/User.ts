import IModel from "./IModel";
import Schema from "./Schema";
import { Document, Model, model } from "mongoose";

export enum RoleType {
    Admin = 0,
    Moderator = 1,
    User = 2
}

export interface IUser {
    name?: string;
    email: string;
    passwordHash: number,
    role: RoleType,
    
    firstName?: string;
    lastName?: string;
}

export interface IUserModel extends IUser, Document {
    // ...
}

export const UserSchema: Schema = new Schema({
    name: { type: String, unique: true },
    email: { type: String, unique: true },
    passwordHash: Number,
    role: Number,

    firstName: String,
    lastName: String
});

export const Users: Model<IUserModel> = model<IUserModel>("User", UserSchema);