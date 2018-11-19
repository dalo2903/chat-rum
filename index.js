var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require('express-session');

var port = process.env.PORT || 3000;
require("./database/loadModelMongoose");

var MessageController = require("./controllers/MessageController");
var UserController = require("./controllers/UserController");

// use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.get("/css/:css", async function(req, res) {
  res.sendFile(__dirname + "/css/" + req.params.css);
});
app.get("/javascript/:js", async function(req, res) {
  res.sendFile(__dirname + "/javascript/" + req.params.js);
});

app.post("/login", async function(req, res) {
  console.log(req.body);
  if (req.body.username && req.body.password){
    var user = await UserController.getUserByUserName(req.body.username);
    if (user) {
      if (user.password === req.body.password) {
          req.session.userId = user._id;
          return res.redirect('/');
      }
    }
  }
  else {
    res.status(400);
    res.redirect('/');
  }
});
app.post("/register", async function(req, res) {
  console.log(req.body);

  if (req.body.username && req.body.name && req.body.password && req.body['confirm-password']) {
    if (req.body.password !== req.body['confirm-password']) {
      res.status(400);
      res.send();
    }
    var user = await UserController.getUserByUserName(req.body.username);
    if (user) {
      res.status(400);
      res.send("EXIST");
    }
    var obj = {
      username: req.body.username,
      name: req.body.name,
      password: req.body.password
    };
    var userCreate = await UserController.createUser(obj);
    // req.session.userId = user._id;
    res.status(200)
    return res.redirect('/');
  }
  else {
    res.status(400);
    res.redirect('/');
  }
});
app.get("/*", async function(req, res) {
  var user = await UserController.getUserById(req.session.userId);
  if(!user)
    res.sendFile(__dirname + "/html/registration.html");
  else {
    let options = {
      maxAge: 1000 * 60 * 3600 // would expire after 15 minutes
      // httpOnly: true, // The cookie only accessible by the web server
      // signed: true // Indicates if the cookie should be signed
    }
    res.cookie('name', decodeURIComponent(user.name), options);
    res.cookie('username', decodeURIComponent(user.username), options);
    res.cookie('userid', decodeURIComponent(user._id), options);

    
    res.sendFile(__dirname + "/html/index.html");
  }
});


io.on("connection", async function(socket) {
  socket.on("chat message", async function(msg) {
    
    var message = {
      text: msg.text.trim(),
      author:{
        name:decodeURIComponent(msg.name).trim(),
        username: msg.username.trim(),
      }
    };
    var obj = {
      text: msg.text.trim(),
      author: decodeURIComponent(msg.userid).trim()
    }
    var createdMessage
    if (message.text != ""){
      createdMessage = await MessageController.createMessage(obj);
      message.createdAt = createdMessage.createdAt;
    }
    else{
      var date = new Date();
      message.createdAt = date;
    }
    io.emit("chat message", message);

    //console.log(message)
  });
  socket.on("init", async function(msg) {
    var messages = await MessageController.getAllMessage();

    for (var m of messages) {
      // console.log(m)
      io.emit("chat message", m);
      //console.log(m)
      //  console.log(m.time)
    }
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});

module.exports = app;
