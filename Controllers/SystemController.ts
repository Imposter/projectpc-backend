import Result from "../Core/Result";
import ResultCode from "../Core/ResultCode";
import ResultError from "../Core/ResultError";
import { Controller, JsonController, Get, Authorized, Req, Res, InternalServerError } from "routing-controllers";

@JsonController("/system")
export default class SystemController {
    @Get("/version")
    version() {
        return new Result(ResultCode.Ok, { // TODO: Models
            version: "0.0.1"
        });
    }

    @Get("/cookieTest")
    cookieTest(@Req() req: any, @Res() res: any) {
        //res.cookie("test_value", 123);
        //return {};
        if (req.session.views) {
            req.session.views++
            //res.setHeader('Content-Type', 'text/html')
            //res.write('<p>views: ' + req.session.views + '</p>')
            //res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
            //res.end()
            return {
                data: {
                    views: req.session.views,
                    expiresIn: req.session.cookie.maxAge / 1000
                }
            }
        } else {
            req.session.views = 1;
            return {
                data: {
                    views: req.session.views
                }
            }
        }
    }

    @Get("/parameters")
    parameters() {
        return "";
    }
}