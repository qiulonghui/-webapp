export default{
	tooltip : {
      trigger: 'item',
      position: "inside",
      formatter: "{a} <br/>{b} : {c}人 ({d}%)"
  },
	color:['#7a7ce0','#7acae1','#70e5df'],
  series : [
      {
          name:'满意度数据',
          type:'pie',
          radius : '55%',
          center: ['47%', '50%'],
          data:[].sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
              normal: {
                  textStyle: {
                      color: 'rgba(255, 255, 255, 1)'
                  }
              }
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