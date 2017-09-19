import { Document } from "mongoose";

export default interface IModel extends Document {
    createdAt: Date,
    updatedAt: Date
}