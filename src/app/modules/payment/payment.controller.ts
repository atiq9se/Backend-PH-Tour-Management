
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from 'express';

const successPayment = catchAsync(async(req: Request, res: Response)=>{
    
})
const failPayment = catchAsync(async(req: Request, res: Response)=>{

})
const cancelPayment = catchAsync(async(req: Request, res: Response)=>{

})

export const PaymentController = {
    successPayment,
    failPayment,
    cancelPayment
}