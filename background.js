let options = {
  part: 'snippet',
  maxResults: '100',
  order: 'relevance',
  textFormat: 'plainText',
  key: 'AIzaSyAek4Cxx2kPS_D63IH6Bn5i0Hrs-6HGCU8',
};

const getComments = (videoId, tabId) => {
  let stringURL = 'https://youtube.googleapis.com/youtube/v3/commentThreads?';
  stringURL += `part=${options.part}&`;
  stringURL += `maxResults=${options.maxResults}&`;
  stringURL += `order=${options.order}&`;
  stringURL += `textFormat=${options.textFormat}&`;
  stringURL += `videoId=${videoId}&`;
  stringURL += `key=${options.key}`;

  fetch(stringURL)
    .then(res => res.json())
    .then(data => parseAndSort(data))
    .then(filteredAndSortedComments => {
      chrome.tabs.sendMessage(tabId, {
        message: 'here_are_your_comments',
        comments: filteredAndSortedComments,
      });
    })
    .catch(err => console.log(err));
  return true;
};

const parseAndSort = comments => {
  let filteredComments = comments.items.map(item => {
    return {
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      comment: item.snippet.topLevelComment.snippet.textDisplay,
    };
  });

  const timestamp = new RegExp('[0-9]{0,2}:[0-9]{1,2}');
  let filteredAndSortedComments = [];

  /* Check the comments for timestamps, and push those that have in the filteredAndSortedComments array */
  filteredComments.forEach(comment => {
    if (timestamp.test(comment.comment)) {
      filteredAndSortedComments.push({
        timestamp: comment.comment.match(timestamp)[0],
        author: comment.author,
        comment: comment.comment,
      });
    }
  });

  filteredAndSortedComments = filteredAndSortedComments.map(comment => {
    let tempArray = [];
    let minsToSecs = 0.0;
    tempArray = comment.timestamp.split(':');
    minsToSecs = parseFloat(tempArray[0] * 60) + parseFloat(tempArray[1]);

    return {
      timestamp: minsToSecs,
      author: comment.author,
      comment: comment.comment,
    };
  });

  console.log(filteredAndSortedComments);
};

/* const convertToSeconds = comments => {
  comments = comments
};
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  //https://www.youtube.com/watch?v=kDdUdvNQndo

  if (changeInfo.status === 'complete') {
    if (/^https:\/\/www\.youtube\.com\/watch*/.test(tabInfo.url)) {
      chrome.tabs.insertCSS(tabId, { file: './styles.css' });
      chrome.tabs.executeScript(tabId, { file: './foreground.js' });
    }
  }
});

/* "Backend" - "Frontend" communication */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'get_me_the_comments')
    getComments(request.videoId, sender.tab.id);
});
