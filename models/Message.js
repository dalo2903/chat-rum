const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  text: {
    type: String,
    default: ''
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
    }
}, { usePushEach: true , timestamps: true})

mongoose.model('Message', MessageSchema)
