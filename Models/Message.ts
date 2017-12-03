import IModel from "./IModel";
import SchemaHelper from "./SchemaHelper";
import { Document, Model, model } from "mongoose";

export interface IMessage extends Document {
    postId: string;
    senderId: string;
    senderName: string;
    targetId: string;
    targetName: string;
    body: string;
}

export const MessageSchema = SchemaHelper.Create({
    postId: String,
    senderId: String,
    senderName: String,
    targetId: String,
    targetName: String,
    body: String
});

export const Messages: Model<IMessage> = model<IMessage>("Message", MessageSchema);