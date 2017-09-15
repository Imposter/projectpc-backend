import { Action } from "routing-controllers";
import Session from "./Session";
import { Request } from "express";
import * as log4js from "log4js";

const log: log4js.Logger = log4js.getLogger("AuthChecker");

export default async function AuthChecker(action: Action, roles: any[]): Promise<boolean> {
    var request: Request = action.request;
    var token = request.headers["authorization"];

    // Check if session exists
    var session = <Session><any>request.session;
    if (session != null || !session.authorized) {
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