<template>
	<div class="complaint">
		<div class="main-container" ref="pageWrapper">
			<div class="scroll-container">
				<comheader :pageText="headerText"></comheader>
				<div class="wrap">
					<div class="text-content">
						<div class="num">{{CountUnsatisfy}}条</div>
						<div class="label">客户投诉</div>
					</div>
					<div class="list-container">
						<div class="item" v-for="(item,index) in Satis_list" :key="index">
							<span class="name">{{item.name}}</span>
							<span>:</span>
							<span class="text">{{item.describe}}</span>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import comheader from '../header/header';
	import {saveToLocal,loadFromLocal } from '../../common/js/store';
	import { Toast } from 'mint-ui';

	export default {
		props: ['reqUrl','pickerValue'],
		data: function(){
			return {
				headerText: "满意度数据",
				CountUnsatisfy: 0,
				Satis_list: [],
				timeType: 1
			}
		},
		created() {
			this.$nextTick(()=>{
	  		this._initScroll()
	  	});
	  	this.requestData();
		},
		methods: {
			requestData() {
				var token = loadFromLocal("token","");
				var compID = loadFromLocal("compID","");
				var timeType = this.timeType;
				var time = this.pickerValue
				this.$http.get(
	    		this.reqUrl+"/api/Data/getSatisList?token="+token+"&comp_code="+compID+"&types="+timeType+"&times="+ time,
	  		).then((response)=>{
					if(response.body.return_code===1){
						var msg = JSON.parse(response.body.return_msg);
						console.log(msg);
						this.CountUnsatisfy = msg.CountUnsatisfy;
						this.Satis_list = msg.Satis_list;
					}else if(response.body.return_code === 501){
						Toast("身份已过期请重新登录");
						localStorage.removeItem('__app__');
						this.$router.replace({
	              path: '/login',
	              query: {redirect: this.$router.currentRoute.fullPath}
	          })
					}else{
						Toast(response.body.return_msg);
					}
				},(response) => {
				  // 响应错误回调
				  Toast('请求失败，请检查网络');
				});
			},
			_initScroll() {
	    	this.pageScroll = new BScroll(this.$refs.pageWrapper,{
	    		click:true
	    	})
	    }
		},
		components: {
			comheader
		}
	}
</script>

<style>
	.complaint{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		background-image: linear-gradient(-180deg, #333B5A 0%, #333B5A 10%, #5D669F 100%);
	}
	.complaint .main-container{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.complaint .wrap{
		width: 6.6rem;
		margin: 0 auto;
	}
	.complaint .text-content{
		color: #FFFFFF;
		margin-top: 0.4rem;
	}
	.complaint .text-content .num{
		font-size: 0.6rem;
		line-height: 0.65rem;
}
	.complaint .text-content .label{
		display: flex;
		align-items: center;
		line-height: 0.33rem;
		font-size: 0.24rem;
	}
	.complaint .text-content .label:before{
		content: "";
	  display: inline-block;
	  width: 0.06rem;
	  height: 0.2rem;
	  background-image: linear-gradient(70deg, #F69887 0%, #817EE2 100%);
	  border-radius: 0.05rem;
	  margin-right: 0.16rem;
	}
	.complaint .list-container{
		margin-top: 0.5rem;
	}
	.complaint .list-container .item{
		padding: 0.2rem;
		line-height: 0.4rem;
		background-color:  #333B5A;
		border-radius: 0.2rem;
		margin-bottom: 0.3rem;
		color: #FFFFFF;
		font-size: 0.28rem;
	}
	.list-container .item .name{
		color: #70E5E0;
	}
</style>
