import ResultCode from "./ResultCode";

export default class Result {
    private code: ResultCode;
    private data: any;

    constructor(code: ResultCode, data?: any) {
        this.code = code;
        this.data = data;
    }
}