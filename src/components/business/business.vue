<template>
	<div class="business">
		<div class="main-container" ref="pageWrapper">
			<div class="scroll-container">
				<!--better-scroll滚动内容部分-->
				<comheader></comheader>
				<div class="selectorbar">
					<span class="picker-btn" @click="openPicker">{{pickerValue}}</span>
					<div class="btn-group">
						<span @click="typeDurToggle(0)" class="btn" :class="{'active':selectDurType===0}">日</span>
						<span @click="typeDurToggle(1)" class="btn" :class="{'active':selectDurType===1}">月</span>
						<span @click="typeDurToggle(2)" class="btn" :class="{'active':selectDurType===2}">年</span>
					</div>
				</div>
				<div class="volume" v-if="requestResult">
					<div class="text-content">
						<div class="actual">
							<div class="num"><span>{{ResultAmt}}</span>万</div>
							<div class="label">实际营业额</div>
						</div>
						<div class="aims">
							<div class="num"><span>{{TargetValue}}</span>万</div>
							<div class="label">目标营业额</div>
						</div>
					</div>
					<div class="progress">
						<div class="inner" :style="{width: barLen + 'rem'}">
							<span class="percent" >{{Pro_TR}}%</span>
						</div>
					</div>
					<div v-show="isChart" class="volume-curve" ref="curve" style="width: 8.2rem; height: 5rem;"></div>
          <div v-show="!isChart" class="table" style="margin-top:0.5rem;margin-bottom:0.35rem">
            <dataTable :table="table1" :timeType="timeType"></dataTable>
          </div>
				</div>
				<div class="container" v-if="requestResult">
					<div class="tab">
						<div @click="typeToggle(0)" class="tab-item" :class="{'active':selectType===0}">科室业绩</div>
						<div @click="typeToggle(1)" class="tab-item" :class="{'active':selectType===1}">客户来源业绩</div>
					</div>
					<div class="content">
						<div v-show="isChart" class="pie" ref="pie" style="width: 6.9rem;height: 5.3rem;"></div>
            <dataTable v-show="!isChart" :table="table2" style="margin-top:0.3rem;"></dataTable>
					</div>
				</div>
				<div class="errorTip" v-else>网络请求失败，请重试</div>
			</div>
		</div>
		<mt-datetime-picker @confirm="handleChange" ref="picker" v-model="nowTime" :startDate="startTm" :endDate="endTm" type="date"></mt-datetime-picker>
    <chartToggleButton @toggle="toggle"></chartToggleButton>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
  import echarts from 'echarts';
	//import { Navbar, TabItem } from 'mint-ui';
	import comheader from '../header/header';
	import {saveToLocal,loadFromLocal } from '../../common/js/store';
	import pieOption from './pieOption';
	import curveOption from './curveOption';
  import { Toast } from 'mint-ui';
  import chartToggleButton from '../chartToggleButton/chartToggleButton';
  import {toggleChart} from '../../common/js/global';
  import dataTable from '../dataTable/dataTable';
  import {arrModify,toolTip} from '../../common/js/common';

	export default {
		props: ['reqUrl'],
		data (){
			return {
				requestResult: true,
				ResultAmt: "",
				TargetValue: "",
				Pro_TR: "",
				barLen: 0,
				selectType: 0,
				pickerValue: '',
		  	selectDurType: 0,
		  	nowTime: new Date(),
		  	timeType: 1,
		  	pickerValue: null,
        Dept_list: null,
        DeptList2: null,
        InfoSource_list2: null,
		  	pieName: "科室业绩",
        isChart: toggleChart.isChart,
        table1: {
          chartType: 'line',
          TbHeaderType: 2,
          Label1: "当年",
          Label2: "上年",
          tableList: []
        },
        table2: {
          chartType: 'pie',
          TbHeaderType: 1,
          Label1: "营业额",
          Label2: "百分比",
          tableList: []
        }
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
	    		this.reqUrl+"/api/Data/getScore?token="+token+"&comp_code="+compID+"&types="+timeType+"&times="+ time,
	  		).then((response)=>{
	  			//成功后的回调
					if(response.body.return_code===1){
						var msg = JSON.parse(response.body.return_msg);
						console.log(msg);
						this.requestResult = true;
						this.ResultAmt = msg.ResultAmt;
						this.TargetValue = msg.TargetValue;
						this.Pro_TR = msg.Pro_TR;
						this.barLen = ((msg.Pro_TR/100)*6.6).toFixed(2);

						if(!msg.SevenThis_list){
							var initThisList = [];
						}else{
							initThisList = msg.SevenThis_list;
            }
						if(!msg.SevenLast_list){
							var initLastList = [];
						}else{
							initLastList = msg.SevenLast_list;
						}
						var thisDataList = [];
						var lastDataList = [];
            var dateList = [];
            var tableList = [];

						for (var i=0; i<initThisList.length; i++) {
							var thisItem = initThisList[i]["ResultAmt"];
							var dateItem = initThisList[i]["ResultDate"];
							thisDataList.push(thisItem);
              dateList.push(dateItem);
              if(!initLastList[i]){
                lastDataList.push('');
              }else{
                var lastItem = initLastList[i]["ResultAmt"];
                lastDataList.push(lastItem);
              }
              var table = {};
              table.date = dateList[i];
              table.thisData = thisDataList[i] + "万";
              table.lastData = lastDataList[i] + "万";
              tableList.push(table);
						}

            //设置营业额表数据
            this.table1.tableList = tableList;

            //设置曲线图数据
						curveOption.series[0].data = thisDataList;
						curveOption.series[1].data = lastDataList;
						curveOption.series[0].markLine.data[0].yAxis = msg.TargetValue;
						curveOption.xAxis.data = dateList;

						// var selectYear = this.pickerValue.substr(0,4);
						// var selectLastYear = selectYear - 1;
            toolTip(timeType,curveOption,initLastList);
						this.initCurve();

						if(!msg.Dept_list){
							var DeptList = [];
							this.Dept_list = DeptList;
						}else{
							DeptList = msg.Dept_list;
              this.Dept_list = DeptList;
              //将返回的数组数据进行修改，用于显示饼图表的数据
              var DeptList2 = arrModify(DeptList,"万");
              //保存在this.DeptList2，用于切换
              this.DeptList2 = DeptList2;
            }

            //设置piechart的配置
						pieOption.series[0].data = DeptList.sort(function (a, b) { return b.value - a.value; });
            pieOption.series[0].name = this.pieName;

            //设置科室业绩表数据
            this.table2.tableList = DeptList2;

						if(!msg.InfoSource_list){
							this.InfoSource_list = [];
						}else{
              this.InfoSource_list = msg.InfoSource_list;
              //将返回的数组数据进行修改，用于显示饼图表的数据
              var InfoSource_list2 = arrModify(this.InfoSource_list,"万");
              //保存在this.InfoSource_list2，用于切换
              this.InfoSource_list2 = InfoSource_list2;
            }

						this.initPie();

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
				  //this.requestResult = false;
				});
			},
			initCurve() {
				//初始化曲线图表
				//图表相关配置参数在curveOption模块文件中
				this.$nextTick(()=>{
					var curveDom = this.$refs.curve;
					var curveChart = echarts.init(curveDom);
					curveChart.setOption(curveOption);
				})
			},
			initPie() {
				//初始化饼图图表
				//图表相关配置参数在pieOption模块文件中
				this.$nextTick(()=>{
					var pieDom = this.$refs.pie;
					var pieChart = echarts.init(pieDom);
					pieChart.setOption(pieOption);
				})
			},
			typeDurToggle(type) {
				this.selectDurType = type;
				this.timeType = type+1;
				this.requestData();
				this.selectType = 0;
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
	    },
	    typeToggle(type) {
	    	//业绩来源饼图类型切换函数
	    	var pieDom = this.$refs.pie;
				var pieChart = echarts.init(pieDom);
				this.selectType = type;
				if(type === 0){
					this.pieName="科室业绩";
					pieOption.series[0].data = this.Dept_list.sort(function (a, b) { return b.value - a.value; });
          pieOption.series[0].name = this.pieName;
          this.table2.tableList = this.DeptList2;
					pieChart.setOption(pieOption);
				}else if(type === 1){
					this.pieName="客户来源业绩";
					pieOption.series[0].data = this.InfoSource_list.sort(function (a, b) { return b.value - a.value; });
          pieOption.series[0].name = this.pieName;
          this.table2.tableList = this.InfoSource_list2;
					pieChart.setOption(pieOption);
				}
      },
      toggle(state) {
        this.isChart = state;
      }
		},
		components: {
      comheader,
      chartToggleButton,
      dataTable
		}
	}
