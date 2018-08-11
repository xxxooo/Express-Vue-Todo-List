import Vue from 'vue';
import Todos from '../components/todos.vue';
import store from '../store';
import '../styles/index.scss';

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Todos),
}).$mount('#vue-app');
