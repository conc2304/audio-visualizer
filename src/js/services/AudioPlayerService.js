import RegisteredSketches from '@/js/services/SketchRegistration';

import store from '@/store/index.js';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

const AudioPlayerService = {
  audioIsUploading: false,
  autoPlay: false,
  uploadedAudio: null,
  peakDetect: null,
  peakCount: 0,
  fft: null,
  songProgress: 0,
  currentSound: {},
};

AudioPlayerService.audioUploaded = async (files, p5) => {
  let APS = AudioPlayerService;

  let tracks = store.state.audio.tracks || [];
  for (let file of files) {
    tracks.push(file);
  }

  store.commit('updateAudioIsLoading', true);
  store.commit('updateTracks', tracks);
  APS.currentSound = files[0];

  APS.setupAudioAnalysis(files[0], p5);
};

AudioPlayerService.setupAudioAnalysis = (audioFile, P5) => {
  let APS = AudioPlayerService;

  if (APS.audio) {
    console.log('disconnect');
    APS.audio.stop();
    APS.audio.disconnect();
  }

  console.log(audioFile);
  APS.audio = P5.loadSound(audioFile, audioLoadSuccess, audioLoadError, whileLoading);

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

  const tracks = store.state.audio.tracks || [];
  const currentSound = APS.currentSound || {};
  const index = tracks.indexOf(currentSound);

  store.commit('updateCurrentSound', APS.currentSound);
  store.commit('updateCurrentTrackIndex', index);
  store.commit('updateAudioIsLoading', false);
  store.commit('updateIsPlaying', APS.audio.isPlaying());
  store.commit('updateSoundDuration', APS.audio.duration());

  APS.audio.onended(endSong);
};

const audioLoadError = error => {
  store.commit('updateAudioIsLoading', false);

  console.log(error);
};

function whileLoading(percent) {
  console.log('test');
  console.log(percent);
  AudioPlayerService.loadingPercent = (percent * 100 + 1).toFixed() + '%';
}

AudioPlayerService.frequencies = [
  {
    label: 'Low',
    rangesData: [1, 140],
    ranges: '1 - 140 Hz',
  },
  {
    label: 'Mid - Low',
    rangesData: [140, 400],
    ranges: '140 - 400 Hz',
  },
  {
    label: 'Mid',
    rangesData: [400, 2600],
    ranges: '400 - 2600 Hz',
  },
  {
    label: 'Mid - High',
    rangesData: [2600, 5200],
    ranges: '2600 - 5200 Hz',
  },
  {
    label: 'High',
    rangesData: [5200, 14000],
    ranges: '5200 - 14K Hz',
  },
];

const endSong = () => {
  let APS = AudioPlayerService;

  if (
    !APS.audio.isPaused() &&
    (APS.audio.currentTime() === '0' ||
      APS.audio
        .currentTime()
        .toString()
        .split('.')[0] ===
        APS.audio
          .duration()
          .toString()
          .split('.')[0])
  ) {
    if (APS.currentTrackIndex === APS.tracks.length - 1) {
      APS.currentTrackIndex = 0;
    } else {
      APS.currentTrackIndex = Math.min(APS.currentTrackIndex + 1, APS.tracks.length - 1);
    }

    APS.songProgress.val(APS.audio.currentTime());
    // setupAudioAnalysis();
    // setSong();
    APS.audio.play();
  }
};

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

  store.commit('updateIsPlaying', APS.audio.isPlaying());
};

AudioPlayerService.analyzeFFT = fft => {
  if (!fft || !AudioPlayerService.frequencies) {
    return;
  }

  const fftAnalysis = [];
  fft.analyze();

  for (let frequencies of AudioPlayerService.frequencies) {
    const rangeData = frequencies.rangesData;
    fftAnalysis[frequencies.ranges] = fft.getEnergy(rangeData[0], rangeData[1]);
  }

  return fftAnalysis;
};


