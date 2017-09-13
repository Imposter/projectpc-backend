/*
*   This file is part of the carMeet project.
*
*   This program is licensed under the GNU General
*   Public License. To view the full license, check
*   LICENSE in the project root.
*/

import IUser from "../Interfaces/IUser";
import IModel from "../Core/IModel";
import Schema from "../Core/Schema";
import * as mongoose from "mongoose";

export interface IUserModel extends IUser, mongoose.Document {
    // ...
}

export const UserSchema: Schema = new Schema({
    name: String,
    email: String,
    firstName: String,
    lastName: String
});

export const Users: mongoose.Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);