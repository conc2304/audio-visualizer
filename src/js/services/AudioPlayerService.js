import RegisteredSketches from '@/js/services/SketchRegistration';

import p5 from "p5";
import "p5/lib/addons/p5.sound";


const AudioPlayerService = {
  audioIsUploading: false,
  isPlaying: false,
  autoPlay: false,
  uploadedAudio: null,
  peakDetect: null,
  peakCount: 0,
  fft: null,
  currentSound: {},
  tracks: [],
  currentTrackIndex: 0,
  songProgress: 0,
};

AudioPlayerService.audioUploaded = (files, p5) => {
  let APS = AudioPlayerService;

  for (let file of files) {
    APS.tracks.push(file)
  }

  APS.currentSound = files[0];
  APS.audioIsUploading = true;
  APS.setupAudioAnalysis(files[0], p5);

  return APS;
};

AudioPlayerService.setupAudioAnalysis = (audioFile, P5) => {
  let APS = AudioPlayerService;

  APS.audio = P5.loadSound(audioFile, audioLoadSuccess, audioLoadError, whileLoading);
  APS.currentSound = audioFile;

  APS.fft = new p5.FFT();
  APS.fft.setInput(APS.audio);
  APS.amplitude = new p5.Amplitude();
  APS.amplitude.setInput(APS.audio);
  APS.peakDetect = new p5.PeakDetect(1500, 14000, 0.55);
};

const audioLoadSuccess = () => {
  let APS = AudioPlayerService;

  console.log('Sound is loaded : ' + APS.audio.isLoaded());
  APS.audio.playMode('restart');
  APS.audio.play();
  APS.isPlaying = APS.audio.isPlaying();
  APS.currentTrackIndex = APS.tracks.indexOf(APS.currentSound);
  APS.audio.onended(endSong);
};

const audioLoadError = error => {
  console.log(error);
};

function whileLoading(percent) {
  console.log('test');
  console.log(percent);
  AudioPlayerService.loadingPercent = (percent * 100 + 1).toFixed() + '%';
};

AudioPlayerService.frequencies = [
  {
    label: 'Low',
    rangesData: [[1, 140]],
    ranges: '1 - 140 Hz',
  },
  {
    label: 'Mid - Low',
    rangesData: [[140, 400]],
    ranges: '140 - 400 Hz',
  },
  {
    label: 'Mid',
    rangesData: [[400, 2600]],
    ranges: '400 - 2600 Hz',
  },
  {
    label: 'Mid - High',
    rangesData: [[2600, 5200]],
    ranges: '2600 - 5200 Hz',
  },
  {
    label: 'High',
    rangesData: [[5200, 14000]],
    ranges: '5200 - 14000 Hz',
  },
];

const endSong = () => {
  let APS = AudioPlayerService;

  if (!APS.audio.isPaused() && (APS.audio.currentTime() === '0' || APS.audio.currentTime().toString().split(".")[0] === APS.audio.duration().toString().split(".")[0])) {
    if (APS.currentTrackIndex === (APS.tracks.length - 1)) {
      APS.currentTrackIndex = 0;
    } else {
      APS.currentTrackIndex = Math.min(APS.currentTrackIndex + 1, APS.tracks.length - 1);
    }

    APS.songProgress.val(APS.audio.currentTime());
    // setupAudioAnalysis();
    // setSong();
    APS.audio.play();
  }
}

AudioPlayerService.toggleAudioState = () => {
  let APS = AudioPlayerService;

  if (!APS.audio) return;

  if (!APS.audio.isPlaying() && !APS.audio.isPaused()) {
    APS.setupAudioAnalysis(APS.currentSound, p5i);
    // setSong();
  } else if (APS.audio.isPaused()) {
    APS.audio.play();
  } else {
    APS.audio.pause();
  }

  APS.isPlaying = APS.audio.isPlaying();
  return APS.isPlaying;
}

export default AudioPlayerService;
