var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , playlist = require("./playlist");

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


io.sockets.on('connection', function (socket) {

  socket.broadcast.emit('user', {user:"join"});
  
  socket.on('requestPlaylist', function(data)
  {
	socket.emit('playlistnew', playlist.tracks);
  });
  
  socket.on('disconnect', function () {
		socket.broadcast.emit('user', {user:"leave"});
  });
  
  socket.on('addTrack', function (data) {
	playlist.addTrack(data);
	socket.broadcast.emit('addTrack', data);
  });
  socket.on('changevideonext', function() {
	playlist.nextTrack();
	socket.broadcast.emit('changevideonext', "test");
  });
  socket.on('changevideolast' ,function() {
	playlist.lastTrack();
	socket.broadcast.emit('changevideolast', "test");
  });
  socket.on('changevideo', function(data) {
	socket.broadcast.emit('changevideo', data);
	playlist.setCurrentTrack(data);
  });
  socket.on('playlistaddlink', function(data) {
	playlist.addLink(data.url);
	socket.broadcast.emit('playlistaddlink', { url: data.url });
  });
	
 });

