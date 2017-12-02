import Result from "../Core/Result";
import ResultCode from "../Core/ResultCode";
import ResultError from "../Core/ResultError";
import VersionResult from "../Models/Results/VersionResult";
import { Controller, JsonController, Get, Authorized, Req, Res, InternalServerError } from "routing-controllers";

@JsonController("/system")
export default class SystemController {
    @Get("/version")
    version() {
        return new Result(ResultCode.Ok, <VersionResult> {
            version: "0.0.1"
        });
    }
}