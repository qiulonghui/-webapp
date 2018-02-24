<template>
	<div class="satisfact">
		<div class="main-container" ref="pageWrapper">
			<div class="scroll-container" >
				<comheader :pageText="headerText"></comheader>
				<div class="cont-container">
					<div class="text-content">
						<div class="num">{{CountSum}}人</div>
						<div @click="test" class="label">评价总数</div>
					</div>
					<div class="btn-wrap">
						<span class="picker-btn" @click="openPicker">{{pickerValue}}</span>
					</div>
				</div>
				<div class="container-shadow">
					<div class="chart-container" ref="pieWrapper">
						<div  ref="pie" class="pie" style="width: 6.8rem;height: 7rem;"></div>
					</div>
				</div>
				<div>
					<router-link class="link" to="/page1/satisfact/complaint">
						<div class="text1">客户投诉</div>
						<div class="text2">共{{CountUnsatisfy}}条</div>
					</router-link>
				</div>
				<mt-datetime-picker @confirm="handleChange" ref="picker" type="date"></mt-datetime-picker>
				<router-view :pickerValue="pickerValue" :reqUrl="reqUrl"></router-view>
			</div>
		</div>
		<mt-datetime-picker @confirm="handleChange" ref="picker" v-model="nowTime" :startDate="startTm" :endDate="endTm" type="date"></mt-datetime-picker>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import echarts from 'echarts';
	import comheader from '../header/header';
	import {saveToLocal,loadFromLocal } from '../../common/js/store';
	import pieOption from './pieOption';
	import { Toast } from 'mint-ui';

	export default {
		props: ['reqUrl'],
		data (){
			return{
				headerText: "满意度数据",
				CountSum: null,
				CountUnsatisfy: null,
				pickerValue: '',
				nowTime: new Date(),
				timeType: 1
			}
		},
		created() {
			this.$nextTick(()=>{
	  		this._initScroll()
	  	});
			this.getNowDate();
			this.requestData();
		},
		computed: {
			startTm() {
				var nowYear = new Date().getFullYear();
				var lastYear = nowYear - 1;
				var date = new Date(lastYear, 0, 1);
				return date;
			},
			endTm() {
				var date = new Date();
				return date;
			}
		},
		methods: {
		  test: function () {
        console.log(666);
        this.$refs.pieWrapper.click();
      },
			requestData() {
				var token = loadFromLocal("token","");
				var compID = loadFromLocal("compID","");
				var timeType = this.timeType;
				var time = this.pickerValue
				this.$http.get(			
	    		this.reqUrl+"/api/Data/getSatisfaction?token="+token+"&comp_code="+compID+"&types="+timeType+"&times="+ time,
	  		).then((response)=>{
					if(response.body.return_code===1){
						var msg = JSON.parse(response.body.return_msg);
						console.log(msg);
						this.CountSum = msg.CountSum;
						this.CountUnsatisfy = msg.CountUnsatisfy;
						
						pieOption.series[0].data = msg.Count_list.sort(function (a, b) { return a.value - b.value; });
						var pieDom = this.$refs.pie;
						var pieChart = echarts.init(pieDom);	
						pieChart.setOption(pieOption);
					}else if(response.body.return_code === 501){
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
			initPie() {
				//初始化饼图图表
				//图表相关配置参数在pieOption模块文件中
				var pieDom = this.$refs.pie;
				var pieChart = echarts.init(pieDom);	
				pieChart.setOption(pieOption);
			},
			_initScroll() {
	    	this.pageScroll = new BScroll(this.$refs.pageWrapper,{
	    		click:true
	    	})
	  	},
			getNowDate() {
				var oDate = new Date();
				var nowDate = oDate.getFullYear() + '.' + (oDate.getMonth() + 1) + '.' + oDate.getDate();
				this.pickerValue = nowDate
			},
			openPicker(picker) {
	      this.$refs.picker.open();
	    },
	    handleChange(value){  	
	     	var d = new Date(value.toString());
				var date = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
				this.pickerValue = date;
				this.requestData();
	    }
		},
		mounted() {
			this.initPie();
		},
		components: {
			comheader
		}
	}
</script>

<style scoped>
	.satisfact{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		background-image: linear-gradient(-180deg, #333B5A 0%, #333B5A 10%, #5D669F 100%);
		z-index: 2;
	}
	.satisfact .main-container{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.satisfact .scroll-container{
		padding-bottom: 0.6rem;
	}
	.satisfact .cont-container{
		display: flex;
		justify-content: space-between;
		width: 6.6rem;
		margin: 0 auto;
		margin-top: 0.4rem;
	}
	.satisfact .text-content{
		color: #FFFFFF;
	}
	.satisfact .text-content .num{
		line-height: 0.6rem;
		font-size: 0.6rem;
	}
	.satisfact .text-content .label{
		display: flex;
		align-items: center;
		line-height: 0.33rem;
		font-size: 0.24rem;
	}
	.satisfact .text-content .label:before{
		content: "";
    display: inline-block;
    width: 0.06rem;
    height: 0.2rem;
    background-image: linear-gradient(70deg, #F69887 0%, #817EE2 100%);
    border-radius: 0.05rem;
    margin-right: 0.16rem;
	}
	.satisfact .cont-container .btn-wrap{
		display: flex;
		align-items: flex-end;
	}
	.satisfact .btn-wrap .picker-btn{
		line-height: 0.42rem;
		color: #FFFFFF;
		font-size: 0.3rem;
		background-image: url(../../assets/home_nav_time@1.5x.png);
		background-repeat: no-repeat;
    background-size: 0.14rem 0.19rem;
    background-position: right 0.1rem;
    padding-right: 0.25rem;
    margin-bottom: -0.06rem; 
	}
	.satisfact .container-shadow{
		position: relative;
		width: 6.9rem;
		height: 6.8rem;
		background-image: linear-gradient(-180deg, #434973 0%, #414B73 100%);
		margin: 0 auto;
		border-radius: 0.2rem;
		margin-top: 0.8rem;
	}
	.satisfact .container-shadow .chart-container{
		position: absolute;
		left: 0;
		right: 0;
		width: 6.1rem;
		height: 7.56rem;
		background-image: url(img/view_satisfaction_wave@1.5x.png),linear-gradient(-180deg, #596199 0%, #414B73 100%);
		background-repeat: no-repeat, repeat;
		background-position: center bottom, center;
		background-size: 100% 1.23rem, 100%;
		box-shadow: 0 0 10px 0 #817EE2;
		margin: 0 auto;
		margin-top: -0.4rem;
		border-radius: 0.25rem;
	}
	.satisfact .link{
		display: flex;
		align-items: center;
		width: 6.6rem;
		height: 1.5rem;
		color: #FFFFFF;
		padding-left: 0.7rem;
		padding-right: 0.6rem;
		box-sizing: border-box;
		background-image: linear-gradient(70deg, rgba(246,152,135,0.3) 0%, rgba(129,126,226,0.3) 100%);
		box-shadow: 0 0.09rem 0.2rem 0 rgba(51,59,90,0.26), inset 0 0 0.14rem 0 rgba(245,152,135,0.41);
		border-radius: 0.2rem;
		margin: 0 auto;
		margin-top: 1.3rem;
	}
	.satisfact .link:after{
		content:"";
		display:inline-block;
		height: 0.18rem;
		width: 0.18rem;
		margin-top: 0.22rem;
		border-width: 0.04rem 0.04rem 0 0;
		border-color:#fff;
		border-style:solid;
		transform:translateY(-50%) matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	}
	.satisfact .link .text1{
		flex: 1;
		font-size: 0.36rem;
	}
	.satisfact .link .text2{
		margin-right: 0.2rem;
	}
</style>