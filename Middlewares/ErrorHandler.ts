import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";
import { Request, Response } from "express";
import * as HttpStatus from "http-status-codes";

@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: Response, next: (error: any) => any) {
        var httpCode = error.httpCode || HttpStatus.INTERNAL_SERVER_ERROR;
        var statusCode = httpCode;
        if (error.code != null) {
            statusCode = error.code;
        }

        // TODO: If error.message is empty, and statusCode is an http code
        // then get the http message string

        // Send response
        response.status(httpCode).send(JSON.stringify({
            code: statusCode,
            error: error.message,
        }));
    }
}