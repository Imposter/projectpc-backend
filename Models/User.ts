import IModel from "./IModel";
import SchemaHelper from "./SchemaHelper";
import { Document, Model, model } from "mongoose";

export enum RoleType {
    Admin = 0,
    Moderator = 1,
    User = 2
}

export interface IUser extends Document {
    name?: string;
    email: string;
    passwordHash: number,
    role: RoleType,
    
    firstName?: string;
    lastName?: string;
}

export const UserSchema = SchemaHelper.Create({
    name: { type: String, unique: true },
    email: { type: String, unique: true },
    passwordHash: Number,
    role: Number,

    firstName: String,
    lastName: String
});

export const Users: Model<IUser> = model<IUser>("User", UserSchema);