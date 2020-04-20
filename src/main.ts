import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "babel-polyfill";
import Vuelidate from "vuelidate";
import vuetify from "./plugins/vuetify";
// import VNus from "vue-nouislider-fork";
// import KnobControl from "vue-knob-control";



Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(vuetify);

new Vue({
  router,
  store,
  // VNus,
  // KnobControl,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
