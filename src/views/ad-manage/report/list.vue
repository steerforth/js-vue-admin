<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-date-picker
        v-model="condition.month"
        type="month"
        placeholder="选择月"
        value-format="yyyy-MM"
        :picker-options="pickerOptions"
        @change="getReportList"
        :clearable="false">
      </el-date-picker>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="reportList" :height="tableHeight" stripe style="width: 100%" :summary-method="getSummaries" show-summary>
      <el-table-column prop="shopDomain" label="站点" align="center">
      </el-table-column>
      <el-table-column prop="adAgent" label="代理商" align="center">
      </el-table-column>
      <el-table-column prop="rechargeMoney" label="充值" align="center">
      </el-table-column>
      <el-table-column prop="costMoney" label="支出" align="center">
      </el-table-column>
      <el-table-column prop="restMoney" label="结余" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    optionForAgent
  } from '@/api/shopApi'
  import {
    reportList
  } from '@/api/adRechargeApi'
  import '@/utils/date'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'

  export default {
    name: 'AdReport',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        reportList: [],
        condition: {
        	month: new Date().format('yyyy-MM')
        },
        pickerOptions: {
        	disabledDate: (time) => {
        		return time.getTime() > Date.now();
        	}
        },
        tableHeight: DEFAULT_TABLE
      }
    },
    beforeMount() {

    },
    mounted() {
      this.$nextTick(() => {
        this.handleResize()
      })
      window.addEventListener('resize', this.handleResize)
      this.getReportList()
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM - DIFF);
      },
      getReportList() {
        let that = this
        that.$set(that, 'loading', true)
        reportList(that.condition).then(
          res => {
            that.$set(that, 'loading', false)
            that.$set(that, 'reportList', res)
          },
          err => {
            that.$set(that, 'loading', false)
          }
        )
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
            if (index == 3 || index == 4) {
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
