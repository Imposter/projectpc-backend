import RoleType from "../Core/RoleType";
import IModel from "../Database/IModel";
import Schema from "../Database/Schema";
import * as mongoose from "mongoose";

export default interface IUser {
    name?: string;
    email?: string;
    password: string,
    hash: string,
    hashFormat: string,
    role: RoleType,
    
    firstName?: string;
    lastName?: string;
}

export interface IUserModel extends IUser, mongoose.Document {
    // ...
}

export const UserSchema: Schema = new Schema({
    name: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    hash: String,
    hashFormat: String,
    roleType: Number,

    firstName: String,
    lastName: String
});

export const Users: mongoose.Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);