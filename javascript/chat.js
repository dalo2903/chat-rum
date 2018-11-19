var init = true;
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
$(function() {
  var socket = io();
  if (init === true) {
    socket.emit("init", "init");
    init = false;
  }
  $("form").submit(function() {
    var message = {
      text: $("#m").val().trim(),
      username: decodeURIComponent(getCookie('username')),
      name: decodeURIComponent(getCookie('name')),
      userid: decodeURIComponent(getCookie('userid'))
    };
    socket.emit("chat message", message);
    $("#m").val("");
    console.log("message")
    return false;
  });
  socket.on("chat message", function(message) {
    console.log(message)
    var date = new Date(message.createdAt)
    message.time = "(" + date.getHours()+":"+ date.getMinutes()+ ")"

    $("#messages").append($("<li>").html("<span id=\"name\">"+decodeURI(message.author.name) + " ("+message.author.username+ ")"+ "</span>"+"<span id=\"time\"> "+message.time+"</span>:"));
    $("#messages").append($("<li id=\"text\">").text(message.text))
    window.scrollTo(0, document.body.scrollHeight);
  });
  $("#m").keypress(function (e) {
    if(e.which == 13 && !e.shiftKey) {        
        $(this).closest("form").submit();
        e.preventDefault();
        return false;
    }
  });
  
});