/**
 * Loop through all of the elements that have audio reactive set,
 * and apply the frequency to the element property.
 * We map the audio frequency value between the minimum and maximum for the property.
 * We then adjust the target value using the reset or target value based on responsiveness type
 * @param energyValues - an array of amplitude readings for each frequency
 * @returns {boolean}
 */
let applyAudioEnergyValues = energyValues => {
  'use strict';

  if (!energyValues || energyValues.size < 1) {
    return false;
  }

  for (let index in RegisteredSketches) {
    for (let prop in RegisteredSketches[index]) {
      if (
        !RegisteredSketches[index].hasOwnProperty(prop) ||
        !RegisteredSketches[index][prop].hasOwnProperty('defaultValue') ||
        !RegisteredSketches[index][prop].hasOwnProperty('currentValue')
      ) {
        continue;
      }

      if (RegisteredSketches[index][prop].lockOn === true && !globalReset) {
        continue;
      }

      RegisteredSketches[index][prop] = fn(RegisteredSketches[index][prop]);
    }
  }

  let controlObject;
  let audioValue;

  let ctrlHandlers = elementPropToFQMap;
  // console.log(ctrlHandlers);
  for (let controlElementName in ctrlHandlers) {
    if (!ctrlHandlers.hasOwnProperty(controlElementName)) {
      continue;
    }

    controlObject = p5[`get${controlElementName}`]();
    for (let ctrlProp in ctrlHandlers[controlElementName]) {
      if (!ctrlHandlers[controlElementName].hasOwnProperty(ctrlProp)) {
        continue;
      }

      let eqBand = ctrlHandlers[controlElementName][ctrlProp];
      // the value in eq band will be somewhere between 0 and 255
      // we need to scale that between the upper and lower bounds of the element
      if (energyValues[eqBand] === 0) {
        continue;
      } else {
        audioValue = p5.map(
          energyValues[eqBand],
          0,
          255,
          controlObject[ctrlProp].min,
          controlObject[ctrlProp].max,
        );
      }

      audioValue = audioValue * controlObject[ctrlProp].audio.gain;

      let setValue;
      let overBy;
      switch (controlObject[ctrlProp].audio.responsiveType) {
        case 'infinite':
          audioValue = p5.map(energyValues[eqBand], 0, 255, 0, controlObject[ctrlProp].max);
          audioValue = audioValue * 0.01;
          setValue = controlObject[ctrlProp].targetValue + audioValue;
          break;
        case 'loop up':
          audioValue = p5.map(energyValues[eqBand], 0, 255, 0, controlObject[ctrlProp].max);

          audioValue = audioValue * 0.01;
          // increase it by how much it went over and then loop from top again
          if (controlObject[ctrlProp].targetValue + audioValue > controlObject[ctrlProp].max) {
            overBy = controlObject[ctrlProp].targetValue + audioValue - controlObject[ctrlProp].max;
            setValue = controlObject[ctrlProp].min + overBy;
          } else {
            setValue = controlObject[ctrlProp].targetValue + audioValue;
          }
          break;
        case 'loop down':
          audioValue = p5.map(energyValues[eqBand], 0, 255, 0, controlObject[ctrlProp].max);

          audioValue = audioValue * 0.01;
          // decrease it by how much it went under and then loop from top again
          if (controlObject[ctrlProp].targetValue - audioValue < controlObject[ctrlProp].min) {
            overBy = controlObject[ctrlProp].targetValue - audioValue + controlObject[ctrlProp].min;
            setValue = controlObject[ctrlProp].max - overBy;
          } else {
            setValue = controlObject[ctrlProp].targetValue - audioValue;
          }
          break;
        case 'subtract':
          setValue = controlObject[ctrlProp].resetValue - Number(audioValue.toFixed(3));
          break;
        case 'add':
        default:
          setValue = controlObject[ctrlProp].resetValue + Number(audioValue.toFixed(3));
          break;
      }

      controlObject[ctrlProp].targetValue = setValue;
    }
  }
};
AudioPlayerService.applyAudioFFT = () => {};
export default AudioPlayerService;
