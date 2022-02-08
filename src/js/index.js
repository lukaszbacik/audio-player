import "../sass/styles";

const audio = new Audio();
let playing = false;
let currentIndexTrack = 0;
const playlist = [
  {
    name: "Armin van Buuren & Timmy Trumpet - Anita",
    cover: "https://www.lukaszbacik.pl/images/audio-player/01.jpg",
    url: "https://www.lukaszbacik.pl/images/audio-player/music/01.mp3",
  },
  {
    name: "Tiësto & Karol G - Don't Be Shy",
    cover: "https://www.lukaszbacik.pl/images/audio-player/02.jpg",
    url: "https://www.lukaszbacik.pl/images/audio-player/music/02.mp3",
  },
  {
    name: "Sorana & David Guetta - redruM",
    cover: "https://www.lukaszbacik.pl/images/audio-player/03.jpg",
    url: "https://www.lukaszbacik.pl/images/audio-player/music/03.mp3",
  },
];
ready(() => {
  setTrack(currentIndexTrack);
  selectPositionTrack();

  document.querySelector(`#play`).addEventListener(`click`, (event) => {
    event.preventDefault();

    if (playing) {
      audio.pause();
      document.querySelector(`#controlPlay`).style.display = "block";
      document.querySelector(`#controlPause`).style.display = "none";
    } else {
      audio.play();
      document.querySelector(`#controlPlay`).style.display = "none";
      document.querySelector(`#controlPause`).style.display = "block";
    }
    playing = !playing;
  });

  document.querySelector(`#next`).addEventListener(`click`, (event) => {
    event.preventDefault();
    currentIndexTrack++;
    if (currentIndexTrack >= playlist.length) {
      currentIndexTrack = 0;
    }
    setTrack(currentIndexTrack);
    audio.play();
    playing = !playing;
    document.querySelector(`#controlPlay`).style.display = "none";
    document.querySelector(`#controlPause`).style.display = "block";
  });
  document.querySelector(`#prev`).addEventListener(`click`, (event) => {
    event.preventDefault();
    currentIndexTrack < 1 ? 0 : currentIndexTrack--;
    if (currentIndexTrack === 0) {
      currentIndexTrack = playlist.length - 1;
    }
    setTrack(currentIndexTrack);
    audio.play();
    playing = !playing;
    document.querySelector(`#controlPlay`).style.display = "none";
    document.querySelector(`#controlPause`).style.display = "block";
  });

  audio.addEventListener(`timeupdate`, (event) => {
    let position = (audio.currentTime / audio.duration) * 100;

    document.querySelector(`input[type="range"]`).value = Math.floor(position);
    document.querySelector(`input[type="range"]`).style.backgroundSize = position + "% 100%";

    document.querySelector(`#timeCurrent`).innerText = parseTime(audio.currentTime);
    document.querySelector(`#timeDuration`).innerText = parseTime(audio.duration);
  });
});

function setTrack(id) {
  audio.src = playlist[id].url;
  document.querySelector(`input[type="range"]`).value = 0;
  document.querySelector(`#cover`).src = playlist[id].cover;
  document.querySelector(`#trackName`).innerText = playlist[id].name.split(" - ")[1];
  document.querySelector(`#trackArtist`).innerText = playlist[id].name.split(" - ")[0];
}

function selectPositionTrack() {
  document.querySelector('input[type="range"]').addEventListener("input", (event) => {
    let value = parseInt(event.target.value),
      min = event.target.min,
      max = event.target.max;

    let position = ((value - min) * 100) / (max - min);
    event.target.style.backgroundSize = position + "% 100%";

    audio.currentTime = (audio.duration / 100) * position;
  });
}

function parseTime(data) {
  if (isNaN(data)) return `00:00`;
  let minutes = Math.floor(data / 60);
  let seconds = Math.floor(data - minutes * 60);
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return `${minutes}:${seconds}`;
}

function ready(callback) {
  if (document.readyState === "complete") {
    window.setTimeout(callback, 0);
  } else {
    window.addEventListener("load", callback);
  }
}
