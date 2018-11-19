var init = true;
$(function() {
  var socket = io();
  if (init === true) {
    socket.emit("init", "init");
    init = false;
  }
  $("form").submit(function() {
    var message = {
      text: $("#m").val().trim(),
      name: $("#username").val().trim(),
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

    $("#messages").append($("<li>").html("<span id=\"name\">"+message.author.name+"</span>"+"<span id=\"time\"> "+message.time+"</span>:"));
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
