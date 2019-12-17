import Vue from 'vue';
import Vuex from 'vuex';
import RegisteredSketches from '@/js/services/SketchRegistration';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    sketchIndexSelected: -1,
  },
  mutations: {
    updateSketchIndexSelected(state, payload) {
      state.sketchIndexSelected = payload;
    },

    updateUserLoggedIn(state, payload) {
      state.userLoggedIn = payload;
    },

    updateUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {},
  modules: {},
});
