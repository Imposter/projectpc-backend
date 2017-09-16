import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "before" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (error: any) => any) {
        console.log("do something...");
        next(error);
    }
}