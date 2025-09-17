import { Payment } from './../payment/payment.model';
import { Booking } from './booking.model';
import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from './../user/user.model';
import { BOOKING_STATUS, IBooking } from './booking.interface';
import { PAYMENT_STATUS } from '../payment/payment.interface';

const getTransactionId = () =>{
    return `tran_${Date.now()}`
}

const createBooking = async (payload : Partial<IBooking>, userId: string)=>{
    const user = await User.findById(userId);
    if(!user?.phone || !user.address){
       throw new AppError(httpStatus.BAD_REQUEST, "Please update your porfile to book a tour")
    }

    const booking = await Booking.create({
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    })

    const payment = await Payment.create({
        booking: booking._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: 
    })

    return{}
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