import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.component(VueQrcode.name, VueQrcode)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
