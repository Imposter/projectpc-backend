import RoleType from "./RoleType";

export default interface Session {
    authorized: boolean;
    userId: string;
    role: RoleType;
}