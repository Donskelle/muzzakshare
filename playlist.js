
var currentTrack = 0;
var tracks = new Array();
	
function setCurrentTrack(id) {
	currentTrack = id;
}
function addTrack(para)
{
	console.log("addTrack");
	
	
	var where = tracks.length;
	tracks[where] = new Object();
	tracks[where] = para;
	console.log(where);
}
function getTrack(id)
{
	return tracks[id];
}

function nextTrack() {
	currentTrack++;
}

function lastTrack() {
	currentTrack--;
}
function jumpTo (id) {
	currentTrack = id;
	return tracks[currentTrack];
}


exports.addTrack = addTrack;
exports.setCurrentTrack = setCurrentTrack;
exports.getTrack = getTrack;
exports.nextTrack = nextTrack;
exports.jumpTo = jumpTo;
exports.currentTrack = currentTrack;
exports.tracks = tracks;
exports.lastTrack = lastTrack;

/*
	FUNKTION ADDLINK :
	PARAMETER URL
	
	Fügt bei entsprechenden Link den Track zur Playlist
*/
/*function addLink(link) {
	var jetzt = new Date();
	var i = tracks.length;
	console.log("Addlink aufgerufen: i = " + i);
	console.log("Addlink aufgerufen: link = " + link);
	
	tracks[i] = new Object();
	tracks[i]["url"] = link;
	tracks[i]["time"] = jetzt.getTime();;
	tracks[i]["fromHostname"] = $.url(link).attr('host');
	
	tracks[i]["id"] = $.url(link).param("v");
	console.log($.url(link).param("v"))
	
	// YOUTUBE 
	if(tracks[i].fromHostname == "www.youtube.com" || tracks[i].fromHostname == "www.youtube.de" )
	{
		$.ajax({
			url : 'https://gdata.youtube.com/feeds/api/videos/' + tracks[i].id + '?v=2&alt=jsonc', 
			dataType: 'jsonp', 
			success: function(response) {
				youtubeFeedCallback(response);
			}
		}); 
		function youtubeFeedCallback(response) {
			console.log("Jetzt kommt die response");
			console.log(response);

				
			tracks[i]["title"] = response.data.title;
			
			that.updatePlaylist();
			console.log(tracks[i]);
		}
	}
	
	// SOUNDCLOUD 
	else if(tracks[i].fromHostname == "soundcloud.com" || "www.soundcloud.com")
	{
		var track_url = tracks[i].url;
		SC.get('/resolve', { url: track_url }, function(response) {
			tracks[i]["title"] = response.title;
			tracks[i]["id"] = response.id;
			that.updatePlaylist();
			console.log(tracks[i]);
		});
	}
	else if (tracks[i]["fromHostname"] == "myvideo.com" || tracks[i].fromHostname == "myvideo.de") 
		console.log("Myvideo ist noch nicht funktionsfähig");
	else 
		console.log("URL unbekannt");
}
*/
/*
function updatePlaylist() {
	var string = "<h3>Playlist</h3><ul>";
	for(var i = 0; i < tracks.length; i++)
	{
		if(i == currentTrack)
			string += "<li class='current'><a href='javascript:changeTrack(" + i +");'>"+tracks[i].title+"</a></li>";
		else
			string += "<li><a href='javascript:changeTrack(" + i +");'>"+tracks[i].title+"</a></li>";
	}
	string += "</ul>";
}*/
