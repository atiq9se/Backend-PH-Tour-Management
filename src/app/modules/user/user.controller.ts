import { Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";

const createUser = async(req: Request, res: Response)=>{
    try{
    //    throw new Error("Fake ERROR")
       const user = await UserServices.createUser(req.body)
    
       res.status(httpStatus.CREATED).json({
            message: "User created successfully",
            user
       })

    }catch(err: any){
        console.log(err);
        next(err)
    }
}

export const UserControllers = {
    createUser
}