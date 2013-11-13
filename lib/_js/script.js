var playerClass;
var playlist;
var searchClass;


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
	
	SC.stream("/tracks/293", function(sound)
	{
		musicPlayer.addPlayerSoundcloud(sound);
	});
});

$("form").submit(function() {
	var string = $("#search").val();
	if(string == "")
		console.log("Keine Eingabe");
	else {
		if(ValidUrl(string))
			playlist.addLink(string);
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
	}
	else 
		console.log("not possible");
}
function lastTrack()
{
	if(playlist.lastTrackIsPossible())
		musicPlayer.changeVideo(playlist.lastTrack());
}
function changeTrack(id)
{
	musicPlayer.changeVideo( playlist.getTrack(id) );
	playlist.setCurrentTrack(id);
}
function addTrack(id)
{
	playlist.addTrack(searchClass.getSearchPart(id) );
}

