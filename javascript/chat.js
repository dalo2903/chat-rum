function playSound(){
  var mp3Source = '<source src="/public/sound/join.wav" type="audio/wav">';
 
  $("#sound").html('<audio autoplay="autoplay">' + mp3Source + '</audio>');
}
function notify(title, options) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(title, options);
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "granted") {
    Notification.requestPermission().then(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        // Display pop-up if page is not hidden
        var notification = new Notification(title, options);
      }
    });
  }
 
  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

var init = true;

if (!String.linkify) {
  String.prototype.linkify = function() {
    // http://, https://, ftp://
    var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    // www. sans http:// or https://
    var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    // Email addresses
    var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

    return this.replace(urlPattern, '<a href="$&">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
  };
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
$(function() {
  emojify.setConfig({ img_dir: "public/images/emoji" });
  var socket = io();
  socket.emit("init", "init");
  var userList = [];

  var user = {
    username: decodeURIComponent(getCookie("username")),
    name: decodeURIComponent(getCookie("name")),
    userid: decodeURIComponent(getCookie("userid"))
  };

  socket.emit("user connect", user);

  $("form").submit(function() {
    var message = {
      text: $("#m")
        .val()
        .trim(),
      username: decodeURIComponent(getCookie("username")),
      name: decodeURIComponent(getCookie("name")),
      userid: decodeURIComponent(getCookie("userid"))
    };
    socket.emit("chat message", message);
    $("#m").val("");
    console.log("message");
    return false;
  });
  var lastUsername = "";
  socket.on("chat message", function(message) {
    console.log(message);
    var date = new Date(message.createdAt);
    message.time =
      "(" +
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ")";
    if (lastUsername !== message.author.username) {
      $("#messages").append(
        $("<li>").html(
          '<span id="name">' +
            decodeURI(message.author.name) +
            " (" +
            message.author.username +
            ")" +
            "</span>" +
            '<span id="time"> ' +
            message.time +
            "</span>:"
        )
      );
    }

    $("#messages").append($('<li id="text">').html(message.text.linkify()));
    lastUsername = message.author.username;
    emojify.run();
    if (message.isNew === true) {
      var hidden = ifvisible.now("hidden");
    }
    if (hidden) {
      const title = "New message from " + message.author.name;
      const options = {
        body: message.text,
        icon: "/public/images/emoji/clep.gif"
      };
      notify(title, options);
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on("user list", function(users) {
    console.log(users);
    playSound()
    $("#users").html("");
    for (let user of users){
      var decorations = {}
      for(let d of user.decorations){
        decorations[d.attribute] = d.value
      }
      $("#users").append($("<li id=\"user\">").css(decorations).html('<i class="fas fa-user"></i> ' + user.username));
    }
  });
  socket.on("emoji list", function(emojis) {
    $("#picker").html("");
    for (let emoji of emojis){
      var code = emoji.split('.')[0]
      $("#picker").append($("<option>").val(":"+code+":").text(":"+code+":")).selectpicker('refresh');
    }
    emojify.run()
  });
  $("#picker").on('change', function(e){
    // $("#m").append(this.value)
    var txt = $.trim(this.value);
    var box = $("#m");
    box.val(box.val() + txt);
  })
  $(window).on("beforeunload", function() {
    socket.emit("user disconnect", user);
  });

  $("#m").keypress(function(e) {
    if (e.which == 13 && !e.shiftKey) {
      $(this)
        .closest("form")
        .submit();
      e.preventDefault();
      return false;
    }
  });
  ifvisible.on("blur", function(){
    // socket.emit("user disconnect", user)
  });
  ifvisible.on("focus", function(){
    socket.emit("user connect", user)
  });
  // ifvisible.setIdleDuration(300)
  ifvisible.on("idle", function(){
    // socket.emit("user disconnect", user)
    lastUsername = ""    
  });
});
