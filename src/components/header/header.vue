<template>
	<div class="header">
		<i @click.once="_backPage" v-show="isShow" class="back"></i>
		<div class="text">{{pageText}}</div>
	</div>
</template>

<script>
	export default {
		props: {
			isShow: {
				default: true
			},
			pageText:{
				default: "业绩数据"
			}
		},
		methods: {
			_backPage() {
				this.$router.go(-1)
			}
		}
	}
</script>

<style scoped>
	.header{
		height: 0.88rem;
		line-height: 0.88rem;
		padding: 0 0.3rem;
	}
	.header .back{
		position: absolute;
		display: inline-block;
		width: 0.5rem;
		height: 0.5rem;
		margin-top: 0.19rem;
		background-image: url(img/icon_return@1.5x.png);
		background-repeat: no-repeat;
		background-size: 0.16rem 0.26rem;
		background-position: center;
	}
	.header .text{
		font-size: 0.3rem;
		height: 0.88rem;
		line-height: 0.88rem;
		text-align: center;
		color: #FFFFFF;
	}
</style>