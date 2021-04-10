const { gql } = require('apollo-server-express')

module.exports = gql`
  type Query {
    getUser(username: String!): Details!
    getProspectsPerUsername(username: String!): [Prospect]
    getAllProspects: [Prospect]
  }

  type Mutation {
    register(registerInput: registerInput): User!
    login(email: String!, password: String!): User!
    updateUser(
      userID: ID
      username: String
      email: String
      password: String
      confirmPassword: String
    ): User!
    sendForgotPasswordEmail(email: String!): Link!
    forgotPasswordChange(newPassword: String!, key: String!): User!

    addProspect(prospectDetails: prospectDetails): Prospect!
    deleteProspect(ProspectId: ID!): String!
    addDriverLincense(
      ProspectId: ID!
      DofBirth: String!
      Number: String!
      State: State!
    ): Prospect!
    addProvider(ProspectId: String!, Provider: Providers!): Prospect!
  }

  type Link {
    link: String!
  }

  type Details {
    id: ID!
    username: String!
    email: String!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
  }

  type Prospect {
    id: ID!
    fname: String!
    Lname: String!
    email: String!
    phone: String!
    provider: String
    status: String!
    driver_license: [Driver_Info]
    createdAt: String!
    user: String!
  }

  type Driver_Info {
    DofBirth: String!
    Number: String!
    State: String!
  }

  input registerInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input prospectDetails {
    username: String!
    fname: String!
    Lname: String!
    email: String!
    phone: String!
  }

  enum Providers {
    AllState
    StateFarm
    Geico
    USaa
    farmers
    Insurance
    Kemper
    Progressive
  }

  enum State {
    California
    Colorado
    Kumasi
    Accra
    Konongo
    Swedru
  }
`
