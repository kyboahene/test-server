const usersResolvers = require("./user");
const prospectResolvers = require("./prospect");

module.exports = {
    Mutation: {
        ...usersResolvers.Mutation,
        ...prospectResolvers.Mutation
    },

    Query: {
        ...prospectResolvers.Query
    }
}