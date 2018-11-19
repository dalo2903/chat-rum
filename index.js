var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
require('./database/loadModelMongoose')

var MessageController = require('./controllers/MessageController')

app.get('/',async function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection',async function(socket){
  socket.on('chat message',async function(msg){
    const message = {
      text: msg.text
    }
    io.emit('chat message', message);
    console.log(message)
    await MessageController.createMessage(message);
  });
  socket.on('init',async function(msg){
    const messages = await MessageController.getAllMessage();
    for(var m of messages){
      // console.log(m)
      io.emit('chat message', m);
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
