import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuelidate from 'vuelidate';
import store from './store';
import vuetify from './plugins/vuetify';
import VueNouislider from './vue-nouislider';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(VueNouislider);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
