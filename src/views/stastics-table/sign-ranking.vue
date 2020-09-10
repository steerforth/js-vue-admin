<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-select v-model="condition.targetMarket" clearable placeholder="地区" @change="getList">
        <el-option v-for="item in optionsForShopArea" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select v-model="condition.deliverType" clearable placeholder="物流类别" @change="getList">
        <el-option v-for="item in optionsForDeliverType" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="condition.passageway" clearable placeholder="物流公司" @change="getList">
        <el-option v-for="item in optionsForPassageway" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-date-picker v-model="pickerTime" type="datetimerange" align="right"
        unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['09:00:00','09:00:00']"
        value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" @change="getList" :clearable="false">
      </el-date-picker>
    </sub-navbar>
    <div class="chart-container">
      <pie-chart width="100%" height="100%" :legends="chartLegends" :chartData="chartData"></pie-chart>
    </div>
    <el-table ref="table" v-loading="loading" :data="tableData" :row-class-name="tableRowClassName" :height="tableHeight"
      border style="width:100%;">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="goodsName" label="产品名称" width=300>
      </el-table-column>
      <el-table-column prop="skuCode" label="skuCode">
      </el-table-column>
      <el-table-column label="签收量/发货量" :formatter="formatNum">
      </el-table-column>
      <el-table-column prop="successRate" label="签收率%" sortable>
      </el-table-column>
      <el-table-column prop="fail" label="退回量/发货量" :formatter="formatNum">
      </el-table-column>
      <el-table-column prop="failRate" label="退回率%" sortable>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar' // 粘性header组件
  import PieChart from '@/components/Charts/PieChart'
  import {
    targetMarkets
  } from '@/api/shopApi'
  import {
    signRanking
  } from '@/api/orderItemApi'
  import '@/utils/date'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'

  export default {
    name: 'SignRanking',
    components: {
      SubNavbar,
      PieChart
    },
    filters: {},
    data() {
      return {
        loading: false,
        condition: {
          start: null,
          end: null,
          deliverType: null,
          passageway: null,
          targetMarket: null
        },
        pickerTime:[],
        optionsForShopArea: [],
        optionsForDeliverType: [{
          'value': 'DIRECT_MAIL',
          'name': '直邮'
        }, {
          'value': 'FORWARD',
          'name': '转寄'
        }, {
          'value': 'OVERSEAS_WAREHOUSE',
          'name': '海外仓'
        }],
        optionsForPassageway: ['imile', 'yokesi'],
        pickerOptions: {
          shortcuts: [{
            text: '14天前一周',
            onClick(picker) {
              var now = new Date();
              now.setHours(9);
              now.setMinutes(0);
              now.setSeconds(0);
              var start = new Date(now);
              start.setDate(now.getDate() - 21);
              var end = new Date(now);
              end.setDate(now.getDate() - 14);
              picker.$emit('pick', [start.format('yyyy-MM-dd HH:mm:ss'), end.format('yyyy-MM-dd HH:mm:ss')]);
            }
          }, {
            text: '14天前15天',
            onClick(picker) {
              var now = new Date();
              now.setHours(9);
              now.setMinutes(0);
              now.setSeconds(0);
              var start = new Date(now);
              start.setDate(now.getDate() - 29);
              var end = new Date(now);
              end.setDate(now.getDate() - 14);
              picker.$emit('pick', [start.format('yyyy-MM-dd HH:mm:ss'), end.format('yyyy-MM-dd HH:mm:ss')]);
            }
          }, {
            text: '14天前一个月',
            onClick(picker) {
              var now = new Date();
              now.setHours(9);
              now.setMinutes(0);
              now.setSeconds(0);
              var start = new Date(now);
              start.setDate(now.getDate() - 44);
              var end = new Date(now);
              end.setDate(now.getDate() - 14);
              picker.$emit('pick', [start.format('yyyy-MM-dd HH:mm:ss'), end.format('yyyy-MM-dd HH:mm:ss')]);
            }
          }],
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        },
        tableData: [],
        tableHeight: DEFAULT_TABLE,
        chartLegends: ['签收', '退回', '处理中'],
        chartData: []
      }
    },
    beforeMount() {
      this.$set(this, 'pickerTime', this.initTime);
    },
    mounted() {
      this.$nextTick(() => {
        this.handleResize()
      })
      window.addEventListener('resize', this.handleResize)
      this.getTargetMarkets()
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    computed: {
      initTime() {
        var now = new Date();
        now.setHours(9);
        now.setMinutes(0);
        now.setSeconds(0);
        var start = new Date(now);
        start.setDate(now.getDate() - 21);
        var end = new Date(now);
        end.setDate(now.getDate() - 14);
        return [start.format('yyyy-MM-dd HH:mm:ss'), end.format('yyyy-MM-dd HH:mm:ss')];
      },
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR -
          PADDING_BOTTOM)
      },
      getList() {
        // $('.container').scrollTop(0);
        if (this.pickerTime == null) {
          this.$message({
            message: '请选择时间',
            type: 'warning'
          });
          return;
        }
        var data = {
          end: this.pickerTime[1],
          start: this.pickerTime[0],
          passageway: this.condition.passageway,
          deliverType: this.condition.deliverType,
          targetMarket: this.condition.targetMarket,
        }
        let that = this
        that.loading = true
        signRanking(data).then(
          res => {
            that.loading = false
            that.$set(that, 'tableData', res.rankings)

            var chartData = []
            chartData.push(res.success)
            chartData.push(res.fail)
            chartData.push(res.sum - res.success - res.fail)
            that.$set(that, 'chartData', chartData)
          },
          err => {
            that.loading = false
            console.log(err)
          }
        )
      },
      getTargetMarkets() {
        let that = this;
        targetMarkets().then(
          res => {
            that.$set(that, 'optionsForShopArea', res);
            that.getList();
          },
          err => {
            console.log(err);
          }
        )
      },
      indexMethod(index) {
        return index + 1;
      },
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (rowIndex === 0) {
          return 'first-row';
        } else if (rowIndex === 1) {
          return 'second-row';
        } else if (rowIndex === 2) {
          return 'third-row';
        }
        return '';
      },
      formatNum(row, column) {
        if (column.label === '签收量/发货量') {
          return row.success + '/' + row.sum;
        } else if (column.label === '退回量/发货量') {
          return row.fail + '/' + row.sum;
        }
        return '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  
  .chart-container {
    min-height: 100px;
  }

  /**
   * 一行显示不下
   * ::v-deep样式穿透组件
   */
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
