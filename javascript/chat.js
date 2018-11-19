var init = true;
$(function() {
  var socket = io();
  if (init === true) {
    socket.emit("init", "init");
    init = false;
  }
  $("form").submit(function() {
    var message = {
      text: $("#m").val()
    };
    socket.emit("chat message", message);
    $("#m").val("");
    console.log("message")
    return false;
  });
  socket.on("chat message", function(message) {
    $("#messages").append($("<li>").text(message.text));
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
