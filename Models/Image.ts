import IModel from "./IModel";
import SchemaHelper from "./SchemaHelper";
import { Document, Model, model } from "mongoose";

export interface IImage extends Document {
    postId: string;
    imageData: string;
}

export const ImageSchema = SchemaHelper.Create({
    postId: String,
    imageData: String
});

export const Images: Model<IImage> = model<IImage>("Image", ImageSchema);