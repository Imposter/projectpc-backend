import RoleType from "../Core/RoleType";
import { Users } from "../Models/UserModel";
import { Controller, JsonController, Get, Post, Authorized, BodyParam, InternalServerError } from "routing-controllers";

@JsonController("/auth")
export default class AuthController {
    @Post("/create")
    create(@BodyParam("name", { required: true }) userName: string, 
        @BodyParam("password", { required: true }) password: string, 
        @BodyParam("hashType", { required: true }) hashType: string) {
        // TODO: Check if already authenticated
        return "Hello!";
    }

    @Post("/oauth")
    oauth() {
        throw new InternalServerError("OAuth is not currently supported");
    }

    @Authorized()
    @Get("/end")
    end() {
        // TODO: ...
    }
}