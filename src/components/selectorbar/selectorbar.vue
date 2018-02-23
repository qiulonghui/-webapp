<template>
	<div class="selectorbar">
		<span class="picker-btn" @click="openPicker">{{pickerValue}}</span>
		<div class="btn-group">
			<span @click="typeToggle(0)" class="btn" :class="{'active':selectDurType===0}">日</span>
			<span @click="typeToggle(1)" class="btn" :class="{'active':selectDurType===1}">月</span>
			<span @click="typeToggle(2)" class="btn" :class="{'active':selectDurType===2}">年</span>
		</div>
		<mt-datetime-picker  @confirm="handleChange" ref="picker" type="date"></mt-datetime-picker>
	</div>
</template>

<script>
	export default {
		data() {
		  return {
		  	pickerValue: '',
		  	selectDurType: 0
		  }
	 	},
	 	created() {
			this.getNowDate();
		},
	 	methods: {
			getNowDate() {
				var oDate = new Date();
				var nowDate = oDate.getFullYear() + '.' + (oDate.getMonth() + 1) + '.' + oDate.getDate();
				this.pickerValue = nowDate
			},
			openPicker(picker) {
	      this.$refs.picker.open();
	    },
	    handleChange(value){  	
	     	var d = new Date(value.toString());
				var date = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
				this.pickerValue = date;
	    },
	    typeToggle(type) {
				this.selectDurType = type;
			}
    }
	}
</script>

<style scoped>
	.selectorbar{
		height: 0.42rem;
		padding: 0 0.45rem;
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.56rem;
	}
	.picker-btn{
		line-height: 0.42rem;
		color: #FFFFFF;
		font-size: 0.3rem;
		background-image: url(../../assets/home_nav_time@1.5x.png);
		background-repeat: no-repeat;
    background-size: 0.14rem 0.19rem;
    background-position: right 0.1rem;
    padding-right: 0.25rem;
	}
	.selectorbar .btn-group{
		line-height: 0.42rem;
		font-size: 0.3rem;
		color: #fff;	
	}
	.selectorbar .btn-group .btn{
		display: inline-block;
		width: 0.33rem;
		text-align: center;
		margin-left: 0.4rem;
	}
	.selectorbar .btn-group .btn.active:after{
		content: "";
		display: block;
		width: 100%;
		height: 0.1rem;
		background-image: url(img/sign_result_time@1.5x.png);
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
</style>