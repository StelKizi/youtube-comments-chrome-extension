const  getComments = (videoId) => {


}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
	//https://www.youtube.com/watch?v=kDdUdvNQndo

	if (changeInfo === 'complete') {
		if (/https:\/\/www\.youtube\.com\/watch*/.test(tabInfo.url)) {
			chrome.tabs.injectCSS(tabId, { file: './styles.css' });
			chrome.tabs.executeScript(tabId, { file: './foreground.js' });
		}
	}
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
	if (request.message === 'get_me_the_comments') {
        getComments(request.videoId);
        https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&order=relevance&textFormat=plainText&videoId=kDdUdvNQndo&key=[YOUR_API_KEY] HTTP/1.1
	}
});
