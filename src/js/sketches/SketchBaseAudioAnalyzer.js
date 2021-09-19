import APS from '@/js/services/AudioPlayerService';
import { formatTime } from '@/js/services/Utils';
import store from '@/store';
import {
  UPDATE_CURRENT_TRACK_TIME,
  UPDATE_SONG_PROGRESS,
} from '../../store/mutationTypes';

const AudioAnalyzer = p5 => {
  p5.setup = () => {};

  p5.draw = () => {
    if (APS.audio && APS.audio.isLoaded() && !APS.audio.isPaused()) {
      if (p5.frameCount % 40 === 0) {
        const songTime = formatTime(
          APS.audio.duration() - APS.audio.currentTime(),
        );
        const songProgress =
          100 * (APS.audio.currentTime() / APS.audio.duration());

        store.commit(UPDATE_CURRENT_TRACK_TIME, songTime);
        store.commit(UPDATE_SONG_PROGRESS, songProgress);
      }

      const fftAnalysis = APS.analyzeFFT(APS.fft);
      APS.applyAudioEnergyValues(fftAnalysis);
    }
  };
};

export default AudioAnalyzer;
