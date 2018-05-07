<template>
	<div class="login">
		<div class="title">登录</div>
		<div class="form-wrap">
			<div class="form-item">
				<input type="tel" v-model="phoneNumber" maxlength="11" placeholder="请在此输入您的手机号" />
			</div>
			<div class="form-item">
				<input class="vercode-input" type="tel" v-model="verCode" maxlength="6" />
				<div class="verifcode-btn" v-show="verCodeToggle" @click="sendVerCode" >获取验证码</div>
				<div class="resend-btn" v-show="toggle"><span>{{second}}</span>秒后重发</div>
			</div>
		</div>
		<button class="login-btn" @click="login">登录</button>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { Toast } from 'mint-ui';
	import {saveToLocal,loadFromLocal } from '../../common/js/store';
	import {Base64Encode} from './Base64Encode';

	export default {
		props: ['reqUrl'],
		data() {
			return {
				verCodeToggle: true,
				second: 10,
				phoneNumber: '',
				verCode: '',
				gtID: null,
			}
		},
		created() {
			// 获取用户授权Token请求headers
      var bearerToken = loadFromLocal("bearerToken","");
			if(bearerToken === ""){
				this.reqBearerToken();
      }
		},
		computed: {
			toggle: function(){
				var resendToggle = !this.verCodeToggle;
				return resendToggle;
			}
		},

		methods:{
			reqBearerToken(fn) {
				var clientId = "kkapi_shdata";
	      var clientSecret = "*SH888_kk&%API#";
				// 设置请求头
				Vue.http.options.headers = {
		 			"Authorization": "Basic " + Base64Encode(clientId + ":" + clientSecret),
		      "Content-Type": "application/json",
		      "Accept": "application/json"
        }
				this.$http.post(
	    		this.reqUrl+"/Token",
	    		{"grant_type": "client_credentials"},
	    		{emulateJSON : true}
    		).then((response)=>{
    			// 响应成功回调
    			bearerToken = response.body.access_token;
          var tokenType = response.body.token_type;
					saveToLocal("bearerToken",bearerToken);
          saveToLocal("tokenType",tokenType);
          Vue.http.options.headers = {
            "Authorization": tokenType +" "+bearerToken,
            "Content-Type": "application/json", //application/x-www-form-urlencoded
            "Accept": "application/json"
          }
          //执行回调
          fn();
				},(response) => {
				  // 响应错误回调
				  Toast('请求失败，请检查网络');
				})
			},
			sendVerCode() {
        var patrn=/^1[3|4|5|7|8|9][0-9]{9}$/;
	    	if(this.phoneNumber===""||this.phoneNumber.length<11||!patrn.exec(this.phoneNumber)){
	    		Toast("请填写手机号码");
	    	}else{
          var bearerToken = loadFromLocal("bearerToken","");
				  var tokenType = loadFromLocal("tokenType","");
	    		this.$http.post(
		    		this.reqUrl+"/api/Base/SendSMS",
		    		{tel:this.phoneNumber},
		    		{emulateJSON : true}
	    		).then((response)=>{
            // 响应成功回调
						if(response.body.return_code===1){
							Toast(response.body.return_msg)
						}else{
							Toast(response.body.return_msg)
						}
					},(response) => {
					  // 响应错误回调
					  // Toast(JSON.stringify(response));
					  Toast('请求失败，请检查网络');
					});
					this.verCodeToggle = false;
					var timer = setInterval(()=>{
						this.second--;
						if(this.second===0){
							clearInterval(timer);
							this.second = 10;
							this.verCodeToggle = true;
						}
					},1000)
	    	}
	    },
	    _veriPhone() {
	    	var patrn=/^1[3|4|5|7|8|9][0-9]{9}$/;
				var phoneNumber = this.phoneNumber;
				var phNumLen = phoneNumber.length;
				if(phoneNumber === ""||phoneNumber === null){
					Toast("手机号不能为空");
				}else if(phNumLen<11){
					Toast("请输入11位手机号码");
				}else if(!patrn.exec(phoneNumber)){
					Toast("手机格式不正确");
				}else{
					return true;
				}
	    },
	    _veriCode() {
	    	var verCode = this.verCode;
	    	if(verCode === ""||verCode === null){
					Toast("请输入6位验证码");
				}else if(verCode<6){
					Toast("请输入6位验证码");
				}else{
					return true;
				}
	    },
			login() {
				var inf = plus.push.getClientInfo();
				var u = navigator.userAgent.toLowerCase();
				var gtClientId = inf.clientid;
				var vpResult = this._veriPhone;
				var vcResult = this._veriCode;
				var bearerToken = loadFromLocal("bearerToken","");
				var tokenType = loadFromLocal("tokenType","");
				if (u.indexOf('android') > -1) {
         //安卓手机
         var deviceType = "Android";
	      } else if (u.indexOf('iphone') > -1) {
	       //苹果手机
	       deviceType = "IOS";
	      }
				Vue.http.options.headers = {
		 			"Authorization": tokenType +" "+bearerToken,
		      "Content-Type": "application/json",
		      "Accept": "application/json"
				}

				//异步发送登录请求
				if(vpResult()&&vcResult()===true){
					this.$http.post(
		    		this.reqUrl+"/api/User/Login",
		    		{tel:this.phoneNumber,checkCode:this.verCode},
		    		{emulateJSON : true}
	    		).then((response)=>{
	    			// 响应成功回调
						if(response.body.return_code===1){
							var msg = JSON.parse(response.body.return_msg);
							var _this = this;
							saveToLocal("token",msg.token);
							saveToLocal("comp_list",msg.comp_list)
							var token = msg.token;
							//判断是否存在推送的标识clientid，0为无。需要将ID发送给服务器
							if(msg.isclientid === 0){
								this.$http.get(
					    		this.reqUrl+"/api/User/getGetTui?token="+token+"&clientid="+gtClientId+"&apptype="+deviceType,
					  		).then((response)=>{
					  			//请求成功后的操作
									_this.$router.replace({
	                    path: '/page2'
	                });
	              	window.location.reload();
								},(response) => {
								  // 响应错误回调
								  Toast('gtId获取失败');
								})
							}else{
								this.$router.replace({
                  path: '/page2'
	              });
	              window.location.reload();
							}
						}else{
							Toast(response.body.return_msg);
						}
					},(response) => {
					  // 响应错误回调
					  Toast('请求失败，请检查网络');
					})
				}
			}
		}//methods闭合
	}
