// const config = require('../config')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const uriMongo = 'mongodb://chatrum:concac555@ds211724.mlab.com:11724/chat-rum'

mongoose.connect(uriMongo, { useNewUrlParser: true })

const modelsPath = path.resolve(__dirname, '../models')
fs.readdirSync(modelsPath).forEach(file => {
  require(modelsPath + '/' + file)
})
