import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vuelidate from "vuelidate";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VNus from "vue-nouislider-fork";
import KnobControl from "vue-knob-control";

import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(VNus);
Vue.use(KnobControl);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount("#app");
