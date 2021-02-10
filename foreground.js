const queryParams = new URLSearchParams(location.search);
let comments = [];
let queuedComments = [];
let currentVideoTime = 0.0;
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

const displayComment = (author, comment) => {
  let youtubeVideo = document
    .querySelector('.video-stream')
    .getBoundingClientRect();
  let commentToShow = document.createElement('div');

  commentToShow.classList.add('popup');

  /* Motion variables */
  const center = {
    x: youtubeVideo.left + youtubeVideo.width / 5,
    y: youtubeVideo.top + youtubeVideo.height,
  };

  let newX = 0.0;
  let newY = 0.0;
  let motionSway = 0.01;
  let naturalSway = 0.1;
  let animatedValue = 0.0;

  commentToShow.style.left = `${center.x}px`;
  commentToShow.style.top = `${center.y}px`;
  commentToShow.innerText = `${author}: ${comment}`;
  document.querySelector('body').append(commentToShow);

  /* Opacity variables */
  let alteredOpacity = 0.0;
  let opacitySpeed = 0.007;

  const animate = () => {
    newY = center.y - animatedValue;
    newX = center.x + 60.0 * Math.sin(motionSway * animatedValue) + naturalSway;

    commentToShow.style.top = `${newY}px`;
    commentToShow.style.left = `${newX}px`;

    alteredOpacity = Math.sin(opacitySpeed * animatedValue);

    commentToShow.style.opacity = alteredOpacity;

    animatedValue = animatedValue + 1;

    if (commentToShow.style.opacity < 1) {
      return;
    } else {
      requestAnimationFrame(animate);
    }
  };
  animate();
};

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
          displayComment(queuedItem.author, queuedItem.comment);
          queuedComments.splice(queuedComments.indexOf(queuedItem), 1);
        }
      });
    }, 100);
  }
});
