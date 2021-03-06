const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server-errors')

const User = require('../../models/User')
const { SECRET_KEY } = require('../../config')
const { validRegisterInput, validLoginInput } = require('../../util/validate')
const { ObjectId } = require('bson')

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: '1h' },
  )
}

module.exports = {
  Query: {
    //get user
    async getUser(_, { username }) {
      const errors = {}
      if (username.trim() == '') {
        throw new UserInputError('Errors', {
          errors: {
            username: 'Please provide a username',
          },
        })
      }

      try {
        const user = await User.findOne({ username })
        if (user) {
          console.log(username)
          return user
        }
      } catch (error) {
        throw new Error(err)
      }
    },
  },
  Mutation: {
    //Regsiter User
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info,
    ) {
      //validate data
      const { valid, errors } = validRegisterInput(
        username,
        email,
        password,
        confirmPassword,
      )
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      //make sure user does not exist
      const user = await User.findOne({ username })
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken',
          },
        })
      }

      const user1 = await User.findOne({ email })
      if (user1) {
        throw new UserInputError('Username is taken', {
          errors: {
            general: 'User already exists',
          },
        })
      }

      //hash password and create a token
      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      })
      const res = await newUser.save()

      const token = generateToken(res)
      return {
        ...res._doc,
        id: res._id,
        token,
      }
    },

    //User login
    async login(_, { email, password }) {
      const { valid, errors } = validLoginInput(email, password)
      const user = await User.findOne({ email })

      if (!valid) {
        throw new UserInputError('Wrong Credentials', { errors })
      }

      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', { errors })
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong Credentials'
        throw new UserInputError('Wrong Credentials', { errors })
      }

      const token = generateToken(user)
      return {
        ...user._doc,
        id: user._id,
        token,
      }
    },

    async updateUser(
      _,
      { userID, username, email, password, confirmPassword },
    ) {
      const errors = {}

      const user = await User.findById(ObjectId(userID))
      const details = []

      if (user) {
        console.log(user)
        if (username) {
          details.push(username)
        } else {
          details.push(user.username)
        }

        //hash password and create a token
        if (password) {
          if (password === confirmPassword) {
            password = await bcrypt.hash(password, 12)

            details.push(password)
          } else {
            throw new UserInputError('Errors', {
              errors: {
                password: 'Password does not match',
              },
            })
          }
        } else {
          details.push(user.password)
        }

        if (email) {
          details.push(email)
        } else {
          details.push(user.email)
        }
      }

      try {
        const res = await User.findOneAndUpdate(
          { _id: userID },
          { username: details[0], email: details[2], password: details[1] },
          { new: true },
        )

        return res
      } catch (error) {
        throw new Error(error)
      }
    },

    //send forgot password email
    async sendForgotPasswordEmail(_, { email }) {
      const errors = {}

      if (email.trim() !== '') {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
        if (!email.match(regEx)) {
          throw new UserInputError('Errors', {
            errors: {
              email: 'Please provide a valid email address',
            },
          })
        }
      } else {
        throw new UserInputError('Errors', {
          errors: {
            email: 'Email is required',
          },
        })
      }

      const user = await User.findOne({ email })
      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', { errors })
      }

      try {
        const secret = SECRET_KEY + user.password
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          secret,
          { expiresIn: '20mins' },
        )

        const link = `http://localhost:5000/reset-password/${user._id}/${token}`

        console.log(link)
        return {
          link,
        }
      } catch (error) {
        throw new Error(error)
      }
    },

    //reset password
  },
}
