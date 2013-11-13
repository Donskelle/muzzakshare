function SearchClass()
{
	var searchString;
	var tracks = new Array();
	var that = this;

	this.search = function(inputString) {
		searchString = inputString;
		var count = 0;
		// SOUND CLOUD
		tracks.length = 0;
		SC.get('/tracks', { q: inputString, license: '' }, function(response) {
			
			// Wird in Such Array eingefügt
			that.add(response, "soundcloud");
			
			count++;
			if (count == 2)
			{
				that.showData();
			}
		});
		
		$.ajax({
			url : 'https://gdata.youtube.com/feeds/api/videos?q=' + inputString + '&v=2&alt=jsonc', 
			dataType: 'jsonp', 
			success: function(response) {
				that.add(response.data, "youtube");
				
				count++;
				if (count == 2)
				{
					that.showData();
				}
			}
		});
	}
	this.showData = function ()
	{
		console.log("drin");
		var string = "";
		string += "<h3>Suchergebnisse</h3>";
		for(var i = 0; i < tracks.length; i++)
			string += "<a href='javascript:addTrack(" + i + ");'>"+tracks[i].title+"</a><br/>";
	
		$("#search-container").html(string);
	}
	
	this.getSearchPart = function(id)
	{
		return tracks[id];
	}
	
	this.add = function(response, platform)
	{
		console.log("add");
		console.log(response);
		var jetzt = new Date();
		if(platform == "soundcloud")
		{
			for(var i = 0; i< response.length; i++)
			{
				var test = tracks.length;
				tracks[test] = new Object();
				tracks[test]["url"] = response[i].permalink_url;
				tracks[test]["timeAddedToPlaylist"] = jetzt.getTime();
				tracks[test]["timePostedOnUrl"] = response[i].created_at;
				tracks[test]["fromHostname"] = $.url(response[i].permalink_url).attr('host');
				tracks[test]["title"] = response[i].title;
				tracks[test]["plays"] = response[i].playback_count;
				tracks[test]["likes"] = response[i].favoritings_count;
				tracks[test]["streamable"] = response[i].streamable;
				tracks[test]["id"] = response[i].id;
				
			}
		}
		else if(platform == "youtube")
		{
			for(var i = 0; i< response.items.length; i++)
			{
				if(response.items[i].accessControl.autoPlay == "allowed" && response.items[i].accessControl.embed == "allowed")
				{
					var test = tracks.length;
					tracks[test] = new Object();
					tracks[test]["url"] = response.items[i].player.default;
					tracks[test]["timeAddedToPlaylist"] = jetzt.getTime();
					tracks[test]["id"] = response.items[i].id;
					tracks[test]["timePostedOnUrl"] = response.items[i].created_at;
					tracks[test]["fromHostname"] = $.url(response.items[i].player.default).attr('host');
					tracks[test]["title"] = response.items[i].title;
					tracks[test]["rating"] = response.items[i].rating;
					// INT
					tracks[test]["plays"] = response.items[i].viewCount;
					// String
					tracks[test]["likes"] = response.items[i].likeCount;
					tracks[test]["streamable"] = response.items[i].streamable;
				}
			}
		}
	}
}