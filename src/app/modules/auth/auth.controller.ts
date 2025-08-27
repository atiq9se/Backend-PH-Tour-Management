/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from './auth.service';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookie';
import { JwtPayload } from 'jsonwebtoken';
import { createUserTokens } from '../../utils/userTokens';
import { envVars } from '../../config/.env';
import passport from 'passport';

const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    // const loginInfo = await AuthServices.credentialsLogin(req.body)

    passport.authenticate("local", async(err: any, user: any, info:any)=>{
        if(err){
            //throw new apperror(401, "some error")
            //next(err)
            //return new AppError(401, err)

            
            //return next(err)
            return next(new AppError(401, err))
        }
        if(!user){
            // return new AppError(401, info)
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserTokens(user)

        //delete user.toObject().password

        const {password: pass, ...rest} = user.toObject()

        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Login successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            },
        })

    })(req, res, next)

    // res.cookie("accessToken", loginInfo.accessToken,{
    //     httpOnly: true,
    //     secure: false
    // })
    // res.cookie("refreshToken", loginInfo.refreshToken,{
    //     httpOnly: true,
    //     secure: false
    // })


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
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User password update successfully",
        data: null,
    })
})


const googleCallbackController = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    let redirectTo=req.query.redirectTo? req.query.state as string: ""
    if(redirectTo.startsWith("/")){
        redirectTo=redirectTo.slice(1)
    }

    //booking
    const user = req.user;
    console.log("User", user)
    
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const tokenInfo = createUserTokens(user)
    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logOut,
    resetPassword,
    googleCallbackController
}