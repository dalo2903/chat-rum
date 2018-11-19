const mongoose = require('mongoose')
const User = mongoose.model('User')

class UserController {
    async createUser (obj) {
        const user = await User.create(obj)
        return user
    }
    async getUserByName (name) {
        const user = await User.findOne({name: name})
        if(!user){
            var newUser = {
                name: name
            }
            return await this.createUser(newUser)
        }
        return user
    }
}
module.exports = new UserController()
