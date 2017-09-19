import ResultCode from "./ResultCode";
import { HttpError } from "routing-controllers";
import * as HttpStatus from "http-status-codes";

export default class ResultError extends HttpError {
    private code: ResultCode;

    constructor(code: ResultCode, message?: string) {
        super(HttpStatus.OK, message);

        this.code = code;
    }
}