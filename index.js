var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');
var MarkdownIt = require("markdown-it");
var md = new MarkdownIt({
  breaks: true,
  linkify: true
});
var path = require('path');
var moment = require('moment');

var users = [];

//随机获取颜色
var getRandomColor = function() {
  return '#' +
    (function(color) {
      return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
    })('');
}

app.use(express.static(path.join(__dirname + '/static')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

  socket.on('user connection', function(msg) {
    users.push({
      id: socket.id,
      name: msg,
      color: getRandomColor()
    })
    io.sockets.emit('hi', {
      msg: msg + '加入聊天室\n当前在线人数' + users.length,
      users: users
    });
  });

  socket.on('disconnect', function() {
    var i = _.findIndex(users, {
      id: socket.id
    });
    if (i >= 0) {
      var _user = users[i];
      _.remove(users, function(u) {
        return u.id == socket.id;
      })
      io.sockets.emit('hi', {
        msg: _user.name + '离开了聊天室\n当前在线人数' + users.length,
        users: users
      });
    }
  });

  socket.on('chat message', function(msg) {
    if (msg) {
      var i = _.findIndex(users, {
        id: socket.id
      });
      if (i >= 0) {
        io.emit('chat message', {
          user: users[i],
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
          msg: md.render(msg)
        });
      }
    }
  });

});

http.listen(4000, function() {
  console.log('listening on *:4000');
});