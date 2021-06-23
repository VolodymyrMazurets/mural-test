import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import movable from "v-movable";
import 'bulma/css/bulma.min.css';

Vue.use(movable);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
