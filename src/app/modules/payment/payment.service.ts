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
        const updatePayment = await Payment.findByIdAndUpdate({transactionId:query.transactionId},{
            status: PAYMENT_STATUS.PAID
        },{new:true, runValidators: true, session})
        
        await Booking
            .findByIdAndUpdate(
                updatePayment?.booking,
                {status: BOOKING_STATUS.COMPLETE},
                {new:true, runValidators: true, session}
            )

        await session.commitTransaction();
        session.endSession()

        return {success:true,message:"Payment completed successfully"}
    }catch(error){
        await session.abortTransaction();
        session.endSession()
        throw error
    }
}

const failPayment = async(query: Record<string, string>)=>{
    const session = await Booking.startSession();
    session.startTransaction()

    try{
        const updatePayment = await Payment.findByIdAndUpdate({transactionId:query.transactionId},{
            status: PAYMENT_STATUS.PAID
        },{new:true, runValidators: true, session})
        
        await Booking
            .findByIdAndUpdate(
                updatePayment?.booking,
                {status: BOOKING_STATUS.COMPLETE},
                {new:true, runValidators: true, session}
            )

        await session.commitTransaction();
        session.endSession()

        return {success:false, message:"Payment Failed"}
    }catch(error){
        await session.abortTransaction();
        session.endSession()
        throw error
    }

}
const cancelPayment = async(query: Record<string, string>)=>{
    const session = await Booking.startSession();
    session.startTransaction()

    try{
        const updatePayment = await Payment.findByIdAndUpdate({transactionId:query.transactionId},{
            status: PAYMENT_STATUS.CANCELLED,
        },{runValidators: true, session})
    
        await Booking
        .findByIdAndUpdate(
            updatePayment?.booking,
            {status: BOOKING_STATUS.CANCEL},
            {runValidators: true, session}
        )

        await session.commitTransaction();
        session.endSession()

        return { success:false, message:"Payment Cancelled" }
    }catch(error){
        await session.abortTransaction();
        session.endSession()
        throw error
    }

}

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
}