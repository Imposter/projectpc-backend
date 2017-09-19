import { Controller, JsonController, Get, InternalServerError, Authorized } from "routing-controllers";

@JsonController("/system")
export default class SystemController {
    @Get("/version")
    version() {
        throw new InternalServerError("Not implemented");
    }
}