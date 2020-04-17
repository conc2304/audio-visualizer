import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import vuetify from 'vuetify';
// import VNus from 'vue-nouislider-fork';
// import KnobControl from 'vue-knob-control';


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  // VNus,
  // KnobControl,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
