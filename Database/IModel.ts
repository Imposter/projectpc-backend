import * as mongoose from "mongoose";

export default interface IModel extends mongoose.Document {
    createdAt: Date,
    updatedAt: Date
}