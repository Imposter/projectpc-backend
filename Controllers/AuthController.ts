import Result from "../Core/Result";
import ResultCode from "../Core/ResultCode";
import ResultError from "../Core/ResultError";
import { ISession } from "../Models/Session";
import AuthResult from "../Models/Results/AuthResult";
import { RoleType, Users, IUser } from "../Models/User";
import { JsonController, Get, Post, Delete, Authorized, Req, Session, BodyParam, InternalServerError, BadRequestError, HttpError } from "routing-controllers";
import { Request } from "express";

@JsonController("/auth")
export default class AuthController {
    @Post("/create")
    async create(@Session() session: ISession,
        @BodyParam("email") email: string, 
        @BodyParam("firstName") firstName: string, 
        @BodyParam("lastName") lastName: string,
        @BodyParam("userName") userName: string, 
        @BodyParam("passwordHash") passwordHash: number) {
        // Check if a session already exists (return failure)
        if (session.data) {
            return new Result(ResultCode.AlreadyAuthenticated, <AuthResult>session.data);
        }

        // Check if an account already exists with either the username or email supplied
        var user = await Users.findOne({
            $or: [ { name: userName }, { email: email } ]
        });

        if (user) {
            return new Result(ResultCode.UserAlreadyExists);
        }

        // Create user and store in database
        user = await Users.create(<IUser> {
            name: userName,
            passwordHash: passwordHash,
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: RoleType.User
        });

        // Create session
        session.data = {
            authorized: true,
            userId: user._id.toString(),
            role: RoleType.User
        };

        return new Result(ResultCode.Ok, <AuthResult>session.data);
    }

	@Post("/login")
	async login(@Session() session: ISession,
        @BodyParam("email") email: string, 
        @BodyParam("passwordHash") passwordHash: number) {
        // Check if session data exists (return previous session)
        if (session.data) {
            return new Result(ResultCode.Ok, <AuthResult>session.data);
        }

        // Authenticate
		var user = await Users.findOne({
            email: email,
            passwordHash: passwordHash
        });
        
        if (user) {
            // Create session data
            session.data = {
                authorized: true,
                userId: user._id.toString(),
                role: user.role
            };

            return new Result(ResultCode.Ok, <AuthResult>session.data);
        } else {
            return new Result(ResultCode.InvalidCredentials);
        }
	}

    @Authorized()
    @Delete("/delete")
    delete(@Session() session: ISession) {
		session.data = null;
		return new Result(ResultCode.Ok);
    }
}