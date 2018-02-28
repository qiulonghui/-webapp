export default{
	tooltip : {
	    trigger: 'item',
	    position: "inside",
	    formatter: "{a} <br/>{b} : {c}万 ({d}%)"
	},
	color:['#7a7ce0','#8298e3','#7bafde','#7acae1','#70e5df'],
	series : [
	    {
	        name:'访问来源',
	        type:'pie',
	        radius : '56%',
	        center: ['50%', '52%'],
	        data:[].sort(function (a, b) { return a.value - b.value; }),
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