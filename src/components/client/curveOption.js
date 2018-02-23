import echarts from 'echarts';
export default{
	tooltip: {
    trigger: 'axis',
    formatter: '{b}<br />{a0}: {c0}人<br />{a1}: {c1}人',
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
    data: ['复诊量','初诊量'],
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
    },
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
  	name: "初诊量",
    data: [],
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 1,
    showSymbol: false,
    itemStyle: {
      normal: {
        color: '#70E5E0',
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
            color: 'rgba(112,229,224,1)'
        }, {
            offset: 0.8,
            color: 'rgba(112,229,224,0.1)'
        }], false),
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10
    	}
		}	
  },{
  	name: "复诊量",
    data: [],
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 1,
    showSymbol: false,
    itemStyle: {
      normal: {
        color: '#E5DE70',
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 12
      }
  	},
  	lineStyle: {
  		width: 1
  	},
    areaStyle: {
    normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(229,222,112,0.5)'
        }, {
            offset: 0.8,
            color: 'rgba(229,222,112,0.1)'
        }], false),
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10
    	}
		}	        
  }]
}