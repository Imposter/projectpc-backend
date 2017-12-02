import { RoleType } from "./User";

export default interface SessionData {
    authorized: boolean;
    userId: string;
    role: RoleType;
}