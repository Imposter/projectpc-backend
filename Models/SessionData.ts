import RoleType from "../Core/RoleType";

export default interface SessionData {
    authorized: boolean;
    userId: string;
    role: RoleType;
}