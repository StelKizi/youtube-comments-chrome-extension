const queryParams = new URLSearchParams(location.search);
let comments = [];
let queuedComments = [];
currentVideoTime = 0.0;
let interval = null;

chrome.runtime.sendMessage({
  message: 'get_me_the_comments',
  videoId: queryParams.get('v'),
});

document.addEventListener('keyup', e => {
  if (e.key === 'a') {
    clearInterval(interval);
  }
});

currentVideoTime = document.querySelector('.video-stream').currentTime;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'here_are_your_comments') {
    comments = request.comments;

    interval = setInterval(() => {
      currentVideoTime = Math.floor(
        document.querySelector('.video-stream').currentTime
      );

      comments.forEach(item => {
        if (currentVideoTime < item.timestamp) {
          if (!queuedComments.includes(item)) {
            queuedComments.push(item);
          }
        }
      });

      queuedComments.forEach(queuedItem => {
        if (currentVideoTime == queuedItem.timestamp) {
          console.log(queuedItem);
          queuedComments.splice(queuedComments.indexOf(queuedItem), 1);
        }
      });
    }, 100);
  }
});
