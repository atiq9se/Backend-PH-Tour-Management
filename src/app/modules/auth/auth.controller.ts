/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from './auth.service';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookie';

const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const loginInfo = await AuthServices.credentialsLogin(req.body)

    // res.cookie("accessToken", loginInfo.accessToken,{
    //     httpOnly: true,
    //     secure: false
    // })
    // res.cookie("refreshToken", loginInfo.refreshToken,{
    //     httpOnly: true,
    //     secure: false
    // })

    setAuthCookie(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Login successfully",
        data: loginInfo,
    })
})

const getNewAccessToken = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, "RefreshToken is not found")
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Login successfully",
        data: tokenInfo,
    })
})

const logOut = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

    res.clearCookie("accessToken",{
            httpOnly: true,
            secure:false,
            sameSite: "lax"
    })
    
    res.clearCookie("refreshToken",{
            httpOnly: true,
            secure:false,
            sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logout successfully",
        data: null,
    })
})

const resetPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    const decodedToken = req.user
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User password update successfully",
        data: null,
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logOut,
    resetPassword
}