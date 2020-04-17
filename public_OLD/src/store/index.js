import Vue from 'vue';
import Vuex from 'vuex';
import RegisteredSketches from '@/js/services/SketchRegistration';
import AudioPlayerService from '@/js/services/AudioPlayerService';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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

    masterMenuOpen: true,
    layerMenuOpen: false,
    catalogueOpen: false,
    audioPlayerOpen: false,

    presetSlotsDisabled: true,
    loginDisabled: true,
  },
  mutations: {
    updateSketchIndexSelected(state, payload) {
      state.sketchIndexSelected = payload;
    },

    updateLayerMenuOpen(state, payload) {
      state.layerMenuOpen = payload;
    },

    updateMasterMenuOpen(state, payload) {
      state.masterMenuOpen = payload;
    },

    updateCatalogueOpen(state, payload) {
      state.catalogueOpen = payload;
    },

    updateAudioPlayerOpen(state, payload) {
      state.audioPlayerOpen = payload;
    },

    updateUserLoggedIn(state, payload) {
      state.userLoggedIn = payload;
    },

    updateUser(state, payload) {
      state.user = payload;
    },

    updateIsPlaying(state, payload) {
      state.audio.isPlaying = payload;
    },

    updateCurrentSound(state, payload) {
      state.audio.currentSound = payload;
    },

    updateSoundDuration(state, payload) {
      state.audio.duration = payload;
    },

    updateCurrentTrackIndex(state, payload) {
      state.audio.currentTrackIndex = payload;
    },

    updateAudioIsLoading(state, payload) {
      state.audio.currentTrackTime = '--:--';
      state.audio.audioIsLoading = payload;
    },

    updateTracks(state, payload) {
      state.audio.tracks = payload;
    },

    updateCurrentTrackTime(state, payload) {
      state.audio.currentTrackTime = payload;
    },
    updateSongProgress(state, payload) {
      state.audio.songProgress = payload;
    },
  },
  actions: {},
  modules: {},
});
