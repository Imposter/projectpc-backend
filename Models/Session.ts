import { RoleType } from "./User";
import Schema from "./Schema";
import { Document, Model, model } from "mongoose";

export interface SessionCookie {
    originalMaxAge: number;
    expires: Date;
    httpOnly: boolean;
    path: string;
}

export interface SessionData {
    authorized: boolean;
    userId: string;
    role: RoleType;
}

export interface ISession {
    cookie: SessionCookie;
    data: SessionData;
}

// Named differently, since this is internal
export interface ISessionModel extends Document {
    session: ISession;
    expires: Date;
}

export const SessionSchema: Schema = new Schema({
    session: Object,
    expires: Date
});

export const Sessions: Model<ISessionModel> = model<ISessionModel>("Session", SessionSchema);