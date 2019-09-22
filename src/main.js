import Vue from "vue";
import axios from "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import VueGeolocation from "vue-browser-geolocation";
import store from "./store";
import vuetify from "./plugins/vuetify";
import vueHeadful from 'vue-headful';

window.$ = window.jQuery = require('jquery');

Vue.config.productionTip = false;
Vue.use(VueGeolocation);

window.vi = new Vue({
  router,
  store,
  vuetify,
  axios,
  vueHeadful,

  render: function(h) {
    return h(App);
  }
}).$mount("#app");
