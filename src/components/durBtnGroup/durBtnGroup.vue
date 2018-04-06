<template>
	<div class="durBtnGroup">
		<div class="btn-group">
			<span @click="typeToggle(0)" class="btn" :class="{'active':selectDurType===0}">日</span>
			<span @click="typeToggle(1)" class="btn" :class="{'active':selectDurType===1}">月</span>
			<span @click="typeToggle(2)" class="btn" :class="{'active':selectDurType===2}">年</span>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
		  return {
		  	selectDurType: 0
		  }
	 	},
	 	methods: {
	    typeToggle(type) {
        this.selectDurType = type;
        this.$emit("dataToggle",type);
			}
    }
	}
</script>

<style scoped>
	.durBtnGroup{
		height: 0.42rem;
		margin-bottom: 0.56rem;
	}
	.durBtnGroup .btn-group{
		line-height: 0.42rem;
		font-size: 0.3rem;
		color: #fff;
	}
	.durBtnGroup .btn-group .btn{
		display: inline-block;
		width: 0.5rem;
		text-align: center;
		margin-left: 0.15rem;
	}
	.durBtnGroup .btn-group .btn.active:after{
		content: "";
		display: block;
		width: 100%;
		height: 0.1rem;
		background-image: url(img/sign_result_time@1.5x.png);
		background-size: 0.33rem 0.08rem;
		background-repeat: no-repeat;
		background-position: center;
	}
</style>
