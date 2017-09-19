import ResultCode from "./ResultCode";

export default class Result {
    private result: ResultCode;
    private data: any;

    constructor(result: ResultCode, data?: any) {
        this.result = result;
        this.data = data;
    }
}