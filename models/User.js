const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  avatar: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  username:{
    type: String,
    default: ''
  },
  decorations:[{
    attribute:{
      type: String,
      default: ''
    },
    value:{
      type: String,
      default: ''
    } 
  }],
  // email:{
  //   type: String,
  //   default: ''
  // },
  password: {
    type: String
  },
  role: {
    type: Number,
    default: 0
  }
}, { usePushEach: true })

mongoose.model('User', UserSchema)
