var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require("path");

app.use(express.static(path.join(__dirname + "/public")));

app.get("/", function(req, res) {
  res.sendfile(path.join(__dirname + "public/index.html"));
});

app.get("/css/styles.css", function(req, res) {
  res.sendFile(path.join(__dirname + "/css/styles.css"));
});

users = [];
io.on("connection", function(socket) {
  console.log("A user connected");
  socket.on("setUsername", function(data) {
    if (users.indexOf(data) < 0) {
      console.log("Setting Username: " + data);
      users.push(data);
      socket.emit("userSet", { username: data });
      console.log(users);
    } else {
      socket.emit(
        "userExists",
        data + " username is taken. Please enter another username."
      );
    }
  });

  socket.on("msg", function(data) {
    io.sockets.emit("newmsg", data);
  });
});

server.listen(4141, function() {
  console.log("listening on 4141");
});
