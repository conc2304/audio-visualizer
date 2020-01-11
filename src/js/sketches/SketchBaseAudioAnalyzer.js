import RegisteredSketches from '@/js/services/SketchRegistration';
import APS from '@/js/services/AudioPlayerService';
import Utils from '@/js/services/Utils';
import store from '@/store/index.js';

const AudioAnalyzer = p5 => {
  p5.setup = () => {

  };

  p5.draw = () => {
    if (APS.audio && APS.audio.isLoaded() && !APS.audio.isPaused()) {

      if (p5.frameCount % 40 === 0) {
        const songTime = Utils.formatTime(APS.audio.duration() - APS.audio.currentTime());
        const songProgress = 100 * (APS.audio.currentTime() / APS.audio.duration());

        store.commit('updateCurrentTrackTime', songTime);
        store.commit('updateSongProgress', songProgress);
      }

      const fftAnalysis = APS.analyzeFFT(APS.fft);
      APS.applyAudioEnergyValues(fftAnalysis);
    }
  };
};

export default AudioAnalyzer;
