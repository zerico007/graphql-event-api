const eventResolvers = require("./events");
const bookingResolvers = require("./bookings");
const userResolvers = require("./users");

const root = {
  ...eventResolvers,
  ...bookingResolvers,
  ...userResolvers,
};

module.exports = root;
