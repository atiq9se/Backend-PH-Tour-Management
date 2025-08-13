import { success } from "zod";

interface TMata {
    total: number
}
interface TResponse<T>{
    statusCode: number;
    success: true;
    message: string;
    data: T;
    meta ? : TMeta
}


export const sendResponse = <T> (res: Response, data: TResponse<T>)=>{

    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
    })
}