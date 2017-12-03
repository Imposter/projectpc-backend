import { RoleType } from "./User";
import SchemaHelper from "./SchemaHelper";
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
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    role: RoleType,
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

export const SessionSchema = SchemaHelper.Create({
    session: Object,
    expires: Date
});

export const Sessions: Model<ISessionModel> = model<ISessionModel>("Session", SessionSchema);