</script>

<style scoped>
.business{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	overflow: hidden;
	background-image: linear-gradient(-180deg, #333B5A 0%, #333B5A 10%, #5D669F 100%);
	z-index: 2;
}
.selectorbar{
	height: 0.42rem;
	padding: 0 0.45rem;
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.5rem;
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
.errorTip{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 10.48rem;
	color: #FFFFFF;
}
.selectorbar .btn-group{
	line-height: 0.42rem;
	font-size: 0.3rem;
	color: #fff;
	text-align: center;
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
.business .main-container{
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}
.business .volume{
	width: 6.6rem;
	margin: 0 auto;
}
.business .text-content{
	display: flex;
	justify-content: space-between;
	color: #FFFFFF;
}
.business .actual .num{
	font-size: 0.6rem;
	line-height: 0.65rem;
}
.business .actual .label{
	display: flex;
	align-items: center;
	line-height: 0.33rem;
	font-size: 0.24rem;
}
.business .actual .label:before{
	content: "";
  display: inline-block;
  width: 0.06rem;
  height: 0.2rem;
  background-image: linear-gradient(70deg, #817FE2 0%, #72DEE1 100%);
  border-radius: 0.05rem;
  margin-right: 0.16rem;
}
.business .aims{
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}
.business .aims .num{
	font-size: 0.24rem;
	line-height: 0.29rem;
	text-align: right;
}
.business .aims .label{
	display: flex;
	align-items: center;
	font-size: 0.24rem;
	line-height: 0.33rem;
}
.business .aims .label:before{
	content: "";
  display: inline-block;
  width: 0.06rem;
  height: 0.2rem;
  background-image: linear-gradient(70deg, #AFE97D 0%, #72DEE1 100%);
  border-radius: 0.05rem;
  margin-right: 0.16rem;
}
.business .progress{
	width: 6.6rem;
	height: 0.2rem;
	background: #333B5A;
	margin-top: 0.2rem;
	border-top-right-radius: 0.2rem;
	border-bottom-right-radius: 0.2rem;
}
.business .progress .inner{
	position: relative;
	display: inline-block;
	width: 0;
	max-width: 100%;
	height: 0.2rem;
	background-image: linear-gradient(-90deg, #817FE2 0%, #72DEE1 100%);
	border-top-right-radius: 0.2rem;
	border-bottom-right-radius: 0.2rem;
}
.business .progress .percent{
	position: absolute;
	right: -0.2rem;
	top: 0.25rem;
	color: #fff;
	font-size: 0.2rem;
}
.business .table{
  min-height: 3.37rem;
}
.business .volume-curve{
	margin-left: -0.8rem;
	margin-top: -0.76rem;
}
.business .container{
	width: 6.6rem;
	min-height: 5.51rem;
	margin: 0 auto;
	background-image: linear-gradient(-180deg, #5D669F 0%, #414B73 100%);
	border-top-left-radius: 0.25rem;
	border-top-right-radius: 0.25rem;
}
.business .tab{
	position: relative;
	z-index: 2;
	display: flex;
	height: 1rem;
	background-image: linear-gradient(-90deg, rgba(129,127,226,0.3) 0%, rgba(114,222,225,0.3) 100%);
	background-repeat: no-repeat;
	background-size: 100% 2px;
	background-position: left bottom;
}
.business .tab .tab-item{
	position: relative;
	flex: 1;
	font-size: 0.3rem;
	line-height: 1.2rem;
	color: #fff;
	text-align: center;
}
.business .tab .tab-item.active:after{
	position: absolute;
	left: 0;
	right: 0;
	bottom: -0.03rem;
	content: "";
	display: block;
	width: 1rem;
	height: 0.1rem;
	background-image: linear-gradient(-90deg, #817FE2 0%, #72DEE1 100%);
	border-radius: 25px;
	margin: 0 auto;
}
.business .container .pie{
	margin-top: -0.78rem;
	margin-left: -0.3rem;
}

</style>
