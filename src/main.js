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

var bearerToken = loadFromLocal("bearerToken","");
var tokenType = loadFromLocal("tokenType","");
				
Vue.http.options.headers = {
	"Authorization": tokenType +" "+bearerToken,
  "Content-Type": "application/json",
  "Accept": "application/json"
}

Vue.http.interceptors.push((request, next) => {
	// 弹出系统等待对话框
	if(window.plus){
		plusReady();
	}else{
		document.addEventListener("plusready",plusReady,false);
	}
	function plusReady(){
		plus.nativeUI.showWaiting( "加载中..." );
	}
	next((response) => {
		plus.nativeUI.closeWaiting();
	})
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

