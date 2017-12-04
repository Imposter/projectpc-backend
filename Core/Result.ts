import ResultCode from "./ResultCode";

export default class Result {
    private code: ResultCode;
    private data: any;

    constructor(code: ResultCode, data?: any, convert?: boolean) {
        this.code = code;
        this.data = convert ? Result.toJSONArray(data) : data;
    }

    private static toJSONArray(elems: any[]) {
        var result = [];
        elems.forEach(element => {
            if (Array.isArray(element)) {
                result.push(Result.toJSONArray(element));
            } else {
                result.push(element.toJSON());
            }
        });
        return result;
    }
}