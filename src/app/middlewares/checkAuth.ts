import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/.env";
import AppError from "../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";

export const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction)=>{

    try{
        const accessToken = req.headers.authorization;
        if(!accessToken){
            throw new AppError(303, "No token received")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        if(!authRoles.includes(verifiedToken.role)){
            throw new AppError(403, "you are not permitted to view all user")
        }
        next();
    }
    catch(error){
       next(error)
    }

}