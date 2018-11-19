const mongoose = require('mongoose')
const User = mongoose.model('User')

class UserController {
    async createUser (obj) {
        const user = await User.create(obj)
        return user
    }
    async getUserByUserName (username) {
        const user = await User.findOne({username: username})
        return user
    }
    async getUserById (_id) {
        const user = await User.findById(_id)
        return user
    }

}
module.exports = new UserController()
