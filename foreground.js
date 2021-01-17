const queryParams = new URLSearchParams(location.search);

chrome.runtime.sendMessage({
	message: 'get_me_the_comments',
	videoId: queryParams.get('v'),
});
