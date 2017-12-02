import { RoleType } from "../../Models/User";

export default interface AuthResult {
    authorized: boolean;
    userId: string;
    role: RoleType;
}