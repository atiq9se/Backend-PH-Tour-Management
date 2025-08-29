/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/.env"
import AppError from "../errorHelpers/AppError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (err:any, req: Request, res: Response, next: NextFunction )=>{
    console.log(err)

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

    const errorSource = [

    ]
    
    let statusCode = 500;
    let message = `Something went wrong!!`
    
 
    //Duplicate error
    if(err.code === 11000){
        const matchedArray = err.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${duplicate[1]} already exists!!`
    }
    // cast error
    else if(err.name === "CastError"){
        statusCode = 400;
        message = "Invalid MongoDB ObjectID. Please provide a valid id"
    }

    else if(err.name === "ValidationError"){
        statusCode = 400;

        const errors = Object.values(err.errors)
        errors.forEach((errorObject: any)=> errorSource.push({
                path: errorObject.path,
                message: errorObject.message
            }))

        message = "Validation Error werwe Occurred"
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
        errorSource,
        // err,
        stack: envVars.NODE_ENV=== "development" ? err.stack: null

    })
}