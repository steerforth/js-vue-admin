<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-cascader style='min-width:310px' :options="optionsForMulti" :props="{multiple: true}" placeholder="投放人/站点"
        collapse-tags clearable v-model="advertiserShopIds">
      </el-cascader>
      <el-select v-model="condition.targetMarket" clearable placeholder="地区">
        <el-option v-for="item in optionsForShopArea" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-date-picker v-model="pickerTime" type="daterange" align="right" unlink-panels
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :clearable="false">
      </el-date-picker>
      <el-tooltip class="item" effect="dark" content="查询" placement="right-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="reloadTable"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="excel导出" placement="right-end">
        <el-button icon="el-icon-download" circle @click="exportExcel"></el-button>
      </el-tooltip>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="tableData" border stripe :summary-method="getSummaries" show-summary
      :height="tableHeight" :cell-style="changeCellStyle" style="width:100%;">
      <el-table-column type="expand">
        <template slot-scope="props" v-if="props.row.unAdDomains !='' ">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="未设置广告费站点:">
              <span v-html="props.row.unAdDomains"></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="day" label="日期" sortable header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="adCost" label="广告投入" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="originOrderNum" label="下单量/单" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="adCostAvg" label="广告平均转化成本(USD)" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="orderNumAfterCheck" label="审单后/单" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="adCostAvgAfterCheck" label="审单成功转化成本(USD)" header-align="center" align="center">
      </el-table-column>
      <el-table-column label="已发货/单" header-align="center" align="center">
        <el-table-column prop="directType" label="直邮" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="distributionType" label="仓配" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="forwardType" label="转寄" header-align="center" align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="签收/单" header-align="center" align="center">
        <el-table-column prop="distributionStatus" label="配送中" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="successStatus" label="已签收" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="failedStatus" label="拒签" header-align="center" align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="amount4" label="物流结算" header-align="center" align="center">
        <el-table-column prop="settled" label="单数/单" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="settledTotal" label="结算款/元" header-align="center" align="center">
        </el-table-column>
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
    deliverStatistic
  } from '@/api/orderApi'
  import '@/utils/date'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import Xlsx from 'xlsx'

  export default {
    name: 'OrderStatusTable',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        condition: {
          start: null,
          end:null,
          targetMarket: null,
          shopIds: []
        },
        pickerTime:[],
        optionsForShopArea: [],
        //for multi
        advertiserShopIds:[],
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
        tableData: [],
        tableHeight: DEFAULT_TABLE
      }
    },
    //TODO 切换侧边栏时el-table__body-wrapper会变化
    // watch:{
    //   '$store.state.app.sidebar.opened'() {
    //     this.$nextTick(() => {
    //       this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR -
    //         PADDING_BOTTOM - DIFF);
    //     })
    //   }
    // },
    beforeMount() {
      this.$set(this, 'pickerTime', this.initTime);
    },
    mounted() {
      // alert('inner height:'+window.innerHeight)
      // alert('offset top:'+this.$refs.table.$el.offsetTop)
      // alert('nav bar:'+NAV_BAR)
      // alert('padding bottom:'+PADDING_BOTTOM)
      // alert('diff:'+DIFF)
      //navBar:50 offsetTop:68 bottom:20
      this.$nextTick(() => {
        // this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR -
        //   PADDING_BOTTOM - DIFF)
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
        var now = new Date();
        var start = new Date().setDate(now.getDate() - 7);
        start = new Date(start);
        var end = new Date().setDate(now.getDate() - 1);
        end = new Date(end);
        return [start.format('yyyy-MM-dd'), end.format('yyyy-MM-dd')];
      },
    },
    methods: {
      handleResize(){
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR -
          PADDING_BOTTOM - DIFF);
      },
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
            that.reloadTable();
          },
          err => {
            console.log(err)
          })
      },
      reloadTable() {
        let that = this,advertiserShopIds = this.advertiserShopIds,shopIds = [];
        //去除分组的值
        for (var advertiserShopId of advertiserShopIds) {
          shopIds.push(advertiserShopId[1]);
        }
        var data = {
          start: that.pickerTime[0],
          end: that.pickerTime[1],
          shopIds: shopIds,
          targetMarket: this.condition.targetMarket,
        }
        that.loading = true;
        deliverStatistic(data).then(
          res => {
            that.loading = false;
            that.$set(that, 'tableData', res);
          },
          err => {
            that.loading = false;
            console.log(err)
          }
        )

      },
      exportExcel() {
        const options = {
          '!cols': [{
              wpx: 30
            },
            {
              wpx: 80
            },
          ]
        };
        const name = '订单状态表.xlsx';
        const table = this.$refs.table.$el;
        const workbook = Xlsx.utils.book_new();
        const sheet = Xlsx.utils.table_to_sheet(table);
        sheet['!cols'] = options['!cols'];
        Xlsx.utils.book_append_sheet(workbook, sheet);
        Xlsx.writeFile(workbook, name);
      },
      changeCellStyle({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (column.label === "广告投入") {
          if (row.unAdDomains != "") {
            return 'color:red';
          }
        }
        return '';
      },
      getSummaries(param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.label === '平均转化广告成本(USD)') {
            //广告投入/下单量
            sums[index] = sums[3] == 0 ? 0 : (sums[2] / sums[3]).toFixed(2);
            return;
          }
          if (column.label === '审单成功转化成本(USD)') {
            //广告投入/审单量
            sums[index] = sums[5] == 0 ? 0 : (sums[2] / sums[5]).toFixed(2);
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if (index == 2 || index == 4 || index == 6 || index == 14) {
              sums[index] = sums[index].toFixed(2);
            }
          } else {
            sums[index] = 'N/A';
          }
        });
        return sums;
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
