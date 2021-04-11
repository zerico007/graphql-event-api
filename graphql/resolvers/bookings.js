const Booking = require("../../models/booking");
const mongoose = require("mongoose");
const {
  bookingObjectFormatter,
  getBooking,
  getEvent,
} = require("../../utils/helpers");

const bookingResolvers = {
  booking: async (args) => {
    try {
      const booking = await getBooking(args._id);
      return booking;
    } catch (error) {
      return error;
    }
  },
  bookings: (args) => {
    const { limit } = args;
    const query = {};
    if (args.user) query.user = args.user;
    if (args.event) query.event = args.event;
    return Booking.find(query)
      .limit(limit)
      .then((res) => {
        if (!res.length) throw new Error("No bookings found");
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
