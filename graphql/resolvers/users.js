const User = require("../../models/users");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/auth");

const { getOneUser, getEvents } = require("../../utils/helpers");

const userResolvers = {
  user: async (args) => {
    try {
      const person = await getOneUser(args);
      return person;
    } catch (error) {
      return error;
    }
  },
  users: (args) => {
    const { limit } = args;
    return User.find()
      .limit(limit)
      .then((res) => {
        return res.map((each) => ({
          _id: each._id,
          email: each.email,
          createdEvents: getEvents([...each.createdEvents]),
        }));
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  login: (args) => {
    const { email, password } = args.userInput;
    return User.findOne({ email })
      .then((result) => {
        if (result) {
          return bcrypt
            .compare(password, result.password)
            .then(async (response) => {
              if (!response)
                throw new Error("Password is incorrect. Please try again.");
              const payload = {
                userId: result._id,
                email: result.email,
                password: result.password,
              };
              const token = await generateToken(payload);
              return token;
            });
        } else {
          throw new Error("User not found");
        }
      })
      .catch((err) => {
        throw err;
      });
  },

  createUser: (args) => {
    const { email, password } = args.userInput;
    return User.findOne({ email }).then((user) => {
      if (user) {
        throw new Error("User already exists. Please try and sign in");
      } else {
        return bcrypt.hash(password, saltRounds).then((hash) => {
          const user = new User({
            _id: mongoose.Types.ObjectId(),
            email,
            password: hash,
          });
          return user
            .save()
            .then((res) => {
              return { email: res.email, _id: res._id };
            })
            .catch((err) => {
              console.log(err);
              throw err;
            });
        });
      }
    });
  },
};

module.exports = userResolvers;
