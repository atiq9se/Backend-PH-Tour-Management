import { httpStatus } from 'http-status-codes';
import { Booking } from './../booking/booking.model';
import { BOOKING_STATUS } from './../booking/booking.interface';
import { PAYMENT_STATUS } from './payment.interface';
import { Payment } from "./payment.model";
import AppError from '../../errorHelpers/AppError';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { SSLService } from '../sslCommerz/sslCommrz.service';

const initPayment = async(bookingId: string)=>{
    const payment = await Payment.findOne( { booking: bookingId } )
    
    if(!payment){
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found. You have not booked this count")
    }

    const booking = await Booking.findById(payment.booking)
        const userAddress = (booking?.user as any).address
        const userEmail = (booking?.user as any).email
        const userPhoneNumber = (booking?.user as any).userPhoneNumber
        const userName = (booking?.user as any).name
    
        const sslPayload: ISSLCommerz = {
              address: userAddress,
              email: userEmail,
              phoneNumber: userPhoneNumber,
              name: userName,
              amount: payment.amount,
              transactionId: payment.transactionId
        }
    
        const sslPayment = await SSLService.sslPaymentInit(sslPayload)
        return{ paymentURL:sslPayment.GatewayPageURL}
}

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
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
}