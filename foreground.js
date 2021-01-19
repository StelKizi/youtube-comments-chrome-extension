const queryParams = new URLSearchParams(location.search);

chrome.runtime.sendMessage({
	message: 'get_me_the_comments',
	videoId: queryParams.get('v'),
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === 'here_are_your_comments') {
		console.log(request.comments);
	}
});
