import "reflect-metadata";
import { Controller, JsonController, Get, InternalServerError } from "routing-controllers";

@JsonController("/system")
export default class SystemController {
    @Get("/version")
    version() {
        throw new InternalServerError("Not implemented");
    }
}