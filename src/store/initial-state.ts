import RegisteredSketches from '@/js/services/SketchRegistration';

const initialState = {
  RegisteredSketches,
  user: {},
  sketchIndexSelected: -1,
  audio: {
    isPlaying: false,
    currentSound: {},
    duration: 0,
    currentTrackIndex: -1,
    tracks: [],
    audioIsLoading: false,
    currentTrackTime: '--:--',
    songProgress: 0,
  },
  userLoggedIn: false,

  masterMenuOpen: true,
  layerMenuOpen: false,
  catalogueOpen: false,
  audioPlayerOpen: false,

  presetSlotsDisabled: true,
  loginDisabled: true,
};

export default initialState;
