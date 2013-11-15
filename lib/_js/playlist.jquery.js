function PlaylistClass()
{
	var currentTrack = 0;
	var tracks = new Array();
	var length = 0;
	var that = this;
	
	this.setCurrentTrack =function(id) {
		currentTrack = id;
		that.updatePlaylist();
	}
	this.addTrack = function (para)
	{
		console.log("Addtrack");
		console.log(para);
		
		var where = that.tracks.length;
		that.tracks[where] = new Object();
		that.tracks[where] = para;
		that.updatePlaylist();
		console.log(that.tracks);
	}
	this.getTrack = function (id)
	{
		return that.tracks[id];
	}
	this.lastTrackIsPossible = function() {
		if(currentTrack >= 1)
			return true;
		else
			return false;
	}
	
	this.nextTrackIsPossible = function() {
		if(currentTrack < that.tracks.length-1)
			return true;
		else
			return false;
	}
	this.nextTrack = function() {
		currentTrack++;
		that.songChange();
		return that.tracks[currentTrack];
	}
	this.lastTrack = function() {
		currentTrack--;
		that.songChange();
		return that.tracks[currentTrack];
	}
	
	this.songChange = function() {
		that.updatePlaylist();
		that.updateCurrent();
	}
	this.jumpTo = function(id) {
		currentTrack = id;
		that.songChange();
		return that.tracks[currentTrack];
	}
	
	/*
		FUNKTION ADDLINK :
		PARAMETER URL
		
		Fügt bei entsprechenden Link den Track zur Playlist
	*/
	this.addLink = function(link) {
		var jetzt = new Date();
		var i = that.tracks.length;
		console.log("Addlink aufgerufen: i = " + i);
		console.log("Addlink aufgerufen: link = " + link);
		
		that.tracks[i] = new Object();
		that.tracks[i]["url"] = link;
		that.tracks[i]["time"] = jetzt.getTime();;
		that.tracks[i]["fromHostname"] = $.url(link).attr('host');
		
		that.tracks[i]["id"] = $.url(link).param("v");
		console.log($.url(link).param("v"))
		
		/* YOUTUBE */
		if(that.tracks[i].fromHostname == "www.youtube.com" || that.tracks[i].fromHostname == "www.youtube.de" )
		{
			$.ajax({
				url : 'https://gdata.youtube.com/feeds/api/videos/' + that.tracks[i].id + '?v=2&alt=jsonc', 
				dataType: 'jsonp', 
				success: function(response) {
					youtubeFeedCallback(response);
				}
			}); 
			function youtubeFeedCallback(response) {
				console.log("Jetzt kommt die response");
				console.log(response);

					
				that.tracks[i]["title"] = response.data.title;
				
				that.updatePlaylist();
				console.log(that.tracks[i]);
			}
		}
		
		/* SOUNDCLOUD */
		else if(that.tracks[i].fromHostname == "soundcloud.com" || "www.soundcloud.com")
		{
			var track_url = that.tracks[i].url;
			SC.get('/resolve', { url: track_url }, function(response) {
				that.tracks[i]["title"] = response.title;
				that.tracks[i]["id"] = response.id;
				that.updatePlaylist();
				console.log(that.tracks[i]);
			});
		}
		else if (that.tracks[i]["fromHostname"] == "myvideo.com" || that.tracks[i].fromHostname == "myvideo.de") 
			console.log("Myvideo ist noch nicht funktionsfähig");
		else 
			console.log("URL unbekannt");
	}
	
	this.updateCurrent = function() {
		$(".current_musik .song").html("Update Current " + that.tracks[currentTrack].title);
		$(".current_musik .url").html("Update Current " + that.tracks[currentTrack].url);
	}
	
	this.updatePlaylist = function() {
		var string = "<h3>Playlist</h3><ul>";
		console.log(that.tracks);
		for(var i = 0; i < that.tracks.length; i++)
		{
			if(i == currentTrack)
				string += "<li class='current'><a href='javascript:changeTrack(" + i +");'>"+that.tracks[i].title+"</a></li>";
			else
				string += "<li><a href='javascript:changeTrack(" + i +");'>"+that.tracks[i].title+"</a></li>";
		}
		string += "</ul>";
		$("#playlist").html(string);
	}
	/*this.updatePlaylist = function(id) {
		currentTrack = id;
		var string = "<ul>";
		for(var i = 0; i < tracks.length; i++)
		{
			if(i == currentTrack)
				string += "<li class='current'><a href='javascript:changeTrack(" + i +");'>"+tracks[i].title+"</a></li>";
			else
				string += "<li><a href='javascript:changeTrack(" + i +");'>"+tracks[i].title+"</a></li>";
		}
		string += "</ul>";
		$("#playlist").html(string);
	}*/
}