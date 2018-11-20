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
  if (init === true) {
    socket.emit("init", "init");
    init = false;
  }
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
    message.time = "(" + date.getHours() + ":" + date.getMinutes() + ")";
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
    window.scrollTo(0, document.body.scrollHeight);
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
  $.get("/all")
    .done(function(data) {
      for(let d of data){

        $("#users").append($("<li>").text(d.username))

      }
    })
});
