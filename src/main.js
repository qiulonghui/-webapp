// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import { saveToLocal,loadFromLocal } from './common/js/store'
import {Base64Encode} from './components/login/Base64Encode'

document.addEventListener("plusready", onPlusReady, false);

function onPlusReady(){
  document.addEventListener("pause", onAppBackground, false);
  document.addEventListener("netchange", onAppNetchange, false );
}

function onAppNetchange (){
  if(plus.networkinfo.getCurrentType()===plus.networkinfo.CONNECTION_NONE){
    alert("当前未连接网络");
  }
}

// 当APP进入时，执行清楚数字角标
function onAppBackground (){
	clearBadge();
}

// 清除数字角标
function clearBadge() {
	plus.runtime.setBadgeNumber(0);
}

Vue.config.productionTip = false;

Vue.use(MintUI);
Vue.use(VueResource);

var bearerToken = loadFromLocal("bearerToken","");
var tokenType = loadFromLocal("tokenType","");


Vue.http.options.headers = {
  "Authorization": tokenType +" "+bearerToken,
  "Content-Type": "application/json", //application/x-www-form-urlencoded
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
var app = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


