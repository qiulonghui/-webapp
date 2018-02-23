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
	import { Toast } from 'mint-ui';
	import {saveToLocal,loadFromLocal } from '../../common/js/store'
	export default {
		props: ['reqUrl'],
		data() {
			return {
				verCodeToggle: true,
				second: 10,
				phoneNumber: '',
				verCode: ''
			}
		},
		computed: {
			toggle: function(){
				var resendToggle = !this.verCodeToggle;
				return resendToggle;
			}
		},
		beforeRouteLeave (to, from , next) {
		 window.location.reload();
		 next();
		},

		methods:{
			sendVerCode() {
	    	if(this.phoneNumber===""||this.phoneNumber.length<11){
	    		Toast("请填写手机号码");
	    	}else{
	    		this.$http.post(
		    		this.reqUrl+"/api/Base/SendSMS",
		    		{tel:this.phoneNumber},
		    		{emulateJSON : true}
	    		).then((response)=>{
						if(response.body.return_code===1){
							Toast(response.body.return_msg)
						}else{
							Toast(response.body.return_msg)
						}
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
				var vpResult = this._veriPhone;
				var vcResult = this._veriCode;
				if(vpResult()&&vcResult()===true){
					this.$http.post(
		    		this.reqUrl+"/api/User/Login",
		    		{tel:this.phoneNumber,checkCode:this.verCode},
		    		{emulateJSON : true}
	    		).then((response)=>{
						if(response.body.return_code===1){
							var msg = JSON.parse(response.body.return_msg);
							saveToLocal("token",msg.token);
							saveToLocal("comp_list",msg.comp_list)
							this.$router.replace({
                    path: '/page2'
               });  
						}else{
							Toast(response.body.return_msg);
						}
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