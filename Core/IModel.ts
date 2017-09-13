/*
*   This file is part of the carMeet project.
*
*   This program is licensed under the GNU General
*   Public License. To view the full license, check
*   LICENSE in the project root.
*/

import * as mongoose from "mongoose";

export default interface IModel extends mongoose.Document {
    createdAt: Date,
    updatedAt: Date
}