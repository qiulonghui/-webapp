<template>
	<div class="user-center">
		<div class="container" v-if="requestResult">
			<div class="user-info-wrap">
				<img class="user-avatar" src="../page2/img/home_tab_indicator_highlighted@1.5x.png"/>
				<div class="user-info">
					<div class="name">{{name}}</div>
					<div class="postion">{{job}}</div>
				</div>
			</div>
			<router-link class="link" to="/login">
				<div class="sign-out" @click="signOut">账号登出</div>
			</router-link>
		</div>
		<div class="errorTip" v-else>网络请求失败，请重试</div>
	</div>
</template>

<script>
	import {saveToLocal,loadFromLocal } from '../../common/js/store'
	import { Toast } from 'mint-ui';
	export default {
		props: ['reqUrl'],
		data() {
			return {
				requestResult: true,
				name: "",
				job: ""
			}
		},
		created() {
			var token = loadFromLocal("token","");
			this.$http.get(
    		this.reqUrl+"/api/User/getInfo?token="+token,
  		).then((response)=>{
  			if(response.body.return_code===1){
  				console.log(response.body)
	  			var msg = JSON.parse(response.body.return_msg);
	  			this.requestResult = true;
	  			this.name = msg.name;
	  			this.job = msg.job;
  			}else if(response.body.return_code === 501){
					localStorage.removeItem('__app__');
					this.$router.replace({
              path: '/login',
              query: {redirect: this.$router.currentRoute.fullPath}
          })
				}else{
  				Toast(response.body.return_msg)
  			}
			},(response) => {
			  // 响应错误回调
			  this.requestResult = false;
			});	
		},
		methods: {
			signOut() {
				localStorage.removeItem('__app__');
			}
		}
		
	}
</script>

<style scoped>
	.user-center{
		position: absolute;
		top: 0;
		bottom: 0.98rem;
		left: 0;
		right: 0;
		overflow: hidden;
		background-image: url(img/bg.png);
		background-size: 7rem 5.3rem;
		background-position: center top;
		background-repeat: no-repeat;
	}
	.user-center .container{
		position: absolute;
		top: 5.07rem;
		left: 0;
		right: 0;
		width: 6.3rem;
		margin: 0 auto;
		color: #FFFFFF;
	}
	.user-center .container .user-info-wrap{
		display: flex;
    background-image: linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
    background-size: 120% 1px;
    background-repeat: no-repeat;
    background-position: 0 bottom;
    padding-bottom: 0.3rem;
    margin-bottom: 0.4rem;
	}
	.errorTip{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 10.48rem;
		color: #FFFFFF;
	}
	.user-center .container .user-avatar{
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 50%;
		margin-right: 0.6rem;
	}
	.user-center .container .user-info{
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
	}
	.user-center .user-info .name{
		line-height: 0.53rem;
		font-size: 0.38rem;
		margin-bottom: 0.1rem;
	}
	.user-center .user-info .postion{
		line-height: 0.33rem;
		font-size: 0.24rem;
	}
	.user-center .container .sign-out{
		padding-left: 0.75rem;
		line-height: 0.5rem;
		background-image: url(img/icon_me_logout@1.5x.png);
		background-size: 0.5rem 0.5rem;
		background-repeat: no-repeat;
		color: #fff;
	}
	.user-center .container .link{
		display: inline-block;
	}
</style>