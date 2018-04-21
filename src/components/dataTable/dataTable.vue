<template>
  <div class="table-wrap">
    <div :class="[
    {'table-header': table.TbHeaderType === 1},
    {'table-header2': table.TbHeaderType === 2}
    ]">
      <div class="Label p-left"></div>
      <div class="Label">{{table.Label1}}</div>
      <div v-show="!(timeType === 3)" class="Label">{{table.Label2}}</div>
    </div>
    <div class="table-body" v-if="table.chartType === 'line'">
      <div v-for="(tableItem,index) in table.tableList" :key="index" class="row">
        <div class="colum p-left">{{tableItem.date}}</div>
        <div class="colum">{{tableItem.thisData}}</div>
        <div v-show="!(timeType === 3)" class="colum">{{tableItem.lastData}}</div>
      </div>
    </div>
    <div class="table-body" v-else-if="table.chartType === 'pie'">
      <div v-for="(tableItem,index) in table.tableList" :key="index" class="row">
        <div class="colum p-left">{{tableItem.name}}</div>
        <div class="colum">{{tableItem.value}}</div>
        <div class="colum">{{tableItem.percent}}</div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    timeType: {
      type: Number,
      default: 1
    },
    table: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
.table-wrap{
  width: 100%;
  text-align: center;
  /* margin-bottom: 0.35rem; */
  font-size: 0.26rem;
  color: #ffffff;
}
.table-wrap .table-header{
  height: 0.6rem;
  display: flex;
  align-items: center;
  background: rgba(51,59,90,0.60);
}
.table-wrap .table-header .Label,
.table-wrap .table-header2 .Label{
  flex: 1;
}
.table-wrap .table-header2{
  height: 0.4rem;
  display: flex;
  align-items: center;
  background: #576095;;
  border-top-left-radius: 0.15rem;
  border-top-right-radius: 0.15rem;
}
.table-body .row{
  height:  0.6rem;
  display: flex;
  align-items: center;
}
.table-body .row:nth-child(odd){
  background-color: #333B5A;
}
.table-body .row:nth-child(even){
  background-color: rgba(51,59,90,0.60);
}
.table-body .row .colum{
  flex: 1;
}
.p-left{
  padding-left: 0.7rem;
  text-align: left;
}
</style>
