import Vue from 'vue';
import Todos from '../components/todos.vue';
import '../styles/index.scss';

Vue.config.productionTip = false;
new Vue({
  render: h => h(Todos),
}).$mount('#vue-app');
