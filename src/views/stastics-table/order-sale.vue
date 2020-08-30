<template>
  <div class="app-container">
    <sticky :z-index="10" :class="'sub-navbar'">
      <el-cascader style='min-width:310px;margin-right: 5px;'
      	:options="optionsForMulti"
      	:props="propsForMulti"
      	collapse-tags
      	clearable
        placeholder="投放人/站点"
      	v-model="condition.advertiserShopIds">
      </el-cascader>
      <el-select v-model="condition.targetMarket" clearable placeholder="地区" style='margin-right: 5px;'>
        <el-option v-for="item in optionsForShopArea" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-date-picker style='margin-right: 5px;' v-model="condition.time" type="daterange" align="right" unlink-panels
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
      </el-date-picker>
      <el-tooltip class="item" effect="dark" content="查询" placement="right-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="reloadChart"></el-button>
      </el-tooltip>
    </sticky>
    <div class="chart-container">
      <line-chart width="100%" height="100%" :dataColor="chartDataColor" :legends="chartLegends" :xData="chartXData" :yData="chartYData"></line-chart>
    </div>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件
  import LineChart from '@/components/Charts/LineChart'
  import {
    shopList
  } from '@/api/shopService'
  import {
    saleStatistic
  } from '@/api/orderService'
  import '@/utils/date'

  export default {
    name: 'OrderSaleChart',
    components: {
      Sticky,LineChart
    },
    filters: {},
    data() {
      return {
        loading: false,
        condition: {
          time: [],
          targetMarket: null,
          advertiserShopIds: []
        },
        optionsForShopArea: [],
        //多选
        propsForMulti: {
          multiple: true
        },
        optionsForMulti: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              var now = new Date();
              var start = new Date().setDate(now.getDate() - 7);
              start = new Date(start);
              var end = new Date().setDate(now.getDate() - 1);
              end = new Date(end);
              picker.$emit('pick', [start.format('yyyy-MM-dd'), end.format('yyyy-MM-dd')]);
            }
          }, {
            text: '最近15天',
            onClick(picker) {
              var now = new Date();
              var start = new Date().setDate(now.getDate() - 15);
              start = new Date(start);
              var end = new Date().setDate(now.getDate() - 1);
              end = new Date(end);
              picker.$emit('pick', [start.format('yyyy-MM-dd'), end.format('yyyy-MM-dd')]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              var now = new Date();
              var start = new Date().setDate(now.getDate() - 30);
              start = new Date(start);
              var end = new Date().setDate(now.getDate() - 1);
              end = new Date(end);
              picker.$emit('pick', [start.format('yyyy-MM-dd'), end.format('yyyy-MM-dd')]);
            }
          }],
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        },
        chartDataColor:['RED','ORANGE','#0000FF','#00CED1'],
        chartLegends:['本期下单量','本期销售量','上月同期下单量','上月同期销售量'],
        chartXData:[],
        chartYData:[],
      }
    },
    beforeMount() {
      this.$set(this.condition, 'time', this.initTime);
    },
    mounted() {
      this.loadShops();
    },
    computed: {
      initTime() {
        var now = new Date();
        var start = new Date().setDate(now.getDate() - 7);
        start = new Date(start);
        var end = new Date().setDate(now.getDate() - 1);
        end = new Date(end);
        return [start.format('yyyy-MM-dd'), end.format('yyyy-MM-dd')];
      },
    },
    methods: {
      loadShops() {
        let that = this;
        shopList().then(
          res => {
            var shops = res;
            var optionsForShopArea = [];
            var optionsForMulti = [];
            var advertisers = [];
            for (var shop of shops) {
              if (typeof shop.advertiser != "undefined") {
                var idx = advertisers.indexOf(shop.advertiser);
                if (idx < 0) {
                  advertisers.push(shop.advertiser);
                  var mutilOption = {};
                  mutilOption.value = 'null';
                  mutilOption.label = shop.advertiser;
                  mutilOption.children = [];
                  var obj = {};
                  obj.value = shop.id;
                  obj.label = shop.name;
                  mutilOption.children.push(obj);
                  optionsForMulti.push(mutilOption);
                } else {
                  var obj = {};
                  obj.value = shop.id;
                  obj.label = shop.name;
                  optionsForMulti[idx].children.push(obj);
                }
              }
              if (typeof shop.targetMarket != "undefined" && optionsForShopArea.indexOf(shop.targetMarket) < 0) {
                optionsForShopArea.push(shop.targetMarket)
              }
            }
            that.$set(that, 'optionsForShopArea', optionsForShopArea);
            that.$set(that, 'optionsForMulti', optionsForMulti);
            that.reloadChart();
          },
          err => {
            console.log(err)
          })
      },
      reloadChart(){
      	var advertiserShopIds = this.condition.advertiserShopIds;
      	var shopIds = [];
      	//去除分组的值
      	for(var advertiserShopId of advertiserShopIds){
      		shopIds.push(advertiserShopId[1]);
      	}
      	var data = {
      		start: this.condition.time[0],
      		end: this.condition.time[1],
      		shopIds:shopIds,
      		targetMarket: this.condition.targetMarket,
      	}
        let that = this;
        that.loading = true
      	saleStatistic(data).then(
          res=>{
            that.loading = false
            var myChart = that.chart;
            //echart赋值
            that.$set(that,"chartXData",res.coordinates);
            that.$set(that,"chartYData",res.datas);
          },
          err=>{
            that.loading = false
            console.log(err);
          }
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  //全局？TODO
  //navbar:50,sub-navbar:48,padding:20. 50+48+40
  .chart-container{
    padding-top: 10px;
    position: relative;
    width: 100%;
    height: calc(100vh - 138px);
  }

  ::v-deep .el-loading-mask{
    border-radius: 50%;
  }

</style>
