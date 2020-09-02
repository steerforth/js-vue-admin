<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-select v-model="condition.checkResult" @change="getList">
        <el-option v-for="item in optionsForCheckResult" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="condition.targetMarket" clearable placeholder="地区" @change="getList">
        <el-option v-for="item in optionsForShopArea" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select v-model="condition.shopOwner" clearable placeholder="店铺所属" @change="getList">
        <el-option v-for="item in optionsForShopOwner" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select v-model="condition.advertiser" clearable placeholder="投放人" @change="getList">
        <el-option v-for="item in optionsForAdvertiser" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-date-picker v-model="condition.time" type="datetimerange" align="right"
        unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['09:00:00','09:00:00']"
        value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" @change="getList">
      </el-date-picker>
    </sub-navbar>
    <el-table ref="table" v-loading="loading" :data="tableData" :row-class-name="tableRowClassName" :height="tableHeight" border style="width:100%;">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="goodsName" label="产品名称" width=300 align="center">
      </el-table-column>
      <el-table-column prop="skuCode" label="skuCode" align="center">
      </el-table-column>
      <el-table-column prop="sum" label="销售/下单量" align="center" ssortable>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    shopList
  } from '@/api/shopApi'
  import {
    itemList
  } from '@/api/orderItemApi'
  import '@/utils/date'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'

  export default {
    name: 'OrderSaleChart',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        condition: {
          time: [],
          checkResult: 1,
          shopOwner: null,
          advertiser: null,
          targetMarket: null
        },
        optionsForCheckResult:[{label:'销售排行',value:1},{label:'下单排行',value:-1}],
        optionsForShopArea: [],
        optionsForShopOwner: [],
        optionsForAdvertiser: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              var end = new Date();
              end.setHours(9);
              end.setMinutes(0);
              end.setSeconds(0);
              var start = new Date(end);
              start.setDate(end.getDate() - 7);
              picker.$emit('pick', [start.format('yyyy-MM-dd HH:mm:ss'), end.format('yyyy-MM-dd HH:mm:ss')]);
            }
          }, {
            text: '最近15天',
            onClick(picker) {
             var end = new Date();
             end.setHours(9);
             end.setMinutes(0);
             end.setSeconds(0);
             var start = new Date(end);
             start.setDate(end.getDate() - 15);
             picker.$emit('pick', [start.format('yyyy-MM-dd HH:mm:ss'), end.format('yyyy-MM-dd HH:mm:ss')]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              var end = new Date();
              end.setHours(9);
              end.setMinutes(0);
              end.setSeconds(0);
              var start = new Date(end);
              start.setDate(end.getDate() - 30);
              picker.$emit('pick', [start.format('yyyy-MM-dd HH:mm:ss'), end.format('yyyy-MM-dd HH:mm:ss')]);
            }
          }],
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        },
        tableData: [],
        tableHeight: DEFAULT_TABLE
      }
    },
    beforeMount() {
      this.$set(this.condition, 'time', this.initTime);
    },
    mounted() {
      this.$nextTick(() => {
        this.handleResize()
      })
      window.addEventListener('resize', this.handleResize)
      this.loadShops();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    computed: {
      initTime() {
        var end = new Date();
        end.setHours(9);
        end.setMinutes(0);
        end.setSeconds(0);
        var start = new Date(end);
        start.setDate(end.getDate() - 7);
        return [start.format('yyyy-MM-dd HH:mm:ss'), end.format('yyyy-MM-dd HH:mm:ss')];
      },
    },
    methods: {
      handleResize(){
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR -
          PADDING_BOTTOM);
      },
      getList(){
      	// $('.container').scrollTop(0);
      	if(this.condition.time == null){
      		this.$message({
      		  message: '请选择时间',
      		  type: 'warning'
      		});
      		return;
      	}
      	var data = {
      		end: this.condition.time[1],
      		start: this.condition.time[0],
      		shopOwner: this.condition.shopOwner,
      		advertiser: this.condition.advertiser,
      		checkResult: this.condition.checkResult,
      		targetMarket: this.condition.targetMarket
      	}
        let that = this
        that.loading = true;
        itemList(data).then(
          res => {
            that.loading = false;
            that.$set(that, 'tableData', res);
          },
          err => {
            that.loading = false;
          }
        )
      },
      loadShops() {
        let that = this;
        shopList().then(
          res => {
            var shops = res;
            var optionsForShopArea = [];
            var optionsForShopOwner = [];
            var optionsForAdvertiser = [];
            for(var shop of shops){
            	if(typeof shop.targetMarket != "undefined" && optionsForShopArea.indexOf(shop.targetMarket) < 0){
            		optionsForShopArea.push(shop.targetMarket)
            	}
            	if(typeof shop.owner != "undefined" && optionsForShopOwner.indexOf(shop.owner) < 0){
            		optionsForShopOwner.push(shop.owner)
            	}
            	if(typeof shop.advertiser != "undefined" && optionsForAdvertiser.indexOf(shop.advertiser) < 0){
            		optionsForAdvertiser.push(shop.advertiser)
            	}
            }
            that.$set(that, 'optionsForShopArea', optionsForShopArea);
            that.$set(that, 'optionsForShopOwner', optionsForShopOwner);
            that.$set(that, 'optionsForAdvertiser', optionsForAdvertiser);
            that.getList();
          },
          err => {
            console.log(err)
          })
      },
      indexMethod(index){
      	return index+1;
      },
      tableRowClassName({row, rowIndex}){
      	if (rowIndex === 0) {
      		return 'first-row';
      	} else if (rowIndex === 1) {
      		return 'second-row';
      	} else if(rowIndex === 2){
      		return 'third-row';
      	}
      	return '';
      },
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-table {
    .first-row {
        background: #FF8888;
    }
    .second-row {
         background: #FFBB66;
    }
    .third-row {
      background: #FFEE99;
    }
  }
</style>
