import RoleType from "../../Core/RoleType";

export default interface AuthResult {
    authorized: boolean;
    userId: string;
    role: RoleType;
}