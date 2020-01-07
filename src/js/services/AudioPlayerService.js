import RegisteredSketches from '@/js/services/SketchRegistration';


const AudioPlayerService = {
  audioIsUploading: false,
  autoPlay: false,
  uploadedAudio: null,
  peakDetect: null,
  peakCount: 0,
  fft: null,
  currentSound: {},
};

AudioPlayerService.audioUploaded = (file, p5) => {
  console.log('uploaded');
  console.log(file);
  let APS = AudioPlayerService;

  APS.audioIsUploading = true;
  APS.setupAudioAnalysis(file.data, p5);

  // let track = {
  //   title: file.name,
  //   permalink_url: '',
  // };
  // currentIndex = 0;
  // tracks.unshift(track);
};

AudioPlayerService.setupAudioAnalysis = (audioFile, p5) => {
  let APS = AudioPlayerService;
  console.log(p5);
  console.log(p5.loadSound);

  console.log('loading p5 Sound');
  APS.audio = p5.loadSound(audioFile, audioLoadSuccess, audioLoadError, audioProgress);
  console.log(APS.audio);

  APS.fft = new p5.FFT();
  APS.amplitude = new p5.Amplitude();
  APS.peakDetect = new p5.PeakDetect(1500, 14000, 0.55);
  APS.fft.setInput(APS.audio);
  APS.amplitude.setInput(APS.audio);
};

const audioLoadSuccess = () => {
  let APS = AudioPlayerService;

  console.log('Sound is loaded : ' + APS.audio.isLoaded());
  APS.audio.playMode('restart');
  APS.audio.play();
  APS.audio.onended(endSong);
};

const audioLoadError = error => {
  console.log(error);
};

const audioProgress = percent => {
  console.log('test');
  AudioPlayerService.loadingPercet = (percent * 100 + 1).toFixed() + '%';
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

export default AudioPlayerService;
