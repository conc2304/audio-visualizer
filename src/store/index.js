import Vue from 'vue';
import Vuex from 'vuex';
import RegisteredSketches from '@/js/services/SketchRegistration';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sketchIndexSelected: -1,
    RegisteredSketches,
    updatedTimestamp: 0,
  },
  mutations: {
    updateSketchIndexSelected(state, payload){
      state.sketchIndexSelected = payload;
    },
    updateRegisteredSketches(state, payload) {
      state.RegisteredSketches = payload;
    }
  },
  actions: {
  },
  modules: {
  },
});
