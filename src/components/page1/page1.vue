<template>
	<div class="them-index">
		<comheader :isShow="headerStatu" :pageText="headerText"></comheader>
		<div class="tab">
  		<div class="item-row">
  			<div class="tab-item result">
					<router-link class="link" to="/page1/business">
						<div class="item-icon"></div>
					</router-link>
					<div class="item-text">业绩数据</div>
				</div>
				<div class="tab-item customer">
					<router-link class="link" to="/page1/client">
						<div class="item-icon"></div>
					</router-link>
					<div class="item-text">客户数据</div>
				</div>
  		</div>
			<div class="item-row">
				<div class="tab-item satisfact">
					<router-link class="link" to="/page1/satisfact">
						<div class="item-icon"></div>
					</router-link>
					<div class="item-text">满意度数据</div>
				</div>
				<div class="tab-item operate">
					<router-link class="link" to="/page1/blanktips">
						<div class="item-icon"></div>
					</router-link>
					<div class="item-text">运营数据</div>
				</div>
			</div>
			<div class="item-row">
				<div class="tab-item sale">
					<router-link class="link" to="/page1/blanktips">
						<div class="item-icon"></div>
					</router-link>
					<div class="item-text">销售数据</div>
				</div>
				<div class="tab-item money">
					<router-link class="link" to="/page1/blanktips">
						<div class="item-icon"></div>
					</router-link>
					<div class="item-text">财务数据</div>
				</div>
			</div>
  	</div>
  	<router-view :reqUrl="reqUrl"></router-view>
	</div>
</template>

<script>	
import comheader from '../header/header';

export default {
	props: ['reqUrl'],
	data: function(){
		return {
			headerStatu: false,
			headerText: "主题指数"
		}
	},
	components: {
		comheader
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.them-index{
	position: absolute;
	top: 0;
	bottom: 0.98rem;
	left: 0;
	right: 0;
	background-image: linear-gradient(-180deg, #333B5A 0%, #333B5A 10%, #5D669F 100%);
}
.them-index .tab{
	display: flex;
	flex-wrap: wrap;
  align-content: space-between;
	width: 5.5rem;
	margin: 0 auto;
	margin-top: 0.6rem;
}
.them-index .tab .item-row{
	flex: 1;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
}

.them-index .item-row .link{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 1.8rem;
	height: 1.8rem;
	background-image: linear-gradient(-180deg, #5D669F 0%, #4A5582 100%);
	box-shadow: 0 0.03rem 0.08rem 0 rgba(51,59,90,0.50), inset 0 0.03rem 0.15rem 0 rgba(129,126,226,0.50);
	border-radius: 0.6rem;
	margin-bottom: 0.2rem;
}
.them-index .item-row .item-text{
	line-height: 0.5rem;
	text-align: center;
	font-size: 0.36rem;
	color: #FFFFFF;
}
.them-index .link .item-icon{
	width: 1.4rem;
	height: 1.4rem;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}
.them-index .result .item-icon{
	background-image: url(img/index_icon_result_normal@1.5x.png);
}
.them-index .customer .item-icon{
	background-image: url(img/index_icon_customer_normal@1.5x.png);
}
.them-index .satisfact .item-icon{
	background-image: url(img/index_icon_satisfaction_normal@1.5x.png);
}
.them-index .operate .item-icon{
	background-image: url(img/index_icon_operate_disable@1.5x.png);
}
.them-index .sale .item-icon{
	background-image: url(img/index_icon_sale_disable@1.5x.png);
}
.them-index .money .item-icon{
	background-image: url(img/index_icon_money_disable@1.5x.png);
}
</style>
