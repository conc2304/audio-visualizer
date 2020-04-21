import RegisteredSketches from "@/js/services/SketchRegistration";

import store from "@/store";
// import APS.p5 from "p5"; // use this one for instantiation of fft, amplitude ...
// import "p5/lib/addons/p5.sound";

const AudioPlayerService = {
  audioIsUploading: false,
  autoPlay: false,
  uploadedAudio: null,
  peakDetect: null,
  peakCount: 0,
  fft: null,
  songProgress: 0,
  currentSound: {},
  p5: null, // use this one for the rest of p5, not sure why this is the case but it works
  audioCtrl: {},
  elementPropToFQMap: {},
};

AudioPlayerService.frequencies = [
  {
    label: "Low",
    rangesData: [1, 140],
    ranges: "1 - 140 Hz",
  },
  {
    label: "Mid - Low",
    rangesData: [140, 400],
    ranges: "140 - 400 Hz",
  },
  {
    label: "Mid",
    rangesData: [400, 2600],
    ranges: "400 - 2600 Hz",
  },
  {
    label: "Mid - High",
    rangesData: [2600, 5200],
    ranges: "2600 - 5200 Hz",
  },
  {
    label: "High",
    rangesData: [5200, 14000],
    ranges: "5200 - 14K Hz",
  },
];

/**
 *
 */
AudioPlayerService.audioUploaded = (files) => {
  const APS = AudioPlayerService;
  // APS.p5 = p5;

  const tracks = store.state.audio.tracks || [];
  let file;
  if (files.path) {
    tracks.push(files);
    file = files;
  } else {
    for (let file of files) {
      tracks.push(file);
    }
    file = files[0];
  }

  store.commit("updateTracks", tracks);

  APS.currentSound = file;
  APS.setupAudioAnalysis(file, false);
};

/**
 *
 */
AudioPlayerService.setupAudioAnalysis = (audioFile, changeSong) => {
  const APS = AudioPlayerService;
  APS.currentSound = audioFile;

  console.log("setupAudioAnalysis");

  // only play the newly loaded song if one is not already playing
  if (
    changeSong ||
    !APS.audio ||
    !APS.audio.isPlaying() ||
    APS.audio.isPaused()
  ) {
    if (APS.audio) {
      APS.audio.stop();
      APS.audio.disconnect();
    }

    if (audioFile.path) {
      audioFile = audioFile.path;
    }

    store.commit("updateAudioIsLoading", true);
    
    console.log(APS.p5);

    APS.audio = APS.p5.loadSound(
      audioFile,
      audioLoadSuccess,
      audioLoadError,
      whileLoading
    );

    APS.fft = new APS.p5.FFT();
    APS.fft.setInput(APS.audio);
    APS.amplitude = new APS.p5.Amplitude();
    APS.amplitude.setInput(APS.audio);
    APS.peakDetect = new APS.p5.PeakDetect(1500, 14000, 0.55);
  }
};

/**
 *
 */
AudioPlayerService.toggleAudioState = () => {
  const APS = AudioPlayerService;

  if (!APS.audio) return;

  if (!APS.audio.isPlaying() && !APS.audio.isPaused()) {
    APS.setupAudioAnalysis(store.state.audio.currentSound, true, APS.p5);
  } else if (APS.audio.isPaused()) {
    APS.audio.play();
  } else {
    APS.audio.pause();
  }

  store.commit("updateIsPlaying", APS.audio.isPlaying());
};

/**
 *
 */
AudioPlayerService.analyzeFFT = (fft) => {

  if (!fft || !AudioPlayerService.frequencies) {
    return;
  }

  const fftAnalysis = [];
  fft.analyze();

  for (let index in AudioPlayerService.frequencies) {
    const rangeData = AudioPlayerService.frequencies[index].rangesData;
    fftAnalysis[index] = fft.getEnergy(rangeData[0], rangeData[1]);
  }

  return fftAnalysis;
};

