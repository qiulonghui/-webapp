<template>
	<div class="client">
		<div class="main-container" ref="pageWrapper">
			<div class="scroll-container">
				<!--better-scroll滚动内容部分-->
				<div class="header">
					<i @click="_backPage" class="back"></i>
					<div class="nav">
						<div @click="typeToggle('1')" class="client-nav" :class="{'active':selectType==='1'}">客户量</div>
						<div @click="typeToggle('2')" class="outTime-nav" :class="{'active':selectType==='2'}">等待超时量</div>
					</div>
				</div>
				<div class="selectorbar">
					<span class="picker-btn" @click="openPicker">{{pickerValue}}</span>
					<keep-alive>
						<div class="btn-group">
							<span @click="typeDurToggle(0)" class="btn" :class="{'active':selectDurType===0}">日</span>
							<span @click="typeDurToggle(1)" class="btn" :class="{'active':selectDurType===1}">月</span>
							<span @click="typeDurToggle(2)" class="btn" :class="{'active':selectDurType===2}">年</span>
						</div>
					</keep-alive>
				</div>
		    <div class="page-tab-container">
					<mt-tab-container v-model="selectType" swipeable>
					  <mt-tab-container-item id="1" class="cont">
					  	<div class="text-content">
								<div class="num">{{ComeNum}}人</div>
								<div class="label">门诊总数</div>
							</div>
							<div class="cus-curve" ref="cusCurve" style="width: 8.2rem; height: 4.85rem;"></div>
							<div class="container">
								<div class="tab">
									<div class="tab-item">初诊客户来源</div>
								</div>
								<div class="content">
									<div class="pie" ref="pie" style="width: 6.9rem;height: 6.3rem;"></div>
								</div>
							</div>
					  </mt-tab-container-item>
					  <mt-tab-container-item id="2" class="cont outtime">
					  	<div class="text-content">
								<div class="num">{{OverNum}}人</div>
								<div class="label">超时总数</div>
							</div>
							<div class="table-wrap">
								<div class="table-header">
									<div class="td"></div>
									<div class="td">
										<div class="num">15</div>
										<div class="fz">分钟</div>
									</div>
									<div class="td">
										<div class="num">30</div>
										<div class="fz">分钟</div>
									</div class="td">
									<div class="td">
										<div class="num">45</div>
										<div class="fz">分钟</div>
									</div>
								</div>
								<table border="" cellspacing="" cellpadding="">
									<tr v-for="item in tableDate"><td>{{item.time}}</td><td>{{item.time15}}</td><td>{{item.time30}}</td><td>{{item.time45}}</td></tr>
								</table>
							</div>
					  </mt-tab-container-item>
					</mt-tab-container>
				</div>	
			</div>
		</div>
		<mt-datetime-picker @confirm="handleChange" ref="picker" v-model="nowTime" :startDate="startTm" :endDate="endTm" type="date"></mt-datetime-picker>
	</div>
</template>

