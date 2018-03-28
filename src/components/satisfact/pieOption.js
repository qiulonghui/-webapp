export default{
	tooltip : {
      trigger: 'item',
      position: "inside",
      formatter: "{a} <br/>{b} : {c}人 ({d}%)"
  },
	color:['#70E5E0','#78D4E1','#7DC3E1','#80B2E2','#82A1E2','#8298E2','#817EE2'],
  series : [
      {
          name:'满意度数据',
          type:'pie',
          startAngle: 60,
	        clockwise: false,
          radius : '42%',
          center: ['47%', '50%'],
          data:[].sort(function (a, b) { return b.value - a.value; }),
          label: {
              color: 'rgba(255, 255, 255, 1)',               
              formatter: "{b}: {c}人"
          },
          labelLine: {
              normal: {
                  lineStyle: {
                      color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 5,
                  length2: 8
              }
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
              return Math.random() * 200;
          }
      }
  ]
}