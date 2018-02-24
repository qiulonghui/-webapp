import echarts from 'echarts';
var aacolor = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
					offset: 0,
					color: '#70E5E0'
				}, {
					offset: 1,
					color: '#817EE2'
				}]); 
//var bbcolor = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
//					offset: 0,
//					color: '#4c5284'
//				}, {
//					offset: 1,
//					color: '#424973'
//				}]); 				
export default{
	tooltip: {
			formatter:"{a} <br/>{b} : {c}%"
    },
    grid:{
        width:200,
        height:95
    },
    series: [{
        name: '外围刻度',
        type: 'gauge',
        radius: '75%',
        center: ['50%', '50%'],
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          lineStyle: {
            width:3,
            color:[[1,'#676faa']]
          },
        },
        splitLine: {
            length: -4,
            lineStyle:{
                color:'#F69887',
                width:1
            }
        },
        axisLabel: {
            show:false
        },
        axisTick:{
            splitNumber:1,
            lineStyle:{
                opacity:0,
            }
        },
        detail:{
            show:false
        },
        pointer:{
            show:false
        }

    },{
        name: '内层数据刻度',
        type: 'gauge',
        radius: '72%',
        center: ['50%', '50%'],
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          lineStyle: {
              opacity:0
          },
        },
        splitLine: {
          length: 12,
          lineStyle: {
          	width: 1,
          	color: "#fff"
          }
        },
        axisLabel: {
        distance: -46,
        color:'#fff',
        fontSize:12,
        formatter:function(param){
            if ((param % 50)===0) {
                return param
            }
          }
        },
        detail: {
            show: false,
            formatter: '{value}%',
            color:'#fff',
            fontSize: 32,
            backgroundColor: "red",
            offsetCenter: [0, "-10px"]
        },
        itemStyle:{
          normal:{
              color:'#70E5E0'
          }
        },
        pointer:{
            width:5,
            length:'86%'
        },
        data: [{
            value: 0
        }]
    },{
        name: '最内层线',
        type: 'gauge',
        radius: '35%',
        center: ['50%', '50%'],
        startAngle: 180,
        endAngle: 0,
        axisLine: {
            lineStyle: {
                width:6,
                color:[[1,aacolor]]
            },
        },
        splitLine: {
            length: -6,
            lineStyle:{
                opacity:0
            }
        },
        axisLabel: {
            show:false
        },
        axisTick:{
            splitNumber:1,
            lineStyle:{
                opacity:0,
            }
        },
        detail:{
            show:false
        },
        pointer:{
            show:false
        }		
     }
//      name: '饼图',
//      tooltip:{
//          show:false
//      },
//      type: 'pie',
//      radius: ['0%', '34%'],
//      data: [{
//      	value: 50
//      }],
//      hoverAnimation:false,
//      itemStyle:{
//          normal:{
//              color: bbcolor
//          }
//      },
//      labelLine:{
//          normal:{
//              show:false
//          }
//      },
//      animation:false,
//      data: [1]
//    
  ]
}
