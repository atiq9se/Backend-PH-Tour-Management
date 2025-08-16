import { application, NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/.env";

const router = Router()

const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction)=>{

    try{
        const accessToken = req.headers.authorization;
        if(!accessToken){
            throw new AppError(303, "No token received")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET)

        // const verifyToken = jwt.verify(accessToken, "secret")

        // if(!verifyToken){
        //     console.log(verifyToken)
        //     throw new AppError(403, `your are not authorizaed ${verifyToken}`)
        // }
        console.log(verifiedToken);

        if((verifiedToken as JwtPayload).role!== Role.ADMIN){
            throw new AppError(403, "you are not permitted to view all user")
        }

        console.log(verifiedToken);

        next();
    }
    catch(error){
       next(error)
    }

}

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)
router.get("/all-users", checkAuth("ADMIN", "SUPER_ADMIN"), UserControllers.getAllUsers)

export const UserRoutes = router