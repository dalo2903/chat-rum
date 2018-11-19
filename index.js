var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
require('./database/loadModelMongoose')

var MessageController = require('./controllers/MessageController')
var UserController = require('./controllers/UserController')


app.get('/',async function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/css/:css',async function(req, res){
  res.sendFile(__dirname + '/css/'+req.params.css);
});
app.get('/javascript/:js',async function(req, res){
  res.sendFile(__dirname + '/javascript/'+req.params.js);
});


io.on('connection',async function(socket){
  socket.on('chat message',async function(msg){
    const user = await UserController.getUserByName(msg.name)
    
    var message = {
      text: msg.text.trim(),
      author: user._id,
    }
    var createdMessage
    if(message.text != '')
      createdMessage = await MessageController.createMessage(message);
    message['author'] = user
    message.createdAt = createdMessage.createdAt

    io.emit('chat message', message);
    //console.log(message)
 
 
  });
  socket.on('init',async function(msg){
    var messages = await MessageController.getAllMessage();
    
    for(var m of messages){
      // console.log(m)
      io.emit('chat message', m);
      //console.log(m)
    //  console.log(m.time)
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
