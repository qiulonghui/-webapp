// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import { saveToLocal,loadFromLocal } from './common/js/store'

document.addEventListener("netchange",function(){
  if(plus.networkinfo.getCurrentType()===plus.networkinfo.CONNECTION_NONE){
  	alert("当前未连接网络")
  }
}, false );

Vue.config.productionTip = false

Vue.use(MintUI)
Vue.use(VueResource)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

