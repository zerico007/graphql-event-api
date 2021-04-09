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
    createdBy: user({ _id: eventObj.createdBy }),
  };
};

const bookingObjectFormatter = (bookingObj) => {
  return {
    _id: bookingObj._id,
    event: getEvent({ _id: bookingObj.event }),
    user: user({ _id: bookingObj.user }),
    createdAt: formatDate(bookingObj.createdAt),
    updatedAt: formatDate(bookingObj.updatedAt),
  };
};

const getBooking = (bookingId) => {
  return Booking.findById(bookingId)
    .then((book) => {
      return {
        ...objectDeepCopy(book),
        event: getEvent({ _id: book.event }),
        user: user({ _id: book.user }),
      };
    })
    .catch((err) => {
      throw err;
    });
};

const user = (query) => {
  return User.findOne(query)
    .populate("createdEvents")
    .then((person) => {
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

const events = (eventIds = []) => {
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

const getEvent = (query) => {
  return Event.findOne(query)
    .then((event) => {
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
  getBooking,
  user,
  events,
  getEvent,
};