const { ApolloServer }  = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");

const { MONGODB, PORT } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");


mongoose.set("useFindAndModify", false);

const startServer = async () => {
    await mongoose.connect(MONGODB || "mongodb://localhost:27018/insurerity", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(() => {
        console.log("Mongodb connected");
        app.listen( process.env.PORT || PORT, () => {
            console.log(`Server is connected${server.graphqlPath}`);
        })
    }).catch((err) => {
        console.error(err);
    })
}

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.applyMiddleware({app});

startServer();



