import Vue from "vue";
import Vuex from "vuex";
import RegisteredSketches from "@/js/services/SketchRegistration";
import initialState from "./initial-state";
import * as actions from "./mutationTypes";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
      currentTrackTime: "--:--",
      songProgress: 0,
    },
    userLoggedIn: false,

    masterMenuOpen: true,
    layerMenuOpen: false,
    catalogueOpen: false,
    audioPlayerOpen: false,

    presetSlotsDisabled: true,
    loginDisabled: true,
  },
  mutations: {

    [ actions.UPDATE_REGISTERED_SKETCHES ](state, payload) {
      console.log('UPDATE_REGISTERED_SKETCHES');
      state.RegisteredSketches = payload;
    },

    [ actions.UPDATE_SKETCH_INDEX_SELECTED ](state, payload) {
      state.sketchIndexSelected = payload;
    },

    [ actions.UPDATE_LAYER_MENU_OPEN ](state, payload) {
      state.layerMenuOpen = payload;
    },

    [ actions.UPDATE_MASTER_MENU_OPEN ](state, payload) {
      state.masterMenuOpen = payload;
    },

    [ actions.UPDATE_CATALOGUE_OPEN ](state, payload) {
      state.catalogueOpen = payload;
    },

    [ actions.UPDATE_AUDIO_PLAYER_OPEN ](state, payload) {
      state.audioPlayerOpen = payload;
    },

    [ actions.UPDATE_USER_LOGGED_IN ](state, payload) {
      state.userLoggedIn = payload;
    },

    [ actions.UPDATE_USER ](state, payload) {
      state.user = payload;
    },

    [ actions.UPDATE_IS_PLAYING ](state, payload) {
      state.audio.isPlaying = payload;
    },

    [ actions.UPDATE_CURRENT_SOUND ](state, payload) {
      state.audio.currentSound = payload;
    },

    [ actions.UPDATE_SOUND_DURATION ](state, payload) {
      state.audio.duration = payload;
    },

    [ actions.UPDATE_CURRENT_TRACK_INDEX ](state, payload) {
      state.audio.currentTrackIndex = payload;
    },

    [ actions.UPDATE_AUDIO_IS_LOADING ](state, payload) {
      state.audio.currentTrackTime = "--:--";
      state.audio.audioIsLoading = payload;
    },

    [ actions.UPDATE_TRACKS ](state, payload) {
      state.audio.tracks = payload;
    },

    [ actions.UPDATE_CURRENT_TRACK_TIME ](state, payload) {
      state.audio.currentTrackTime = payload;
    },
    [ actions.UPDATE_SONG_PROGRESS ](state, payload) {
      state.audio.songProgress = payload;
    },
  },
  getters: {
    RegisteredSketches: state => {
      return state.RegisteredSketches;
    }
  },

  actions: {
  },
  modules: {
  },

});
