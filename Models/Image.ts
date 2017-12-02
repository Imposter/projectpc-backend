import IModel from "./IModel";
import Schema from "./Schema";
import { Document, Model, model } from "mongoose";

export default interface IImage {
    postId: string;
    imageData: string;
}

export interface IImageModel extends IImage, Document {
    // ...
}

export const ImageSchema: Schema = new Schema({
    postId: String,
    imageData: String
});

export const Images: Model<IImageModel> = model<IImageModel>("Image", ImageSchema);