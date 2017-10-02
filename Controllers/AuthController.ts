import RoleType from "../Core/RoleType";
import Result from "../Core/Result";
import ResultCode from "../Core/ResultCode";
import ResultError from "../Core/ResultError";
import SessionData from "../Core/SessionData";
import { Users } from "../Database/Models/UserModel";
import { Controller, JsonController, Get, Post, Authorized, Req, Session, BodyParam, InternalServerError, BadRequestError, HttpError } from "routing-controllers";
import { Request } from "express";

@JsonController("/auth")
export default class AuthController {
    @Post("/create")
    create(@Session() session: any,
        @BodyParam("token") token: string, 
        @BodyParam("method") method: string) {           
        // Check if session data exists (return previous session)
        if (session.data) {
            return new Result(ResultCode.Ok, session.data); // testing
        }

        // TODO: Check if session data exists within database, if it does, remove previous session


        // TODO: Authenticate


        // Create session data
        session.data = <SessionData> {
            authorized: true,
            userId: "empty",
            role: RoleType.User
        };

        return new Result(ResultCode.Ok, session.data); // testing
    }

    @Post("/oauth")
    oauth() {
        throw new ResultError(ResultCode.NotImplemented);
    }

    @Authorized()
    @Get("/end")
    end() {
        // TODO: ...
    }
}