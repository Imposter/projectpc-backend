import RoleType from "./RoleType";

export default interface SessionData {
    authorized: boolean;
    userId: string;
    role: RoleType;
}