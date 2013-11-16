var musicPlayer;
var playlist;
var searchClass;
var readyCount = 0;
var socket = io.connect('http://178.254.6.35:8080');


/* SOCKET EVENTS */
socket.on('playlistnew', function(data) {
	if(data[0] != null)
	{	
		console.log(data);
		playlist.setPlaylist(data);
		console.log(playlist.tracks);
		console.log("NEUE PLAYLIST");
		console.log(playlist.tracks);
		playlist.updatePlaylist();
	}
	else 
		console.log("keine playlist");
	//musicPlayer.changeVideo( playlist.getTrack(id) );
	//playlist.setCurrentTrack(id);
});

socket.on('news', function (data) {
	console.log(data);
});
socket.on('message', function (msg) {
	console.log(msg);
});

socket.on('changeVolume', function (data) {
	musicPlayer.setVolume(data);
});

socket.on('addTrack', function (data) {
	console.log(data)
	playlist.addTrack(data);
});

socket.on('changevideonext', function() {
	musicPlayer.changeVideo(playlist.nextTrack());
});
socket.on('changevideolast', function() {
	musicPlayer.changeVideo(playlist.lastTrack());
});
socket.on('changevideo', function(id) {
	musicPlayer.changeVideo( playlist.getTrack(id) );
	playlist.setCurrentTrack(id);
});
socket.on('playlistaddlink', function(data) {
	playlist.addLink(data.url);
});


socket.on('user', function (data) {
	console.log(data);
	if(data.user == "leave")
	{
		audioLeave.play();
	}
	else if(data.user == "join")
	{
		audioJoin.play();
	}
});

// REALY READY WENN EVERYTHING IS LOADED
function ready()
{
	console.log("real ready");
	musicPlayer.stopVideo();
	socket.emit('requestPlaylist', { give: 'playlist' });
}


$( document ).ready(function() {
	musicPlayer = new PlayerClass();
	playlist = new PlaylistClass();
	searchClass = new SearchClass();
	
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	SC.initialize({
		client_id: '0323a0c847ffd729bf9fcb6baabeecd1'
	});
	readyCount++;
	SC.stream("/tracks/293", function(sound)
	{
		musicPlayer.addPlayerSoundcloud(sound);
	});
	if(readyCount>= 3)
		ready();
});

$("#form1").submit(function() {
	var string = $("#search").val();
	if(string == "")
		console.log("Keine Eingabe");
	else {
		if(ValidUrl(string))
		{
			playlist.addLink(string);
		}
		else if(isYoutubeID(string))
			console.log("search is youtube id");
		else if(isSoundcloudID(string))
			console.log("Ist Soundcloud ID.");
		else {
			searchClass.search(string);
		}
	}
	$("#search").val("");
	return false;
});

$("#form2").submit(function() {
	var string = $("#vol").val();
	if(string >= 0 && string <= 100)
	{
		musicPlayer.setVolume(string);
		socket.emit('changeVolume', string);
	}
	else 
		console.log("keine gültige eingabe");
	
	$("#vol").val("");
	return false;
});


function stopVideo()
{
	musicPlayer.stopVideo();
}
function startVideo()
{
	musicPlayer.startVideo();
}
function nextTrack()
{
	if(playlist.nextTrackIsPossible())
	{
		console.log("ist possible");
		musicPlayer.changeVideo(playlist.nextTrack());
		socket.emit('changevideonext', { test: "data" });
	}
	else 
		console.log("not possible");
}
function lastTrack()
{
	if(playlist.lastTrackIsPossible())
	{
		musicPlayer.changeVideo(playlist.lastTrack());
		socket.emit('changevideolast', { test: "data" });
	}
}
function changeTrack(id)
{
	musicPlayer.changeVideo( playlist.getTrack(id) );
	socket.emit('changevideo', id);
	playlist.setCurrentTrack(id);
}
function addTrack(id)
{
	playlist.addTrack(searchClass.getSearchPart(id) );
	socket.emit('addTrack',  searchClass.getSearchPart(id));
}