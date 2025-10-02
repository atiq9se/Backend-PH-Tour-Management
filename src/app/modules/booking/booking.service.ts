/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tour } from './../tour/tour.model';
import { Payment } from './../payment/payment.model';
import { Booking } from './booking.model';
import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from './../user/user.model';
import { BOOKING_STATUS, IBooking } from './booking.interface';
import { PAYMENT_STATUS } from '../payment/payment.interface';
import { SSLService } from '../sslCommerz/sslCommrz.service';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';

const getTransactionId = () =>{
    return `tran_${Date.now()}_${Math.floor(Math.random()*1000)}`
}

const createBooking = async (payload : Partial<IBooking>, userId: string)=>{
    const transactionId = getTransactionId()

    // const session = await Booking.startSession();

    // session.startTransaction()

   
    const user = await User.findById(userId);
    
    if(!user?.phone || !user.address){
       throw new AppError(httpStatus.BAD_REQUEST, "Please update your porfile to book a tour")
    }

    const tour = await Tour.findById(payload.tour).select("costFrom")

    if(!tour?.costFrom){
        throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found")
    }
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom)* Number(payload.guestCount!)

    const booking = await Booking.create([{
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    }])

    const payment = await Payment.create({
        booking: booking._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transactionId,
        amount: amount
    })

    const updatedBooking = await Booking
        .findByIdAndUpdate(
            booking._id,
            {payment:payment._id},
            {new:true, runValidators: true,}
        )
    
    return updatedBooking
    // .populate("user", "name email phone address")
    // .populate("tour", "title costFrom")
    // .populate("payment");

    // const userAddress = (updateBooking?.user as any).address
    // const userEmail = (updateBooking?.user as any).email
    // const userPhoneNumber = (updateBooking?.user as any).userPhoneNumber
    // const userName = (updateBooking?.user as any).name

    // const sslPayload: ISSLCommerz = {
    //       address: userAddress,
    //       email: userEmail,
    //       phoneNumber: userPhoneNumber,
    //       name: userName,
    //       amount: amount,
    //       transactionId: transactionId
    // }

    // const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    // await session.commitTransaction();
    // session.endSession()

    // return {
    //     payment: sslPayment.GatewayPageURL,
    //     booking: updateBooking
    // }
    // }
    // catch(error){
    //     await session.abortTransaction();
    //     session.endSession()
    //     throw error
    // }
}

const getUserBookings = async () =>{
    return {}
}

const getBookingById = async () =>{
    return {}
}

const updateBookingStatus = async ()=>{
    return {}
}

const getAllBookings = async () =>{
    return {}
}

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    getAllBookings,
    updateBookingStatus
}