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

    const payment = await Payment.findByIdAndUpdate({transactionId:}, [{
        booking: booking[0]._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transactionId,
        amount: amount
    }],{session})

    const updateBooking = await Booking
    .findByIdAndUpdate(
        booking[0]._id,
        {payment: payment[0]._id},
        {new:true, runValidators: true, session}
    )
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom")
    .populate("payment");

    const userAddress = (updateBooking?.user as any).address
    const userEmail = (updateBooking?.user as any).email
    const userPhoneNumber = (updateBooking?.user as any).userPhoneNumber
    const userName = (updateBooking?.user as any).name

    const sslPayload: ISSLCommerz = {
          address: userAddress,
          email: userEmail,
          phoneNumber: userPhoneNumber,
          name: userName,
          amount: amount,
          transactionId: transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)
    console.log(sslPayment);

    await session.commitTransaction();
    session.endSession()

    return {
        payment: sslPayment.GatewayPageURL,
        booking: updateBooking
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