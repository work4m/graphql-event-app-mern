const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}));

// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ttopt.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`)
    .then(() => {
        app.listen(3000, () => console.log("listerning from 3000\nhttp://localhost:3000/graphql"));
    })
    .catch(err => {
        console.log("error generated");
        console.log(err);
    });