</script>

<style scoped>
	.login {
		position: absolute;
		z-index: 2;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		background-color: #333B5A;
		background-image: url(img/bg.png),url(img/bg_login@1.5x.png);
		background-repeat: no-repeat, no-repeat;
		background-size: 7.5rem auto, 7.5rem auto;
		background-position: center -0.65rem, center 1.95rem;
	}
	.login .title{
		position: absolute;
		bottom: 9.8rem;
		left: 0;
		right: 0;
		width: 5.5rem;
		color: #FFFFFF;
		font-size: 0.68rem;
		line-height: 0.95rem;
		margin: 0 auto;
	}
	.form-wrap{
		position: absolute;
		bottom: 3.6rem;
		left: 0;
		right: 0;
		width: 5.5rem;
		margin: 0 auto;
	}
	.form-item{
		padding-bottom: 0.1rem;
		margin-bottom: 0.28rem;
		border-bottom: 0.01rem solid rgba(255,255,255,0.7);
	}
	.form-item input{
		line-height: 0.5rem;
		font-size: 0.36rem;
		color: #FFFFFF;
		background-color: transparent;
		outline: none;
	}
	.form-item input::-webkit-input-placeholder{
		color: #fff;
	}
	.form-item .vercode-input{
		display: inline-block;
		width: 3.5rem;
	}
	.form-item .verifcode-btn,
	.form-item .resend-btn{
		display: inline-block;
		width: 1.8rem;
		height: 0.42rem;
		line-height: 0.42rem;
		border-left: 1px solid #979797;
		font-size: 0.3rem;
		color: #FFFFFF;
		text-align: center;
	}
	.login-btn{
		position: absolute;
		bottom: 1.36rem;
		left: 0;
		right: 0;
		width: 5.5rem;
		height: 0.68rem;
		margin: 0 auto;
		border: none;
		background-image: linear-gradient(90deg, #72DEE1 0%, #817FE2 100%);
		border-radius: 0.5rem;
		font-size: 0.36rem;
		color: #FFFFFF;
	}
</style>
