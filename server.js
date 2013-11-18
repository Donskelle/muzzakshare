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
var users = new Array();
var playlists = new Array();
var rooms = new Array();

io.sockets.on('connection', function (socket) {
	//MongoClient.connect('mongodb://localhost/test/', function(err, db) {
		var length = users.length;
		users[length] = new Object();
		users[length].userid = length;
		users[length].online = true;
		users[length].room = 0;
		playlists[length] = new Object();
		playlists[length] = require("./playlist");
		var currentCategory = length;

		
		//socket.broadcast.emit('user', {user: currentuser});
		socket.emit('currentuser', {user: length});
		socket.broadcast.emit('user', {user: "join", userid: length});
		console.log(length);
		//db.testData.update({name: "Fabian", languages: ["test", "html"]});

		socket.on('requestPlaylist', function(data)
		{
			socket.emit('playlistnew', playlists[currentCategory].tracks);
			for (var i = 0; i < users.length; i++) {
				if(users[i].online == true)
					if(users[i].userid != length)
						socket.emit('onlineuser', {userid: users[i].userid});
			} 
			
		});
		
		socket.emit('acceptJoinRoom', function(data)
		{
			var currentLength = rooms.length;
			rooms[currentLength] = new Object();
			users[length].room = rooms;
			socket.broadcast.emit = 
		}
		
		socket.on('askJoinRoom', function(data) {
			socket.broadcast.emit('askJoin', {to: data.userid, from: length});
		});
		
		socket.on('changeVolume', function(data) {
			socket.broadcast.emit('changeVolume', data);
		});

		socket.on('disconnect', function () {
			socket.broadcast.emit('user', {user:"leave", userid: length});
			users[length].online = false;
		});

		socket.on('addTrack', function (data) {
			playlists[length].addTrack(data);
			socket.broadcast.emit('addTrack', data);
		});
		
		socket.on('changevideonext', function() {
			playlists[length].nextTrack();
			socket.broadcast.emit('changevideonext', "test");
		});
		
		socket.on('debug', function() {
			console.log(length);
		});
		socket.on('changevideolast' ,function() {
			playlists[length].lastTrack();
			socket.broadcast.emit('changevideolast', "test");
		});
		
		socket.on('changevideo', function(data) {
			socket.broadcast.emit('changevideo', data);
			playlists[length].setCurrentTrack(data);
		});
		
		socket.on('playlistaddlink', function(data) {
			playlists[length].addLink(data.url);
			socket.broadcast.emit('playlistaddlink', { url: data.url });
		});
});