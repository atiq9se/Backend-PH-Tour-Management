import { verifyToken } from './../../utils/jwt';
/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { envVars } from '../../config/.env';
import { JwtPayload } from 'jsonwebtoken';

// const createUserFunction = async(req: Request, res: Response)=>{
//    const user = await UserServices.createUser(req.body)
        
//     res.status(httpStatus.CREATED).json({
//             message: "User created successfully",
//             user
//     })
// }

// const createUser = async(req: Request, res: Response, next:NextFunction)=>{
//     try{
//     //  throw new Error("Fake ERROR")
//         //throw new AppError(httpStatus.BAD_REQUEST, 'fake error')
    
//         createUserFunction(req, res)
        

//     }catch(err: any){
//         console.log(err);
//         next(err)
//     }
// }

const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const user = await UserServices.createUser(req.body)
        
    // res.status(httpStatus.CREATED).json({
    //         message: "User created successfully",
    //         user
    // })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user created successfully",
        data: user,
    })
})

const updateUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const userId   = req.params.id;
    const payload  = req.body;
    // const token    = req.headers.authorization;
    // const verifiedToken= verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user;
    const user = await UserServices.updateUser(userId, payload, verifiedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user update successfully",
        data: user,
    })
})

// const getAllUsers = async(req: Request, res: Response, next: NextFunction)=>{
//     try{
//         const users = await UserServices.getAllUsers();
//         return users
//     }catch(err:any){
//         console.log(err);
//         next(err)
//     }
// }

const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
     const result = await UserServices.getAllUsers();

    //  res.status(httpStatus.OK).json({
    //         success: true,
    //         message: "all Users retrieved successfully",
    //         data: users
    // })

     sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "all user successfully",
        data: result.data,
        meta: result.meta,
    })
})

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}

// function next(err: any) {
//     throw new Error("Function not implemented.");
// }
