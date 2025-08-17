import httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import { User } from '../user/user.model';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from '../../utils/jwt';
import { envVars } from '../../config/.env';


const credentialsLogin = async(payload: Partial<IUser>) => {
   const {email, password} = payload;

   const isUserExist = await User.findOne({email})
   
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    
    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const {password: pass, ...rest} = isUserExist;

    return {
        accessToken,
        refreshToken,
        user: rest
    }

}

export const AuthServices = {
    credentialsLogin
}