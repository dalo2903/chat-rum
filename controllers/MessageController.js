const mongoose = require('mongoose')
const Message = mongoose.model('Message')

class MessageController {
    async createMessage (obj) {
        const message = await Message.create(obj)
        return message
    }
    async getAllMessage () {
        const messages = await Message.find().sort('-createdAt').exec()
        return messages
    }
}
module.exports = new MessageController()
