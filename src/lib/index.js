import vueXPlayer from './vueXPlayer.vue'

const vuexplayer = {
  install (Vue, options) {
    Vue.component('vue-x-player', vueXPlayer)
  }
}
if (typeof window !== 'undefined' && window.Vue) { window.Vue.use(vuexplayer); }
export default vuexplayer
