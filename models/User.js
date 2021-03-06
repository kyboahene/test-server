const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = model('User', userSchema)
