import RegisteredSketches from '@/js/services/SketchRegistration';
import AudioPlayerService from '@/js/services/AudioPlayerService';

const AudioAnalyzer = p5 => {
  p5.preload = () => {
    console.log('Loading Audio Analyzer');
  };
  // p5.setup = () => {};
  p5.draw = () => {
    // if (audio && audio.isLoaded() && !audio.isPaused()) {
    //   let seconds = Math.floor(audio.currentTime() % 60);
    //   let minutes = Math.floor(audio.currentTime() / 60);
    //   let time = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
    //   songTime.html(time);
    //   let downloadProgress = 100 * (audio.currentTime() / audio.duration())
    //   progressBar.val(downloadProgress);
    // }
    // fftAnalysis = getEQEnergy(fft);
    // applyAudioEnergyValues(fftAnalysis);

  };
};

export default AudioAnalyzer;
