//Variable
let urlList = [];
let tracks = [];
let currentIndex = 0;
let buttonPlay = $('#play');
let playlistWrapper = $('#playlist-wrapper');
let playlistContainer = $("#playlist-song-container");
let songName = $('#song-name');
let songTime = $('#song-time');
let loadingBar = $('#loadingBar');
let progressBar = $('#progressBar');
let fft;

let CLIENT_ID = 'NmW1FlPaiL94ueEu7oziOWjYEzZzQDcK';

// let PLAYLIST_URL = 'https://soundcloud.com/clyzby/sets/safe-bass';
// let PLAYLIST_URL = 'https://soundcloud.com/clyzby/sets/depth';

let PLAYLIST_URL = 'https://soundcloud.com/hollyherndon/sets/movement-53';


$(() => {
  
  $('#play').click(() => {
    playCurrentSound();
  });

  $('#next').click(() => {
    changeSong('next', null);
  });

  $('#prev').click(() => {
    changeSong('prev', null);
  });

  $('#playlist-wrapper').click((e) => {
    let listItem = e.target;
    changeSong('select', listItem);
  });

  $('#progressBar').click((progbar) => {
    let percent = (progbar.offsetX / progbar.target.offsetWidth);
    audio.jump(audio.duration() * percent);
    audio.onended(endSong);
  });

  $('#minimize-playlist').click(() => {
    playlistWrapper.toggleClass('minimized');
    $('#ctrlObject-control-panel').toggleClass('audio-player-open');

    if (playlistWrapper.hasClass('minimized')) {
      $('#minimize-playlist').html('keyboard_arrow_up');
    } else {
      $('#minimize-playlist').html('keyboard_arrow_down');
    }
  });

  $("form#soundcloud-link-form").submit((e) => {

    let url = $("#soundcloud-link-resolver").val();
    let response = resolveSoundCloudLink(url);
    e.preventDefault;
    return false;
  });

  resolveSoundCloudLink(PLAYLIST_URL);
});


let scGetTracksByUser = (uid, limit) => {
  return SC.get(
    "/tracks",
    {
      user_id: uid,
      limit: limit
    },
    function(response) {
      console.log(response);
      return response;
    }
  );

};


async function resolveSoundCloudLink(url) {

  if (!url) {
    url = $("#soundcloud-link-resolver").val();
  }

  SC.initialize({
    client_id: CLIENT_ID
  });

  let scResponse = await SC.resolve(url)
    .then(function (response) {
      console.log(response);

      return response;
    })
    .catch(function (error) {
      console.log(error);
      // alert('Unable to resolve soundcloud url: ' + error);
    });


    tracks = [];

    if (scResponse.kind === 'track') {
      tracks.push(scResponse);
    }
    else if (scResponse.kind === "playlist") {
      tracks = scResponse.tracks;
    }
    else if (scResponse.kind === "user") {
      let uid = Number(scResponse.uri.split("/").pop());
      tracks = await scGetTracksByUser(uid, 50);
      scResponse.tracks = tracks;
    }
    else if (scResponse[0] && scResponse[0].kind && scResponse[0].kind === "track") {
      tracks = scResponse;
      scResponse = {
        kind : 'playlist',
        tracks : scResponse,
        title : url,
      };
    }

    if (tracks.length) {
      playlistContainer.append(createPlaylist(scResponse));
    }

    $("#soundcloud-link-resolver").val('');
};


//loadSound callbacks
function success() {
  console.log('Sound is loaded : ' + audio.isLoaded());
  audio.playMode('restart');
  audio.play();
  audio.onended(endSong);
}

function error(fail) {
  console.log(fail);
}

function progress(percent) {
  loadingBar.val((percent * 100) + 1);
  console.log((percent * 100) + 1);

  songName.html(`<a href="${tracks[currentIndex].permalink_url}" title="Link to song on SoundCloud" target="_blank">${tracks[currentIndex].title}`);
  songTime.html(((percent * 100) + 1).toFixed() + '%');
}

//
function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function setup(loadsong) {
  audio = myp5.loadSound(loadsong, success, error, progress);
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  peakDetect = new p5.PeakDetect(1500, 14000, .55);
  fft.setInput(audio);
  amplitude.setInput(audio);
}


//  Audio Controls
function playCurrentSound() {
  if (!audio.isPlaying() && !audio.isPaused()) {
    buttonPlay.html("pause");
    setup(urlList[currentIndex]);
    setSong();
  } else if (audio.isPaused()) {
    buttonPlay.html("pause");
    audio.play();
  } else {
    audio.pause();
    buttonPlay.html("play_arrow");
  }
}


function changeSong(btn, listItem) {
  if (audio.isPaused()) {
    audio.play();
  }
  audio.stop();
  audio.onended(pauseEndSong);
  if (btn === 'next') {
    currentIndex = Math.min(currentIndex + 1, urlList.length - 1);
    playCurrentSound();
  }
  if (btn === 'prev') {
    currentIndex = Math.max(currentIndex - 1, 0);
    playCurrentSound();
  }
  if (btn === 'select' && listItem) {
    for (let i = 0; i < urlList.length; i++) {
      if (tracks[i].title === listItem.innerHTML) {
        currentIndex = i;
        playCurrentSound();
      }
    }
  }
  setSong();
}


//Playlist
function createPlaylist(responseData) {

  playlistContainer.html('');


  let playlist = [];
  if (responseData.kind === 'track') {
    playlist.push(responseData);
    $('#playlist-title').hide();
  }

  if (responseData.kind === "user") {
    responseData.title = responseData.username;
  }

  if (responseData.kind === "playlist" || responseData.kind === "user") {
    playlist = responseData.tracks;
    console.log(responseData.title)
    $('#playlist-title').show();
    $('#playlist-title').html(responseData.title);
  }


  urlList = [];
  for (let i = 0; i < playlist.length; i++) {
    urlList.push(playlist[i].stream_url + '?client_id=' + CLIENT_ID);
  }

  if (playlistWrapper.hasClass('minimized')) {
    $("#minimize-playlist").click();
  }

  let list = document.createElement('ul');
  let ntgr = "odd";

  for (let i = 0; i < playlist.length; i++) {
    let songItem = document.createElement('li');
    if (ntgr === "odd") {
      songItem.classList.add('even');
      ntgr = "even";
    } else {
      songItem.classList.add('odd');
      ntgr = "odd";
    }
    if (i === 0) {
      songItem.classList.add('active');
    }
    
    let songUserHtml = `<p class="playlist-username"><a href="${playlist[i].user.permalink_url}" target="_blank">${playlist[i].user.username}</a></p>`;
    let songTitleHtml = `<p class="playlist-song-title">${playlist[i].title}</p>`;

    songItem.innerHTML = songUserHtml + songTitleHtml;
    list.appendChild(songItem);
  }

  return list;
}


function setSong() {
  playlistContainer.find("li").removeClass('active');
  for (let i = 0; i < urlList.length; i++) {
    if (tracks[i] === tracks[currentIndex]) {
      $(playlistContainer.find("li")[i]).addClass('active');
    }
  }
}


//endSong
function endSong() {

  if (!audio.isPaused() && (audio.currentTime() === '0' || audio.currentTime().toString().split(".")[0] === audio.duration().toString().split(".")[0])) {
    if (currentIndex === (urlList.length - 1)) {
      currentIndex = '0';
    } else {
      currentIndex = Math.min(currentIndex + 1, urlList.length - 1);
    }
    progressBar.val(audio.currentTime());
    setup(urlList[currentIndex]);
    setSong();
    audio.play();
  }
}

function pauseEndSong() {
  console.log('set pauseEndSong');
}
