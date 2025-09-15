import { model, Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { string } from "zod";

const bookingSchema = new Schema<IBooking>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
    },
    status: {
        type: string,
        enum: Object.values(BOOKING_STATUS),
        default: BOOKING_STATUS.PENDING
    },
    guestCount: {
        type: Number,
        required: true
    }
    
 },{
        timestamps: true
    }
)

export const Booking = model<IBooking>("Booking", bookingSchema)