function PlaylistClass()
{
	var currentTrack = 0; 
	var tracks = new Array();
	var that = this;
	
	this.setCurrentTrack =function(id) 
	{
		currentTrack = id;
		that.updatePlaylist();
	}
	
	this.setPlaylist = function(obj)
	{
		tracks = obj;
	}
	
	this.addTrack = function (para)
	{
		console.log("Addtrack");
		console.log(para);
		 
		var where = tracks.length;
		tracks[where] = new Object();
		tracks[where] = para;
		that.updatePlaylist();
		console.log(tracks);
	}
	
	this.getTrack = function (id)
	{
		return tracks[id];
	}
	
	this.lastTrackIsPossible = function() 
	{
		if(currentTrack >= 1)
			return true;
		else
			return false;
	}
	
	this.nextTrackIsPossible = function() 
	{
		if(currentTrack < tracks.length-1)
			return true;
		else
			return false;
	}
	
	this.nextTrack = function() 
	{
		currentTrack++;
		that.songChange();
		return tracks[currentTrack];
	}
	
	this.lastTrack = function() 
	{
		currentTrack--;
		that.songChange();
		return tracks[currentTrack];
	}
	
	this.songChange = function() 
	{
		that.updatePlaylist();
		that.updateCurrent();
	}
	
	this.jumpTo = function(id) 
	{
		currentTrack = id;
		that.songChange();
		return tracks[currentTrack];
	}
	
	/*
		FUNKTION ADDLINK :
		PARAMETER URL
		
		Fügt bei entsprechenden Link den Track zur Playlist
	*/
	this.addLink = function(link) 
	{
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
		
		/* YOUTUBE */
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
				
				socket.emit('addTrack',  tracks[i]);
			}
		}
		
		/* SOUNDCLOUD */
		else if(tracks[i].fromHostname == "soundcloud.com" || tracks[i].fromHostname == "www.soundcloud.com")
		{
			var track_url = tracks[i].url;
			SC.get('/resolve', { url: track_url }, function(response) {
				console.log(response);
				tracks[i]["title"] = response.title;
				tracks[i]["id"] = response.id;
				that.updatePlaylist();
				
				socket.emit('addTrack',  tracks[i]);
			});
		}
		else if (tracks[i]["fromHostname"] == "myvideo.com" || tracks[i].fromHostname == "myvideo.de") 
			console.log("Myvideo ist noch nicht funktionsfähig");
		else 
			console.log("URL unbekannt");
			
			
		
	}
	
	this.updateCurrent = function() {
	
		$(".current_musik .song").html("Update Current " + tracks[currentTrack].title);
		$(".current_musik .url").html("Update Current " + tracks[currentTrack].url);
	}
	
	this.updatePlaylist = function() 
	{
		var string = "<h3>Playlist</h3><ul>";
		console.log(tracks);
		for(var i = 0; i < tracks.length; i++)
		{
			if(i == currentTrack)
				string += "<li class='current'><a href='javascript:changeTrack(" + i +");'>"+tracks[i].title+"</a></li>";
			else
				string += "<li><a href='javascript:changeTrack(" + i +");'>"+tracks[i].title+"</a></li>";
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