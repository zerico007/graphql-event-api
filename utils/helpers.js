const moment = require("moment");
const Event = require("../models/event");
const User = require("../models/users");
const Booking = require("../models/booking");

const objectDeepCopy = (obj) => JSON.parse(JSON.stringify(obj));
const formatDate = (date) => moment(date).format("MM-DD-YYYY");

const eventObjectFormatter = (eventObj) => {
  return {
    ...objectDeepCopy(eventObj),
    date: formatDate(eventObj.date),
    createdBy: getOneUser({ _id: eventObj.createdBy }),
  };
};

const bookingObjectFormatter = (bookingObj) => {
  return {
    _id: bookingObj._id,
    event: getOneEvent({ _id: bookingObj.event }),
    user: getOneUser({ _id: bookingObj.user }),
    createdAt: formatDate(bookingObj.createdAt),
    updatedAt: formatDate(bookingObj.updatedAt),
  };
};

const getOneBooking = (bookingId) => {
  return Booking.findById(bookingId)
    .then((book) => {
      if (!book) throw new Error("Booking not found");
      return bookingObjectFormatter(book);
    })
    .catch((err) => {
      throw err;
    });
};

const getOneUser = (query) => {
  return User.findOne(query)
    .populate("createdEvents")
    .then((person) => {
      if (!person) throw new Error("Person not found");
      return {
        email: person.email,
        _id: person._id,
        createdEvents: [
          ...person.createdEvents.map((event) => {
            return {
              ...objectDeepCopy(event),
              date: formatDate(event.date),
              createdBy: person,
            };
          }),
        ],
      };
    })
    .catch((err) => {
      throw err;
    });
};

const getEvents = (eventIds = []) => {
  return Event.find({ _id: { $in: eventIds } })
    .then((events) => {
      return events.map((event) => {
        return eventObjectFormatter(event);
      });
    })
    .catch((err) => {
      throw err;
    });
};

const getOneEvent = (query) => {
  return Event.findOne(query)
    .then((event) => {
      if (!event) throw new Error("Event not found");
      return eventObjectFormatter(event);
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  objectDeepCopy,
  formatDate,
  eventObjectFormatter,
  bookingObjectFormatter,
  getOneBooking,
  getOneUser,
  getEvents,
  getOneEvent,
};
