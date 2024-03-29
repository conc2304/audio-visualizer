import Vue from "vue";
import Vuex from "vuex";
import RegisteredSketches from "@/js/services/SketchRegistration";
import initialState from "./initial-state";
import * as types from "./mutationTypes";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    RegisteredSketches,
    sketchInView: null,
    user: {},
    sketchIndexSelected: -1,
    auxInputVisible: false,
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

    [ types.UPDATE_REGISTERED_SKETCHES ](state, payload) {
      state.RegisteredSketches = payload;
      console.log(1, 'STORE', types.UPDATE_REGISTERED_SKETCHES);
    },

    [ types.UPDATE_SKETCH_INDEX_SELECTED ](state, payload) {
      state.sketchIndexSelected = payload;
      console.log(1, 'STORE', types.UPDATE_SKETCH_INDEX_SELECTED);
      state.sketchInView = (state.sketchIndexSelected >= 0) ? state.RegisteredSketches[ state.sketchIndexSelected ] : null;
    },

    [ types.UPDATE_LAYER_MENU_OPEN ](state, payload) {
      state.layerMenuOpen = payload;
    },

    [ types.UPDATE_MASTER_MENU_OPEN ](state, payload) {
      state.masterMenuOpen = payload;
    },

    [ types.UPDATE_CATALOGUE_OPEN ](state, payload) {
      state.catalogueOpen = payload;
    },

    [ types.UPDATE_AUX_INPUT_VISIBLE ](state, payload) {
      state.auxInputVisible = payload;
    },

    [ types.UPDATE_AUDIO_PLAYER_OPEN ](state, payload) {
      state.audioPlayerOpen = payload;
    },

    [ types.UPDATE_USER_LOGGED_IN ](state, payload) {
      state.userLoggedIn = payload;
    },

    [ types.UPDATE_USER ](state, payload) {
      state.user = payload;
    },

    [ types.UPDATE_IS_PLAYING ](state, payload) {
      state.audio.isPlaying = payload;
    },

    [ types.UPDATE_CURRENT_SOUND ](state, payload) {
      state.audio.currentSound = payload;
    },

    [ types.UPDATE_SOUND_DURATION ](state, payload) {
      state.audio.duration = payload;
    },

    [ types.UPDATE_CURRENT_TRACK_INDEX ](state, payload) {
      state.audio.currentTrackIndex = payload;
    },

    [ types.UPDATE_AUDIO_IS_LOADING ](state, payload) {
      state.audio.currentTrackTime = "--:--";
      state.audio.audioIsLoading = payload;
    },

    [ types.UPDATE_TRACKS ](state, payload) {
      state.audio.tracks = payload;
    },

    [ types.UPDATE_CURRENT_TRACK_TIME ](state, payload) {
      state.audio.currentTrackTime = payload;
    },
    [ types.UPDATE_SONG_PROGRESS ](state, payload) {
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
