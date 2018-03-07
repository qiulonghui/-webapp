<template>
	<div class="day-indicator">
		<div class="container" ref="pageWrapper">
			<div class="scroll-container" >
				<!--better-scroll滚动内容部分-->
				<div class="header">
					<div class="item"></div>
					<div class="item date"><button @click="openPicker">{{pickerValue}}</button></div>
					<div class="item selector"><button @click="optionShow">{{optionText}}</button></div>
				</div>
				<div class="completion-rate-wrap" v-if="requestResult">
					<div class="completion-rate">
						<div class="cr-title-wrap">
							<div class="title">今日完成率</div>
							<div class="sub-title">Completion rate</div>
						</div>
						<div ref="gauge" class="" style="width: 6.6rem; height: 7.07rem;"></div>
						<div class="half-pie"><span>{{compRate}}</span><span class="fh">%</span></div>
						<div class="sum">营业额：<span>{{ResultAmt}}</span>万 / 目标：<span>{{TargetValue}}</span>万</div>
					</div>
					<div class="shadow">
						<div class="left-shadow"></div>
						<div class="right-shadow"></div>
					</div>
					<div class="text-content">
						<div class="amount">
							<div class="title">客户量</div>
							<div class="sub-title">Customer quantity</div>
							<div class="row">
								<div class="item">
									<span class="num">{{ComeNum}}</span>
									<span class="label">门诊量</span>
								</div>
								<div class="item">
									<div class="num">{{FirstNum}}</div>
									<div class="label">初诊量</div>
								</div>
							</div>
						</div>
						<div class="waiting-time">
							<div class="title">等待超时量</div>
							<div class="sub-title">Waiting for timeout</div>
							<div class="row right">
								<div class="item">
									<div class="num">{{OverFifteen}}</div>
									<div class="label">15分钟</div>
								</div>
								<div class="item">
									<div class="num">{{OverThirty}}</div>
									<div class="label">30分钟</div>
								</div>
								<div class="item">
									<div class="num">{{OverFortyFive}}</div>
									<div class="label">45分钟</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="day-satis" v-if="requestResult">
					<div class="title">客户满意度</div>
					<div class="sub-title">Customer satisfaction</div>
					<div class="satis-chart" ref="satisChart" style="width: 8.15rem; height: 3.3rem; position: absolute; margin-top: -0.8rem; margin-left: -1.2rem;"></div>
				</div>
				<div class="errorTip" v-else>网络请求失败，请重试</div>
			</div>
		</div>
		<!--弹出选择器部分-->
		<transition name="optionslide">
			<div class="mt-picker-wrapper" v-show="optionVisible">
				<mt-picker class="inner" :showToolbar="toolVisible" :slots="slots" @change="onValuesChange">
					<div class="btn-wrapper">
						<div class="btn" @click="optionHide">取消</div>
						<div class="btn" @click="optionSubmit">确定</div>
					</div>
				</mt-picker>
			</div>
		</transition>
		<div class="mt-picker-mask" @click="optionHide" v-show="optionVisible"></div>
		<mt-datetime-picker @confirm="handleChange" ref="picker" v-model="nowTime" :startDate="startTm" :endDate="endTm" type="date"></mt-datetime-picker>
	</div>
</template>

