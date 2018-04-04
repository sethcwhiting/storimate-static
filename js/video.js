// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '100%',
		width: '100%',
		videoId: 'BBgghnQF6E4',
    playerVars: { 'start': 15, 'showinfo': 0, 'controls': 0, 'playsinline': 1, 'rel': 0 },
		events: { 'onReady': onPlayerReady }
	});
}

function onPlayerReady() {
	player.playVideo();
	setTimeout(freeze, 500);
	safeStart();
}

function freeze() {
	player.pauseVideo();
}
