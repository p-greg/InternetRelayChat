var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require("path");
var rooms = ["General"];

app.use(express.static(path.join(__dirname + "/public")));

app.get("/", function(req, res) {
  res.sendfile(path.join(__dirname + "public/index.html"));
});

app.get("/css/styles.css", function(req, res) {
  res.sendFile(path.join(__dirname + "/css/styles.css"));
});

users = [];
sockets = [];
io.on("connection", function(socket) {
  console.log("A user connected");
  socket.on("setUsername", function(data) {
    if (users.indexOf(data) < 0) {
      console.log("Setting Username: " + data);
      users.push(data);
      sockets.push(socket);
      socket.emit("userSet", { username: data, avaliableRooms: rooms });
    } else {
      socket.emit(
        "userExists",
        data + " username is taken. Please enter another username."
      );
    }
  });

  socket.on("newRoom", function(data) {
    if (data.name === "") {
      //do nothing
      console.log("Room name empty, skipping insert");
    } else {
      console.log("Creating room: " + data.name);
      rooms.push(data.name);
      io.sockets.emit("addRoom", { name: data.name });
    }
  });

  socket.on("msg", function(data) {
    io.sockets.emit("newmsg", data);
  });

  socket.on("connection_failed", function() {
    console.log("connection failed");
    document.write("I am sorry. The server is having troubles.");
  });

  socket.on("connect_error", function() {
    console.log("connect error");
    document.write("I am sorry. The server is having troubles.");
  });

  socket.on("reconnect_failed", function() {
    console.log("reconnect failure");
    document.write("I am sorry. The server is having troubles.");
  });

  socket.on("connect_error", function() {
    console.log("connect error");
    document.write("I am sorry. The server is having troubles.");
  });

  socket.on("connect_timeout", function() {
    console.log("connection timeout");
    document.write("I am sorry. The server is having troubles.");
  });

  socket.on("disconnect", function() {
    console.log("Disconnect");
    var i = sockets.indexOf(socket);
    users.splice(i, 1);
    sockets.splice(i, 1);
    console.log("User list after disconnect:");
    console.log(users);
  });
});

server.listen(4141, function() {
  console.log("listening on 4141");
});
