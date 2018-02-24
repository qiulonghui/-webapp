import Vue from 'vue'
import Router from 'vue-router'
import page1 from '@/components/page1/page1'
import page2 from '@/components/page2/page2'
import page3 from '@/components/page3/page3'
import business from '@/components/business/business'
import satisfact from '@/components/satisfact/satisfact'
import client from '@/components/client/client'
import login from '@/components/login/login'
import blanktips from '@/components/blanktips/blanktips'
import complaint from '@/components/complaint/complaint'
import {saveToLocal,loadFromLocal } from '../common/js/store'

//var token = loadFromLocal("token",undefined);
//console.log(token)

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/page2'
    },{
    	path: "/page2",
    	name: "page2",
    	meta: {
	      require: true  // 添加该字段，表示进入这个路由是需要登录的
	    },
    	component: page2
    },{
    	path: "/page1", name: "page1", component: page1,
    	meta: {
	      require: true  // 添加该字段，表示进入这个路由是需要登录的
	    },
    	children:[
    		{
    			path: 'business',
          component: business,
          meta: {
          	back: true //允许使用物理返回键返回
          }
    		},{
    			path: 'satisfact',
          component: satisfact,
          meta: {
          	back: true //允许使用物理返回键返回
          },
          children:[
	    		{
	    			path: 'complaint',
	          component: complaint,
	          meta: {
	          	back: true //允许使用物理返回键返回
	          }
	    		}]
    		},{
    			path: 'client',
          component: client,
          meta: {
          	back: true //允许使用物理返回键返回
          }
    		},{
    			path: 'blanktips',
          component: blanktips,
          meta: {
          	back: true //允许使用物理返回键返回
          }
    		}
    	]
    },{
    	path: "/page3",
    	name: "page3",
    	meta: {
	      require: true  // 添加该字段，表示进入这个路由是需要登录的
	    },
    	component: page3
    },{
    	path: "/login",
    	name: "login",
    	component: login
    }
  ]
})

export default router;

router.beforeEach((to, from, next) => {
	var token = loadFromLocal("token",undefined);
	window.backFlag = to.meta.back;
  if (to.meta.require) {
    if (!token) {
      next({
        path: '/login',
        query: {redirect: to.fullPath} 
      })
    }
  }
  
	document.addEventListener("plusready", onPlusReady, false);
	function onPlusReady(){
		plus.key.addEventListener("backbutton",function(){
			var curRounter = router.currentRoute.name;
			if(window.backFlag){
				router.go(-1);
			}else{
				var ws=plus.webview.currentWebview();
				plus.webview.close(ws,"none");
			}
		});
	}
	

  next()
})

				
    	

