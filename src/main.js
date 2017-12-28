import Vue from 'vue'
import App from './App.vue'
import vuexplayer from './lib/index.js'
Vue.use(vuexplayer)

new Vue({
  el: '#app',
  render: h => h(App)
})