<script>
	import {saveToLocal,loadFromLocal } from '../../common/js/store'
	import { Toast } from 'mint-ui';
	import echarts from 'echarts';
	import BScroll from 'better-scroll';
	import gaugeOption from './gaugeOption';
	import barOption from './barOption';
	export default {
		props: ['reqUrl'],
		data() {
			return {
				requestResult: true,
				compRate: 0,
				timeType: 1,
				slots: [{
					flex: 1,
					values: null,
					className: 'slot1',
					textAlign: 'center'
				}],
				optionVisible: false,
				toolVisible: true,
				optionText: null,
				pickerValue: null,
				nowTime: new Date(),
				compIdList: null,
				compID: null,
				compIndex: null,
				ResultAmt: null,
				TargetValue: null,
				ComeNum: null,
				FirstNum: null,
				OverFifteen: null,
				OverThirty: null,
				OverFortyFive: null
			}
		},
		created() {
			//由于异步获取数据，需要在Dom节点更新之后，初始化betterScroll
			this.$nextTick(() => {
				this._initScroll()
			})
			this.getNowDate(); 
			this.getCompList(); //从localStorage获取公司列表。
			this.compID = this.compIdList[0];
			this.requestData() //页面加载完成后，请求数据。
			
		},
		computed: {
			//时间选择器选择时间限制
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
			//vue-resource异步请求数据
			requestData() {
				var token = loadFromLocal("token","");
				var compID = this.compID;
				var timeType = this.timeType;
				var time = this.pickerValue
				var bearerToken = loadFromLocal("bearerToken","");
				var tokenType = loadFromLocal("tokenType","");
				
				this.$http.get(			
	    		this.reqUrl+"/api/Data/getToday?token="+token+"&comp_code="+compID+"&types="+timeType+"&times="+ time,
	  		).then((response)=>{
	  			//请求成功后的操作
					if(response.body.return_code===1){
						var msg = JSON.parse(response.body.return_msg);
						console.log(msg);
						this.requestResult = true;
						this.ResultAmt = msg.ResultAmt;
						this.TargetValue = msg.TargetValue;
						this.compRate = msg.Pro_TR;
						this.ComeNum = msg.ComeNum;
						this.FirstNum = msg.FirstNum;
						this.OverFifteen = msg.OverFifteen;
						this.OverThirty = msg.OverThirty;
						this.OverFortyFive = msg.OverFortyFive; 
			
						gaugeOption.series[1].data[0].value = msg.Pro_TR;
						this.initGauge();
						
						barOption.series[0].data[0].value = msg.Pro_Unsatisfy;
						barOption.series[0].data[1].value = msg.Pro_YiBan;
						barOption.series[0].data[2].value = msg.Pro_Satisfy;
						this.initBar();
					}else if(response.body.return_code === 501){
						//返回501 token失效，需重新登录
						localStorage.removeItem('__app__');
						this.$router.replace({
                path: '/login',
                query: {redirect: this.$router.currentRoute.fullPath}
            })
					}else{
						Toast(response.body.return_msg);
					}
				},(response) => {
				  // 响应错误回调操作
				  this.requestResult = false;
				});	
			},
			getCompList() {
				var compNameList = [];
				var compIdList = [];
				var compList = loadFromLocal("comp_list","");
				for(var i=0;i<compList.length;i++){
					var cpName = compList[i].comp_name;
					var cpId = compList[i].comp_code;
					compNameList.push(cpName);
					compIdList.push(cpId);
				}
				this.slots[0].values = compNameList;
				this.compIdList = compIdList;
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
			},
			_initScroll() {
				this.pageScroll = new BScroll(this.$refs.pageWrapper, {
					click: true
				})
			},
			optionShow() {
				this.optionVisible = true;
			},
			optionHide() {
				this.optionVisible = false;
			},
			optionSubmit() {
				this.requestData();
				this.optionHide();
			},
			onValuesChange(picker, values) {
				//获取当前选中值在公司数组中的下标，用下标对应修改compID的值
				//picker.setSlotValue(1, values[1]);
				this.optionText = values[0];
				this.compIndex = this.slots[0].values.indexOf(values[0]);
				this.compID = this.compIdList[this.compIndex];
				//当前选中的公司ID保存在localStorage,提供给其他组件
				saveToLocal("compID",this.compID)
			},
			//图表相关配置的方法函数
			initGauge() {
				this.$nextTick(() => {
					var gaugeDom = this.$refs.gauge;
					var gaugeChart = echarts.init(gaugeDom);
					//图表相关配置参数在gaugeOption模块文件中
					gaugeChart.setOption(gaugeOption);
				})
			},
			initBar() {
				this.$nextTick(() => {
					var barDom = this.$refs.satisChart;
					var satisChart = echarts.init(barDom);
					//图表相关配置参数在barOption模块文件中
					satisChart.setOption(barOption);
				})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.day-indicator {
		position: absolute;
		top: 0;
		bottom: 0.98rem;
		left: 0;
		right: 0;
		overflow: hidden;
		background-image: linear-gradient(-180deg, #333B5A 0%, #333B5A 10%, #5D669F 100%);
	}
	
	.container {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
	}
	
	.scroll-container {
		padding-bottom: 0.3rem;
	}
	
	.header {
		padding: 0 0.45rem;
		height: 0.88rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.header .item {
		width: 2.2rem;
		display: flex;
		justify-content: center;
		position: relative;
	}
	
	.header .item button {
		font-size: 0.3rem;
		line-height: 0.42rem;
		color: #FFFFFF;
		background-color: transparent;
		padding-right: 0.25rem;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		border: none;
		outline: none;
	}
	
	.header .item.date button {
		background-image: url(../../assets/home_nav_time@1.5x.png);
		background-repeat: no-repeat;
		background-size: 0.14rem 0.19rem;
		background-position: right 0.12rem;
	}
	
	.header .item.selector:after {
		content: "";
		position: absolute;
		display: inline-block;
		height: 0.12rem;
		width: 0.12rem;
		right: 0;
		margin-top: 0.18rem;
		margin-left: -0.12rem;
		border-width: 0 0.04rem 0.04rem 0;
		border-color: #fff;
		border-style: solid;
		transform: translateY(-50%) matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	}
	.errorTip{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 10.48rem;
		color: #FFFFFF;
	}
	.mt-picker-wrapper {
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 10;
		background-color: #FFF;
		border-top: solid 1px #eaeaea;
		transition: all 0.2s linear;
		transform: translate3d(0, 0, 0);
	}
	
	.optionslide-enter,
	.optionslide-leave-to {
		transform: translate3d(0, 100%, 0);
	}
	
	.mt-picker-mask {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		opacity: 0.5;
		background: #000;
	}
	
	.btn-wrapper {
		display: flex;
		height: 40px;
		line-height: 40px;
		border-bottom: solid 1px #eaeaea;
	}
	
	.btn-wrapper .btn {
		flex: 1;
		text-align: center;
		color: #26A2FF;
		font-size: 16px;
	}
	
	.completion-rate {
		position: relative;
		width: 6.6rem;
		height: 4.2rem;
		background-image: linear-gradient(0deg, #3D476B 0%, #6461AD 99%);
		border-radius: 0.2rem;
		color: #FFFFFF;
		margin: 0 auto;
		margin-top: 0.2rem;
		box-shadow: 0 -15px 30px 0px #3D476B inset;
	}
	
	.completion-rate .cr-title-wrap {
		position: absolute;
		top: 0.3rem;
		left: 0.3rem;
	}
	
	.completion-rate .cr-title-wrap .title {
		font-size: 0.24rem;
		line-height: 0.33rem;
		display: flex;
		align-items: center;
	}
	
	.completion-rate .cr-title-wrap .title:before {
		content: "";
		display: inline-block;
		width: 0.06rem;
		height: 0.2rem;
		background-image: linear-gradient(70deg, #817FE2 0%, #72DEE1 100%);
		border-radius: 0.05rem;
		margin-right: 0.08rem;
	}
	
	.half-pie {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 2.2rem;
		height: 1.74rem;
		border-top-left-radius: 2.2rem;
		border-top-right-radius: 2.2rem;
		background-image: linear-gradient(-180deg, #4c5284 0%, #3D476B 100%);
		text-align: center;
		font-size: 0.64rem;
		line-height: 1.5rem;
	}
	
	.half-pie span.fh {
		font-size: 0.24rem;
	}
	
	.completion-rate .sum {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0.2rem;
		margin: 0 auto;
		text-align: center;
		color: #FFFFFF;
		font-size: 0.24rem;
	}
	
	.shadow {
		width: 6.6rem;
		height: 1.2rem;
		margin: 0 auto;
		margin-top: -0.7rem;
		position: absolute;
		left: 0;
		right: 0;
		z-index: -1;
		overflow: hidden;
	}
	
	.left-shadow {
		width: 3.3rem;
		height: 1.2rem;
		margin: 0 auto;
		position: absolute;
		left: 0;
		overflow: hidden;
	}
	
	.right-shadow {
		width: 3.3rem;
		height: 1.2rem;
		margin: 0 auto;
		position: absolute;
		right: 0;
		overflow: hidden;
	}
	
	.right-shadow:after {
		content: "";
		width: 3.3rem;
		height: 1.2rem;
		background-image: linear-gradient(-180deg, #333B5A 10%, rgba(69, 78, 120, 0.00) 100%);
		position: absolute;
		right: 0;
		transform-origin: bottom right;
		transform: skew(60deg);
	}
	
	.left-shadow:before {
		content: "";
		width: 3.3rem;
		height: 1.2rem;
		background-image: linear-gradient(-180deg, #333B5A 10%, rgba(69, 78, 120, 0.00) 100%);
		position: absolute;
		left: 0;
		transform-origin: bottom right;
		transform: skew(-60deg);
	}
	
	.day-indicator .text-content {
		width: 7.05rem;
		margin-left: 0.45rem;
		margin-top: 1rem;
		font-size: 0;
		color: #FFFFFF;
	}
	
	.day-indicator .amount {
		display: inline-block;
		width: 2.78rem;
		font-size: 0.2rem;
		position: relative;
	}
	
	.day-indicator .amount:after {
		content: "";
		display: block;
		position: absolute;
		right: 0;
		top: 0.9rem;
		width: 1px;
		height: 0.6rem;
		background-color: #817EE2;
	}
	
	.day-indicator .waiting-time {
		display: inline-block;
		width: 4.27rem;
		font-size: 0.2rem;
		vertical-align: top;
	}
	
	.day-indicator .amount .title,
	.day-indicator .waiting-time .title {
		font-size: 0.24rem;
		line-height: 0.33rem;
		display: flex;
		align-items: center;
	}
	
	.day-indicator .amount .title:before {
		content: "";
		display: inline-block;
		width: 0.06rem;
		height: 0.2rem;
		background-image: linear-gradient(70deg, #AFE97D 0%, #72DEE1 100%);
		border-radius: 0.05rem;
		margin-right: 0.08rem;
	}
	
	.day-indicator .waiting-time .title:before {
		content: "";
		display: inline-block;
		width: 0.06rem;
		height: 0.2rem;
		background-image: linear-gradient(70deg, #F69887 0%, #F6D787 100%);
		border-radius: 0.05rem;
		margin-right: 0.08rem;
	}
	
	.day-indicator .amount .sub-title,
	.day-indicator .waiting-time .sub-title {
		line-height: 0.28rem;
	}
	
	.day-indicator .amount .row,
	.day-indicator .waiting-time .row {
		margin-top: 0.18rem;
		display: flex;
	}
	
	.day-indicator .amount .row {
		width: 2.8rem;
		text-align: center;
		margin-left: -0.4rem;
	}
	
	.day-indicator .row .item {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.day-indicator .item .num {
		line-height: 0.56rem;
		font-size: 0.4rem;
		font-weight: 300;
	}
	
	.day-indicator .item .label {
		font-size: 0.24rem;
		line-height: 0.24rem;
	}
	
	.day-indicator .waiting-time {
		padding-left: 0.8rem;
		box-sizing: border-box;
	}
	
	.day-indicator .waiting-time .row.right {
		width: 3.5rem;
		text-align: center;
		margin-left: -0.3rem;
	}
	
	.day-indicator .day-satis {
		width: 7.5rem;
		height: 3.8rem;
		background-image: linear-gradient(-180deg, #3F4A75 0%, #5D669F 100%);
		margin-top: 0.5rem;
		padding-left: 0.45rem;
		box-sizing: border-box;
		color: #FFFFFF;
		padding-top: 0.6rem;
	}
	
	.day-indicator .day-satis .title {
		display: flex;
		align-items: center;
		font-size: 0.24rem;
		line-height: 0.33rem;
	}
	
	.day-indicator .day-satis .title:before {
		content: "";
		display: inline-block;
		width: 0.06rem;
		height: 0.2rem;
		background-image: linear-gradient(70deg, #A57FDF 0%, #DC74B0 100%);
		border-radius: 0.05rem;
		margin-right: 0.08rem;
	}
</style>