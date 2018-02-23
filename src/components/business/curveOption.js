import echarts from 'echarts';
export default{
	tooltip: {
	  trigger: 'axis',//'{b0}: {c0}万<br />{@yAxis}: {c1}万',
	  formatter:  function (params) {
	  	var res = '';
	  	var nyr = params[0].axisValue;
	  	var n = nyr.substr(0,4);
	  	var y = nyr.substr(5,2);
	  	var r = nyr.substr(8,2);
	  	var n2 = n-1+"";
	  	var y2 = y-1+"";
	  	var r2 = r-1+"";
	  	if(y2.length<2){
	  		y2 = "0"+y2
	  	}
	  	if(r2.length<2){
	  		r2 = "0"+r2
	  	}
  		res+= params[0].axisValue + ": " + params[0].data +"万" +"</br>";
	  	res+= n + "-" + y + "-" + r2 + ": " + params[0].data +"万" +"</br>";	
	  	return res;
		},
		axisPointer: {
	    lineStyle: {
	      color: '#fff'
	    }
	  }
	},
	legend: {
	  icon: 'rect',
	  itemWidth: 8,
	  itemHeight: 8,
	  itemGap: 13,
	  z: 1000,
	  data: ['今年','去年'],
	  right: 33,
	  bottom: 20,
	  textStyle: {
	    fontSize: "18px",
	    color: '#fff'
	  }
	},
	xAxis: {
		  type: 'category',
		  boundaryGap: false,
		  data: [],
		  axisTick: {
		  	show: true,
		  	interval: 0,
		  	lineStyle: {
		  		color: "#fff",
		  	}
			},
			axisLabel: {
		  	show: false
			},
			axisLine: {
		    lineStyle: {
		      color: '#5D669F'
		    }
		  }
	},
	yAxis: {
	  type: 'value',
	  axisTick: {
	  	show: false
		},
		axisLabel: {
	  	show: false
		},
		axisLine: {
	    lineStyle: {
	      color: '#5D669F'
	    }
	  },
	  splitLine: {
	  	show: false
	  }
	},
	series: [{
		name: "今年",
	  data: [],
	  type: 'line',
	  smooth: true,
	  symbol: 'circle',
	  symbolSize: 1,
	  showSymbol: false,
	  itemStyle: {
	    normal: {
	      color: '#F59887',
	      borderColor: 'rgba(255,255,255,0.2)',
	      borderWidth: 12
	    }
		},
		markLine: {
			label: {
				position: 'middle',
				formatter: '{@yAxis}万',
				color:'#fff'
			},
			data: [{
				yAxis: 10
			}],
			symbol: "none",
			lineStyle: {
				type: 'solid',
				color: '#8784A3'
			}
		},
		lineStyle: {
			width: 1
		},
	  areaStyle: {
	  normal: {
	      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	          offset: 0,
	          color: 'rgba(246,152,135,0.5)'
	      }, {
	          offset: 0.8,
	          color: 'rgba(246,152,135,0.1)'
	      }], false),
	      shadowColor: 'rgba(0, 0, 0, 0.1)',
	      shadowBlur: 10
	  	}
		}	        
	},{
		name: "去年",
	  data: [],
	  type: 'line',
	  smooth: true,
	  symbol: 'circle',
	  symbolSize: 1,
	  showSymbol: false,
	  itemStyle: {
	    normal: {
	      color: 'rgba(129,126,226,1)',
	      borderColor: 'rgba(255,255,255,0.2)',
	      borderWidth: 10
	      }
	  	},
	  lineStyle: {
			width: 1
		},
	  areaStyle: {
	  normal: {
	      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	          offset: 0,
	          color: 'rgba(129,126,226,1)'
	      }, {
	          offset: 0.8,
	          color: 'rgba(129,126,226,0.1)'
	      }], false),
	      shadowColor: 'rgba(0, 0, 0, 0.1)',
	      shadowBlur: 10
	  	}
		}	  
	}]
}
