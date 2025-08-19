import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/.env";
import AppError from "../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import  httpStatus  from 'http-status-codes';

export const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction)=>{

    try{
        const accessToken = req.headers.authorization;
        if(!accessToken){
            throw new AppError(303, "No token received")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({email: verifiedToken.email})
           
        if(!isUserExist){
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        }
        if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }
        if(isUserExist.isDeleted){
            throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted")
        }

        if(!authRoles.includes(verifiedToken.role)){
            throw new AppError(403, "you are not permitted to view all user")
        }
        req.user = verifiedToken
        next();
    }
    catch(error){
       next(error)
    }

}