/**
 * Loop through all of the elements that have audio reactive set,
 * and apply the frequency to the element property.
 * We map the audio frequency value between the minimum and maximum for the property.
 * We then adjust the target value using the reset or target value based on responsiveness type
 * @param fftAnalysis - an array of amplitude readings for each frequency
 */
AudioPlayerService.applyAudioEnergyValues = (fftAnalysis) => {
  const APS = AudioPlayerService;

  if (!fftAnalysis || fftAnalysis.size < 1) {
    return false;
  }

  let controlObject;
  let audioValue;

  let ctrlHandlers = APS.elementPropToFQMap;
  for (let sketchIndex in ctrlHandlers) {
    if (!ctrlHandlers.hasOwnProperty(sketchIndex)) {
      continue;
    }

    controlObject = RegisteredSketches[sketchIndex];
    for (let ctrlProp in ctrlHandlers[sketchIndex]) {
      if (!ctrlHandlers[sketchIndex].hasOwnProperty(ctrlProp)) {
        continue;
      }

      const eqBand = ctrlHandlers[sketchIndex][ctrlProp];
      // the value in eq band will be somewhere between 0 and 255
      // we need to scale that between the upper and lower bounds of the element
      if (
        fftAnalysis[eqBand] === 0 ||
        !controlObject ||
        !controlObject[ctrlProp]
      ) {
        continue;
      } else {
        audioValue = APS.p5.map(
          fftAnalysis[eqBand],
          0,
          255,
          controlObject[ctrlProp].min,
          controlObject[ctrlProp].max
        );
      }

      audioValue =
        parseFloat(audioValue) *
        parseFloat(controlObject[ctrlProp].audio.gain) *
        0.6;

      let setValue;
      let overBy;
      switch (controlObject[ctrlProp].audio.responsiveType) {
        case "infinite":
          audioValue = APS.p5.map(
            energyValues[eqBand],
            0,
            255,
            0,
            controlObject[ctrlProp].max
          );
          audioValue = audioValue * 0.01;
          setValue = controlObject[ctrlProp].targetValue + audioValue;
          break;
        case "loop up":
          audioValue = APS.p5.map(
            energyValues[eqBand],
            0,
            255,
            0,
            controlObject[ctrlProp].max
          );

          audioValue = audioValue * 0.01;
          // increase it by how much it went over and then loop from top again
          if (
            controlObject[ctrlProp].targetValue + audioValue >
            controlObject[ctrlProp].max
          ) {
            overBy =
              controlObject[ctrlProp].targetValue +
              audioValue -
              controlObject[ctrlProp].max;
            setValue = controlObject[ctrlProp].min + overBy;
          } else {
            setValue = controlObject[ctrlProp].targetValue + audioValue;
          }
          break;
        case "loop down":
          audioValue = APS.p5.map(
            energyValues[eqBand],
            0,
            255,
            0,
            controlObject[ctrlProp].max
          );

          audioValue = audioValue * 0.01;
          // decrease it by how much it went under and then loop from top again
          if (
            controlObject[ctrlProp].targetValue - audioValue <
            controlObject[ctrlProp].min
          ) {
            overBy =
              controlObject[ctrlProp].targetValue -
              audioValue +
              controlObject[ctrlProp].min;
            setValue = controlObject[ctrlProp].max - overBy;
          } else {
            setValue = controlObject[ctrlProp].targetValue - audioValue;
          }
          break;
        case "subtract":
          setValue =
            controlObject[ctrlProp].resetValue - Number(audioValue.toFixed(3));
          break;
        case "add":
        default:
          setValue =
            controlObject[ctrlProp].resetValue + Number(audioValue.toFixed(3));
          break;
      }

      controlObject[ctrlProp].targetValue = setValue;
    }
  }
};

/**
 *
 */
AudioPlayerService.setPropertyGain = (
  gainValue,
  parameterName,
  sketchIndexSelected
) => {
  RegisteredSketches[sketchIndexSelected][parameterName].audio.gain = gainValue;
};

/**
 *
 */
