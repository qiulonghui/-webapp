<template>
  <div @click="toggleType" class="toggle-btn">{{toggleText}}</div>
</template>

<script>
import {toggleChart} from '../../common/js/global';
export default {
  data() {
    return{
      toggleText: toggleChart.isChart? "切换表" : "切换图"
    }
  },
  methods: {
    toggleType() {
      toggleChart.change()
      var dispType = toggleChart.isChart
      this.toggleText = dispType ? "切换表" : "切换图"
      this.$emit('toggle',dispType)
    }
  }
}
</script>

<style scoped>
   .toggle-btn{
    width: 1.23rem;
    height: 0.7rem;
    line-height: 0.75rem;
    text-align: center;
    font-size: 0.3rem;
    position: fixed;
    top: 55.2%;
    right: 0;
    color: #ffffff;
    background-image: -webkit-linear-gradient(-47deg, #817FE2 0%, #72DEE1 100%);
    background-image: linear-gradient(-47deg, #817FE2 0%, #72DEE1 100%);
    box-shadow: 0 6px 16px 0 rgba(50,61,103,0.79);
    border-top-left-radius: 0.35rem;
    border-bottom-left-radius: 0.35rem;
  }
</style>
