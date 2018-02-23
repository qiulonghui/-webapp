<template>
	<div class="blanktips">
		<comheader :pageText="headerText"></comheader>
		<img class="tip-pic" src="./img/pic_no_inf@1.5x.png"/>
		<div class="text">抱歉，暂未添加信息</div>
	</div>
</template>

<script>
	import comheader from '../header/header';
	export default {
		data: function(){
			return {
				headerText: "运营数据"
			}
		},
		components: {
			comheader
		}
	}
</script>

<style scoped>
	.blanktips{
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
	.blanktips .tip-pic{
		display: block;
		width: 4rem;
		height: 3.5rem;
		margin: 0 auto;
		margin-top: 1.67rem;
		margin-bottom: 0.24rem;
	}
	.blanktips .text{
		text-align: center; 
		line-height: 0.42rem;
		font-size: 0.3rem;
		color: #FFFFFF;
	}
</style>