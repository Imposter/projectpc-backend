import SchemaHelper from "./SchemaHelper";
import { Document, Model, model } from "mongoose";

export enum PostStatus {
    Unlisted = 0,
    Listed = 1,
    Deleted = 2,
    Sold = 3,
}

export interface IPost extends Document {
    authorId: string;
    status: PostStatus;
    title: string;
    category: string;
    tags: string[];
    price: number;
    currency: string;
    imageIds: string[];
    thumbnailId: string;
    thumbnailImageId: string;
    body: string;
}

export const PostSchema = SchemaHelper.Create({
    authorId: String,
    status: Number,
    title: String,
    category: String,
    tags: [ String ],
    price: Number,
    currency: String,
    imageIds: [ String ],
    thumbnailId: String,
    thumbnailImageId: String,
    body: String
});

export const Posts: Model<IPost> = model<IPost>("Post", PostSchema);