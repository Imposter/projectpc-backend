import IModel from "./IModel";
import Schema from "./Schema";
import { Document, Model, model } from "mongoose";

export interface IMessage extends Document {
    postId: string;
    senderId: string;
    targetId: string;
    body: string;
}

export const MessageSchema: Schema = new Schema({
    postId: String,
    senderId: String,
    targetId: String,
    body: String
});

export const Messages: Model<IMessage> = model<IMessage>("Message", MessageSchema);