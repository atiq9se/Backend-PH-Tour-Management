import { application, NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { Role } from "./user.interface";

const router = Router()

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)

router.get("/all-users", (req: Request, res: Response, next: NextFunction)=>{

    try{
        const accessToken = req.headers.authorization;
        if(!accessToken){
            throw new AppError(303, "No token received")
        }

        const verifyToken = jwt.verify(accessToken, "secret")

        if(!verifyToken){
            console.log(verifyToken)
            throw new AppError(403, `your are not authorizaed ${verifyToken}`)
        }
        if((verifyToken as JwtPayload).role!== Role.ADMIN || Role.SUPER_ADMIN){
            throw new AppError(403, "you are not permitted to view all user")
        }

        console.log(verifyToken);
        next();
    }
    catch(error){
       next(error)
    }

}, UserControllers.getAllUsers)

export const UserRoutes = router