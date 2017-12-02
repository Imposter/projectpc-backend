import IModel from "./IModel";
import Schema from "./Schema";
import { Document, Model, model } from "mongoose";

export enum PostStatus {
    Unlisted = 0,
    Listed = 1,
    Deleted = 2,
    Sold = 3,
}

export interface IPost {
    authorId: string;
    status: PostStatus;
    title: string;
    category: string;
    tags: string[];
    price: number;
    currency: string;
    imageIds: string[];
    thumbnailId: string;
    thumbnailIndex: number;
    body: string;
}

export interface IPostModel extends IPost, Document {
    // ...
}

export const PostSchema: Schema = new Schema({
    authorId: String,
    status: Number,
    title: String,
    category: String,
    tags: [ String ],
    price: Number,
    currency: String,
    imageIds: [ String ],
    thumbnailId: String,
    thumbnailIndex: Number,
    body: String
});

export const Posts: Model<IPostModel> = model<IPostModel>("Post", PostSchema);