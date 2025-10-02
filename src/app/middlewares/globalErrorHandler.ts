/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/.env"
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";




// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (err:any, req: Request, res: Response, next: NextFunction )=>{
    if(envVars.NODE_ENV === "development"){
        console.log(err)
    }

    /**
     * Mongoose
     * zod
     */

    /**
     * Mongoose
     * -Duplicate
     * -Cast Error
     * 
     */

    let errorSources: TErrorSources[] = [
        //   {
        //     path: "isDeleted",
        //     message: "cast is error"
        //   }
    ]
    let statusCode = 500;
    let message = `Something went wrong!!`
    
 
    //Duplicate error
    if(err.code === 11000){
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // cast error
    else if(err.name === "CastError"){
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }

    // zod validation
    else if(err.name === "ZodError"){
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message;
    }


    // Mongoose validation
    else if(err.name === "ValidationError"){
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message;
    }

    else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }else if(err instanceof Error){
        statusCode = 500;
        message = err.message 
    }


    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err   : envVars.NODE_ENV === "development" ? err: null,
        stack : envVars.NODE_ENV === "development" ? err.stack: null

    })
}