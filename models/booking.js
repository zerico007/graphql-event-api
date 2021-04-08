const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
