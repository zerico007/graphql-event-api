const Booking = require("../../models/booking");
const mongoose = require("mongoose");
const {
  bookingObjectFormatter,
  getBooking,
  getEvent,
} = require("../../utils/helpers");

const bookingResolvers = {
  booking: (args) => {
    return getBooking(args._id);
  },
  bookings: (args) => {
    const { limit } = args;
    return Booking.find()
      .limit(limit)
      .then((res) => {
        return res.map((booking) => bookingObjectFormatter(booking));
      })
      .catch((err) => {
        throw err;
      });
  },
  bookEvent: (args) => {
    const booking = new Booking({
      _id: mongoose.Types.ObjectId(),
      event: args.eventId,
      user: args.userId,
    });
    return booking
      .save()
      .then((booked) => bookingObjectFormatter(booked))
      .catch((err) => {
        throw err;
      });
  },
  cancelBooking: (args) => {
    return Booking.findByIdAndDelete(args.bookingId)
      .then((res) => {
        if (!res) {
          throw new Error("Event not found");
        }
        console.log("success! " + res);
        return getEvent({ _id: res.event });
      })
      .catch((err) => {
        throw err;
      });
  },
};

module.exports = bookingResolvers;
