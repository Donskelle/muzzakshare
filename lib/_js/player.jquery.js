/* Konstruktor Youtube Player */

var youtubePlayer;
function onYouTubeIframeAPIReady() {
	youtubePlayer = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: "eXVF-fXf-Q4",
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': onError
		}
	});
}
/* DEFAULT PLAYER EVENTS */
function onPlayerStateChange(event) {
	console.log("Event onPlayerStateChange gefeuert:");
	console.log(event);
	if (event.data == YT.PlayerState.PLAYING) {
		
		//playlist.updateCurrent();
	}
}
function onPlayerReady(event) {
	playlist.addLink("https://www.youtube.com/watch?v=eXVF-fXf-Q4&feature=youtube_gdata_player");
	console.log("Event onPlayerReady gefeuert:");
	console.log(event);
	event.target.playVideo();
	
}
function onError (event) {
	console.log("Event onError gefeuert:");
	console.log(event);
}


/* PLAYER CLASS */
function PlayerClass() 
{
	var soundcloudPlayer;
	var currentTrack = new Object();
	var that = this;
	
	this.startVideo = function()
	{
		console.log("Start Video");
		console.log(currentTrack)
		if (currentTrack.fromHostname == "www.youtube.com")
		{
			$("#player").show();
			youtubePlayer.playVideo();
			soundcloudPlayer.stop();
		}
		else if (currentTrack.fromHostname == "soundcloud.com" || currentTrack.fromHostname == "www.soundcloud.com")
		{
			$("#player").hide();
			soundcloudPlayer.play();
			youtubePlayer.pauseVideo();
		}
		else {
			console.log("startVideo hostname falsch");
		}
	}
	
	this.setVolume = function(volume)
	{
		if (currentTrack.fromHostname == "www.youtube.com")
			youtubePlayer.setVolume(volume);
	}
	
	this.stopVideo = function(hostname)
	{
		$("#player").hide();
		youtubePlayer.stopVideo();
		soundcloudPlayer.stop();
	}
	
	this.trackEnd = function() {
		//playlist.nextTrack();
	}
	
	this.addPlayerSoundcloud = function(sound)
	{
		soundcloudPlayer = sound;
	}
	
	this.changeVideo = function(track) {
		stopVideo(currentTrack.fromHostname);
		currentTrack = track;
		
		console.log("change Video");
		if (typeof soundcloudPlayer != 'undefined')
				soundcloudPlayer.destruct();
		if (currentTrack.fromHostname == "www.youtube.com")
		{
			youtubePlayer.loadVideoById(currentTrack.id);
			startVideo();
		}
		else if (currentTrack.fromHostname == "soundcloud.com")
		{
			SC.stream("/tracks/"+currentTrack.id, function(sound)
			{
				soundcloudPlayer = sound;
				startVideo();
			});
		}
		
	}
}