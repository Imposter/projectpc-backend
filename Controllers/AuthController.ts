import RoleType from "../Core/RoleType";
import { Users } from "../Models/UserModel";
import { Controller, JsonController, Get, Post, Authorized, BodyParam } from "routing-controllers";

@JsonController("/auth")
export default class AuthController {
    @Post("/create")
    create() {
        // TODO: Check if already authenticated
        
    }

    @Authorized()
    @Get("/end")
    end() {
        // TODO: ...
    }
}