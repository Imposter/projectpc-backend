import IModel from "./IModel";
import Schema from "./Schema";
import { Document, Model, model } from "mongoose";

export interface IImage extends Document {
    postId: string;
    imageData: string;
}

export const ImageSchema: Schema = new Schema({
    postId: String,
    imageData: String
});

export const Images: Model<IImage> = model<IImage>("Image", ImageSchema);