import { Action } from "routing-controllers";
import SessionData from "../Models/SessionData";
import { Request } from "express";
import { Logger, getLogger } from "log4js";

const log: Logger = getLogger("AuthChecker");

export default async function AuthChecker(action: Action, roles: any[]): Promise<boolean> {
    var request: Request = action.request;
    var token = request.headers["authorization"];

    // Check if session exists
    var session = <SessionData><any>request.session.data;
    if (session != null && session.authorized) {
        // Check role
        if (!roles.length)
            return true;
        if (roles.indexOf(session.role) > 0)
            return true;

        return false;
    }

    // Session does not exist
    return false;
}