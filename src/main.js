// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import { FormModel } from 'ant-design-vue'
import YmapPlugin from 'vue-yandex-maps'
import VueClipboard from 'vue-clipboard2'
import VueCounter from 'vue-number-animation'
// import VueWow from 'vue-wow'
import VueDebounce from 'vue-debounce'
import TwoGIS from '2gis-maps'
import myIcon from './core/icons'
// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './assets/global.less'
import '@/assets/global.less'
import '@/plugins/GlobalFunctions'
// import storage from 'store'
// import firebaseInitialize from './firebase'
import { DAY_DIFFERENCE_HOUR } from '@/constants/hour'
Vue.prototype.$diffDayHour = DAY_DIFFERENCE_HOUR
Vue.config.productionTip = false
Vue.prototype.$myIcon = myIcon
// mount axios to `Vue.$http` and `this.$http`
// Vue.use(Mask)
Vue.use(TwoGIS)
Vue.use(VueClipboard)
Vue.use(VueAxios)
Vue.use(FormModel)
Vue.use(VueCounter)
// Vue.use(VueWow)
Vue.component('pro-layout', ProLayout)
Vue.use(VueDebounce, {
  defaultTime: '700ms'
})
Vue.component('page-header-wrapper', PageHeaderWrapper)
window.umi_plugin_ant_themeVar = themePluginConfig.theme

const settings = {
  apiKey: 'c8e3f2db-2125-41f0-b64a-c6a8337718cf',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}
Vue.use(YmapPlugin, settings)

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  // helloarn
  // beforeCreate () {
  //   // bootstrap
  //   if (localStorage.getItem('roleID')) {
  //     const role = localStorage.getItem('roleID').toString()
  //     this.$store.dispatch('getRolePermissionById', role.slice(1, (role.length - 1))).then(res => {
  //       window.localStorage.setItem('permissions', JSON.stringify(res.permissions))
  //     })
  //   }
  // },
  render: h => h(App)
}).$mount('#app')
