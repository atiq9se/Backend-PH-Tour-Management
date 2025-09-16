import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createBooking = catchAsync(async(req: Request, res: Response)=>{
    const booking = await BookingService.createBooking();

    sendResponse(res,{
        statusCode : 201,
        success: true,
        message: "Create booking successfully",
        data: booking
    })
})

const getUserBooking = catchAsync(async(req: Request, res: Response)=>{
       const bookings = await BookingService.getUserBooking();

       sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings
       })
})

const getSingleBooking = catchAsync(async(req: Request, res: Response)=>{
    const booking = await BookingService.getBookingById();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved successfully",
        data: bookings
    })
})

const getAllBooking = catchAsync(async(req: Request, res: Response)=>{
    const bookings = await BookingService.getAllBookings();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data:{}
    })
})

const updateBookingStatus = catchAsync(async(req: Request, res: Response)=>{
    const updated = await BookingService.updateBookingStatus();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved successfully",
        data: updated
    })
})

export const BookingController = {
    createBooking,
    getUserBooking,
    getSingleBooking,
    getAllBooking,
    updateBookingStatus
}