<script>
	import echarts from 'echarts';
	import BScroll from 'better-scroll';
	import { Navbar, TabItem } from 'mint-ui';
	import {saveToLocal,loadFromLocal } from '../../common/js/store';
	import curveOption from './curveOption';
	import pieOption from './pieOption';
	import { Toast } from 'mint-ui';
	
	export default {
		props: ['reqUrl'],
		data() {
			return {
				selectType: '1',
				pickerValue: '',
		  	selectDurType: 0,
				tableDate: [],
				nowTime: new Date(),
				timeType: 1,
				ComeNum: null,
				pieName: "初诊客户来源",
				OverNum: ""
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
			requestData() {
				var token = loadFromLocal("token","");
				var compID = loadFromLocal("compID","");
				var timeType = this.timeType;
				var time = this.pickerValue;
				this.$http.get(			
	    		this.reqUrl+"/api/Data/getClient?token="+token+"&comp_code="+compID+"&types="+timeType+"&times="+ time,
	  		).then((response)=>{
					if(response.body.return_code===1){
						var msg = JSON.parse(response.body.return_msg);
						console.log(msg);
						this.ComeNum = msg.ComeNum;
						this.tableDate = msg.Over_list;
						this.OverNum = msg.OverNum;
						
						var initFirstList = msg.SevenFirst_list;
						var initSecondList = msg.SevenSecond_list;
						var firstDataList = [];
						var secondDataList = [];
						var dateList = [];
						for (var i=0; i<initFirstList.length; i++) {
							var firstItem = initFirstList[i]["FirstNum"];
							var dateItem = initFirstList[i]["ResultDate"];
							firstDataList.push(firstItem);						
							dateList.push(dateItem);
						}		
						for(var i=0; i<initSecondList.length; i++){
							var secondItem = initSecondList[i]["FirstNum"];
							secondDataList.push(secondItem);
						}
						curveOption.series[0].data = firstDataList;
						curveOption.series[1].data = secondDataList;
						console.log(secondDataList);
						curveOption.xAxis.data = dateList;
						var curveDom = this.$refs.cusCurve;
						var curveChart = echarts.init(curveDom);	
						curveChart.setOption(curveOption);
						
						pieOption.series[0].data = msg.InfoSource_list.sort(function (a, b) { return a.value - b.value; });
						pieOption.series[0].name = this.pieName;
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
			initCurve() {
				//初始化曲线图表
				//图表相关配置参数在curveOption模块文件中
				var curveDom = this.$refs.cusCurve;
				var curveChart = echarts.init(curveDom);	
				curveChart.setOption(curveOption);
			},
			initPie() {
				//初始化饼图图表
				//图表相关配置参数在pieOption模块文件中
				var pieDom = this.$refs.pie;
				var pieChart = echarts.init(pieDom);	
				pieChart.setOption(pieOption);
			},
	    typeToggle(type) {
				this.selectType = type;
			},
			_initScroll() {
	    	this.pageScroll = new BScroll(this.$refs.pageWrapper,{
	    		click:true
	    	})
	    },
			_backPage() {
				this.$router.go(-1);
			},
			typeDurToggle(type) {
				this.selectDurType = type;
				this.timeType = type+1;
				this.requestData();
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
	    handleChange(value) {  	
	     	var d = new Date(value.toString());
				var date = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
				this.pickerValue = date;
				this.requestData();
	    }
		},
		mounted() {
			this.initCurve();
			this.initPie();
		}
	}
	
</script>

<style scoped>
	.client{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		background-image: linear-gradient(-180deg, #333B5A 0%, #333B5A 10%, #5D669F 100%);
		z-index: 2;
	}
	.client .main-container{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.header{
		width: 6.9rem;
		height: 0.88rem;
		margin: 0 auto;
		margin-bottom: 0.2rem;
		overflow: hidden;
	}
	.header .back{
		position: absolute;
		display: inline-block;
		width: 0.3rem;
		height: 0.3rem;
		background-image: url(img/icon_return@1.5x.png);
		background-repeat: no-repeat;
		background-size: 0.16rem 0.26rem;
		background-position: center;
		margin-top: 0.29rem;
	}
	.header .nav{
		display: flex;
		width: 5rem;
		height: 0.42rem;
		line-height: 0.42rem;
		margin: 0 auto;
		margin-top: 0.21rem;
		border: 1px solid #5D669F;border-radius: 0.3rem;
	}
	.header .nav div{
		flex: 1;
		border-radius: 0.3rem;
		color: #FFFFFF;
		font-size: 0.28rem;
		line-height: 0.48rem;
		text-align: center;
	}
	.header .nav div.active{
		background-image: linear-gradient(-90deg, #817FE2 0%, #72DEE1 100%);
	}
	.selectorbar{
		height: 0.42rem;
		padding: 0 0.45rem;
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.56rem;
	}
	.picker-btn{
		line-height: 0.42rem;
		color: #FFFFFF;
		font-size: 0.3rem;
		background-image: url(../../assets/home_nav_time@1.5x.png);
		background-repeat: no-repeat;
	  background-size: 0.14rem 0.19rem;
	  background-position: right 0.1rem;
	  padding-right: 0.25rem;
	}
	.selectorbar .btn-group{
		line-height: 0.42rem;
		font-size: 0.3rem;
		color: #fff;	
	}
	.selectorbar .btn-group .btn{
		display: inline-block;
		width: 0.5rem;
		text-align: center;
		margin-left: 0.15rem;
	}
	.selectorbar .btn-group .btn.active:after{
		content: "";
		display: block;
		width: 100%;
		height: 0.1rem;
		background-image: url(../selectorbar/img/sign_result_time@1.5x.png);
		background-size: 0.33rem 0.08rem;
		background-repeat: no-repeat;
		background-position: center;
	}
	.page-tab-container .cont{
		padding: 0 0.45rem;
		box-sizing: border-box;
	}
	.page-tab-container .cus-curve{
		margin-left: -0.8rem;
		margin-top: -0.6rem;
	}
	.page-tab-container .text-content{
		color: #FFFFFF;
	}
	.page-tab-container .text-content .num{
		line-height: 0.6rem;
		font-size: 0.6rem;
	}
	.page-tab-container .text-content .label{
		line-height: 0.33rem;
		font-size: 0.24rem;
	}
	.page-tab-container .text-content .label:before{
		content: "";
    display: inline-block;
    width: 0.06rem;
    height: 0.2rem;
    background-image: linear-gradient(70deg, #E5DE70 0%, #72DEE1 100%);
    border-radius: 0.05rem;
    margin-right: 0.16rem;
	}
	.page-tab-container .container{
		width: 6.6rem;
		height: 6.3rem;
		margin: 0 auto;
		background-image: linear-gradient(-180deg, #5D669F 0%, #414B73 100%);
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
	}
	.page-tab-container .tab{
		position: relative;
		z-index: 2;
		display: flex;
		height: 1rem;
		background-image: linear-gradient(-90deg, rgba(129,127,226,0.3) 0%, rgba(114,222,225,0.3) 100%);
		background-repeat: no-repeat;
		background-size: 100% 2px;
		background-position: left bottom;
	}
	.page-tab-container .tab .tab-item{
		font-size: 0.3rem;
		line-height: 1.2rem;
		color: #fff;
		text-align: center;
		margin-left: 0.3rem;
	}
	.page-tab-container .container .pie{
		margin-top: -0.95rem;
		margin-left: -0.3rem;
	}
	.page-tab-container .outtime .text-content{
		margin-top: 1rem;
		margin-bottom: 0.7rem;
	}
	.outtime .text-content .label:before{
		background-image: linear-gradient(70deg, #F69887 0%, #817EE2 100%);
	}
	.outtime .table-wrap .table-header{
		display: flex;
		height: 1.4rem;
		background-image: linear-gradient(47deg, #817FE2 0%, #72DEE1 100%);
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
	}
	.table-wrap .table-header .td{
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
	}
	.table-header .td div{
		text-align: center;
		color: #FFFFFF;
	}
	.table-header .td .num{
		font-size: 0.64rem;
		font-weight: 400;
	}
	.table-header .td .fz{
		font-size: 0.24rem;
		line-height: 0.33rem;
	}
	.outtime .table-wrap table{
		width: 6.6rem;
		min-height: 4rem;
		background-image: linear-gradient(-180deg, #333B5A 0%, rgba(51,59,90,0.00) 100%);
		color: #FFFFFF;
		text-align: center;		
	}
	.table-wrap table tr{
		display: flex;
		align-items: center;
		height: 0.8rem;
	}
	.outtime .table-wrap table td{
		flex: 1;
		vertical-align: middle;
		font-size: 0.24rem;
	}
	
</style>