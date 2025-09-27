import { Booking } from './../booking/booking.model';
import { BOOKING_STATUS } from './../booking/booking.interface';
import { PAYMENT_STATUS } from './payment.interface';
import { Payment } from "./payment.model";

const successPayment = async(query: Record<string, string>)=>{
    //update booking status to confirm
    //update payment status to paid

    const session = await Booking.startSession();
    session.startTransaction()

    try{
 
    // const booking = await Booking.findByIdAndUpdate([{
    //     user: userId,
    //     status: BOOKING_STATUS.PENDING,
    //     ...payload
    // }], {session})

    const updatePayment = await Payment.findByIdAndUpdate({transactionId:query.transactionId},{
        status: PAYMENT_STATUS.PAID
    },{new:true, runValidators: true, session})
    
    await Booking
        .findByIdAndUpdate(
            updatePayment?.booking,
            {status: BOOKING_STATUS.COMPLETE},
            {new:true, runValidators: true, session}
        )
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom")
    .populate("payment")

    await session.commitTransaction();
    session.endSession()

    return {
        success:true,message:"Payment completed successfully"
    }
    }
    catch(error){
        await session.abortTransaction();
        session.endSession()
        throw error
    }
}

const failPayment = async()=>{

}
const cancelPayment = async()=>{

}

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
}