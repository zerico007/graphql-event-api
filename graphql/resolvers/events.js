const Event = require("../../models/event");
const User = require("../../models/users");
const mongoose = require("mongoose");
const {
  objectDeepCopy,
  formatDate,
  eventObjectFormatter,
  user,
  getEvent,
} = require("../../utils/helpers");

const eventResolvers = {
  event: (args) => {
    return getEvent(args);
  },
  events: (args) => {
    const { limit } = args;
    return Event.find()
      .limit(limit)
      .then((res) => {
        return res.map((event) => eventObjectFormatter(event));
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  createEvent: (args) => {
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      _id: mongoose.Types.ObjectId(),
      title,
      description,
      price,
      date: new Date(date),
      createdBy: "605bf3d0b340a1548b61ec8e",
    });

    return User.findById("605bf3d0b340a1548b61ec8e")
      .then((person) => {
        if (!person) throw new Error("person not found");
        person.createdEvents.push(event);
        person.save();
        return event.save().then((res) => {
          return {
            ...objectDeepCopy(res),
            date: formatDate(res.date),
            createdBy: user({ _id: "605bf3d0b340a1548b61ec8e" }),
          };
        });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};

module.exports = eventResolvers;
