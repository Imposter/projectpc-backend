import ResultCode from "./ResultCode";
import ArrayResult from "../Models/Results/ArrayResult";

export default class Result {
    private code: ResultCode;
    private data: any;

    constructor(code: ResultCode, data?: any, convert?: boolean) {
        this.code = code;
        this.data = data;
        if (convert) {
            var arrayResult: ArrayResult<Object> = data;
            arrayResult.result = Result.toJSONArray(arrayResult.result);
            this.data = arrayResult;
        }
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
}