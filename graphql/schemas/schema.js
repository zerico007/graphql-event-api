const { buildSchema } = require("graphql");

const schema = buildSchema(`

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}


type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    createdBy: User
}

type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

input UserInput {
    email: String!
    password: String!
}

type RootQuery {
    events(limit: Int): [Event!]!
    users(limit: Int): [User!]!
    login(userInput: UserInput): String!
    bookings(limit: Int, user: ID, event: ID): [Booking!]!
    event(_id: ID, title: String): Event!
    user(_id: ID, email: String): User!
    booking(_id: ID!): Booking! 
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!, userId: ID!): Booking
    cancelBooking(bookingId: ID!): Event
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

module.exports = schema;
