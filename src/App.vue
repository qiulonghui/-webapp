<template>
  <div id="app">
  	<div class="tab">
  		<div class="tab-item index">
				<router-link to="/page1">
					<div class="tab-icon"></div>
					<div class="tab-text">主题指数</div>
				</router-link>
			</div>
			<div class="tab-item zb">
				<router-link to="/page2">
					<div class="zb-wrap">
						<div class="tab-icon"></div>
						<div class="tab-text">今日指标</div>
					</div>
				</router-link>
			</div>
			<div class="tab-item me">
				<router-link to="/page3">
					<div class="tab-icon"></div>
					<div class="tab-text">个人中心</div>
				</router-link>
			</div>		
  	</div>
    <transition name="slide">
    	<keep-alive>
				<router-view  :reqUrl="reqUrl"></router-view>
			</keep-alive>	
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
  	return {
  		reqUrl: "http://119.23.160.41:3292"           //测试地址http://app.fssgjz.cn:2692
  	}
  },//data闭合
  
}
</script>

<style scoped>
#app{
	font-size: 12px;
	background-color: #fff;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-image: linear-gradient(-180deg, #333B5A 0%, #333B5A 10%, #5D669F 100%);
}
#app .tab{
	position: fixed;
	z-index: 1;
	bottom: 0;
	display: flex;
	width: 7.5rem;
	height: 0.98rem;
	font-size: 0.22rem;
	background: #4C5785;
}
.tab .tab-item{
	height: 0.98rem;
	text-align: center;
	flex: 1;
}
.tab .tab-item .tab-icon{
	width: 0.54rem;
	height: 0.54rem;
	margin: 0.05rem auto 0 auto;
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
}
.tab .tab-item.index .tab-icon{
	background-image: url(components/page2/img/home_tab_index_normal@1.5x.png);
}
.tab .tab-item.zb .tab-icon{
	background-image: url(components/page2/img/home_tab_indicator_normal@1.5x.png);
}
.tab .tab-item.me .tab-icon{
	background-image: url(components/page2/img/home_tab_me_normal@1.5x.png);
}
.tab .tab-item .tab-text{
	line-height: 0.28rem;
}
.tab .zb .zb-wrap{
	position: absolute;
	right: 0;
	left: 0;
	height: 1.2rem;
	width: 1.2rem;
	border-radius: 50%;
	margin: 0 auto;
	margin-top: -0.3rem;
	background: #4C5785;
}
.tab .zb-wrap .tab-icon{
	width: 0.76rem;
	height: 0.76rem;
	margin-top: 0.1rem;
	margin-bottom: 0.04rem;
}
.tab .tab-item a{
	color: #817EE2;
}
.tab .tab-item .router-link-active{
	color: #70E5E0;
}
.tab .tab-item.index .router-link-active .tab-icon{
	background-image: url(components/page2/img/tab_index_highlighted@1.5x.png);
}
.tab .tab-item.zb .router-link-active .tab-icon{
	background-image: url(components/page2/img/home_tab_indicator_highlighted@1.5x.png);
}
.tab .tab-item.me .router-link-active .tab-icon{
	background-image: url(components/page2/img/home_tab_me_highlighted@1.5x.png);
}
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s linear;
	transform: translate3d(0,0,0);
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%,0,0);
}
</style>