AudioPlayerService.setAudioReactiveFreq = (
  frequencyRange,
  parameter,
  sketchIndexSelected
) => {
  const APS = AudioPlayerService;
  const ctrlObjectName = sketchIndexSelected;
  const freqIndex = APS.frequencies.indexOf(frequencyRange);
  const freqLabel = frequencyRange ? frequencyRange.label : false;

  if (freqLabel && ctrlObjectName !== null && parameter && frequencyRange) {
    APS.audioCtrl[freqLabel] = APS.audioCtrl[freqLabel] || {};
    APS.audioCtrl[freqLabel][ctrlObjectName] =
      APS.audioCtrl[freqLabel][ctrlObjectName] || {};
    APS.audioCtrl[freqLabel][ctrlObjectName][parameter] = frequencyRange;

    APS.elementPropToFQMap[ctrlObjectName] =
      APS.elementPropToFQMap[ctrlObjectName] || {};
    APS.elementPropToFQMap[ctrlObjectName][parameter] = freqIndex;
  } else {
    if (
      APS.elementPropToFQMap[ctrlObjectName] &&
      APS.elementPropToFQMap[ctrlObjectName][parameter]
    ) {
      const freqToClean =
        APS.frequencies[APS.elementPropToFQMap[ctrlObjectName][parameter]]
          .label;

      delete APS.audioCtrl[freqToClean][ctrlObjectName][parameter];
      if (Object.size(APS.audioCtrl[freqToClean][ctrlObjectName]) === 0) {
        delete APS.audioCtrl[freqToClean][ctrlObjectName];
      }

      if (Object.size(APS.audioCtrl[freqToClean]) === 0) {
        delete APS.audioCtrl[freqToClean];
      }
      delete APS.elementPropToFQMap[ctrlObjectName][parameter];
    }

    if (Object.size(APS.elementPropToFQMap[ctrlObjectName]) === 0) {
      delete APS.elementPropToFQMap[ctrlObjectName];
    }
  }
};

/**
 *
 */
const audioLoadSuccess = () => {
  const APS = AudioPlayerService;
  console.log("audioLoded");

  // only play the newly loaded song if one is not already playing
  if (!APS.audio.isPlaying() || APS.audio.isPaused()) {
    APS.audio.stop();
    const index = store.state.audio.tracks.indexOf(APS.currentSound);

    store.commit("updateCurrentSound", APS.currentSound);
    store.commit("updateCurrentTrackIndex", index);
    store.commit("updateSoundDuration", APS.audio.duration());
    store.commit("updateIsPlaying", APS.audio.isPlaying());

    APS.audio.playMode("restart");
    APS.audio.play();
  }

  store.commit("updateIsPlaying", APS.audio.isPlaying());
  store.commit("updateAudioIsLoading", false);
  APS.audio.onended(endSong);
};

const audioLoadError = (error) => {
  store.commit("updateAudioIsLoading", false);
};

/**
 *
 * @param {Number} percent
 */
const whileLoading = (percent) => {
  // not firing currently  - not sure why??
  AudioPlayerService.loadingPercent = (percent * 100 + 1).toFixed() + "%";
};

/**
 *
 */
const endSong = () => {
  const APS = AudioPlayerService;
  const currentTime = APS.audio
    .currentTime()
    .toString()
    .split(".")[0];
  const duration = APS.audio
    .duration()
    .toString()
    .split(".")[0];

  const songEnded = currentTime === duration;

  const current = store.state.audio.currentTrackIndex;
  const tracks = store.state.audio.tracks;
  let next = current;

  // only go to next song if we are just finishing a song that was playing
  if (
    APS.audio.isPlaying() &&
    !APS.audio.isPaused() &&
    (APS.audio.currentTime() === "0" || songEnded)
  ) {
    next =
      current !== tracks.length - 1
        ? Math.min(current + 1, tracks.length - 1)
        : 0;
    store.state.audio.songProgress = APS.audio.currentTime();
    APS.setupAudioAnalysis(tracks[next], true, APS.p5);
  }
};

Object.size = (obj) => {
  let size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  return size;
};

AudioPlayerService.applyAudioFFT = () => {};
export default AudioPlayerService;
