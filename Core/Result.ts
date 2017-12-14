import ResultCode from "./ResultCode";
import ArrayResult from "../Models/Results/ArrayResult";

export default class Result {
    private code: ResultCode;
    private data: any;

    constructor(code: ResultCode, data?: any) {
        this.code = code;
        this.data = data;
    }

    private static toJSONArray(elements: any[]) {
        var result = [];
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (Array.isArray(element)) {
                result.push(Result.toJSONArray(element));
            } else {
                result.push(element.toJSON());
            }
        }
        return result;
    }

    public static CreateResult(code: ResultCode) {
        return new Result(code);
    }

    public static CreateDataResult(code: ResultCode, data?: any) {
        return new Result(code, data.toJSON());
    }

    public static CreateArrayResult<TData>(code: ResultCode, arrayResult: ArrayResult<TData>): Result {
        arrayResult.result = Result.toJSONArray(arrayResult.result);
        return new Result(code, arrayResult);
    }
}