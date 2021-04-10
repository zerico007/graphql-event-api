const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const root = require("./graphql/resolvers/root");
const schema = require("./graphql/schemas/schema");
const { validationMiddleware } = require("./utils/auth");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DBPASSWORD}@cluster0.jf2i8.mongodb.net/apiEventsDB?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("connected");
    app.listen(4040);
  })
  .catch((err) => console.log(err + " Something went wrong"));

mongoose.Promise = global.Promise;

const app = express();
app.use(cors());

app.use(express.json());
app.use(validationMiddleware);
app.use(
  "/eventapi",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

//error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
