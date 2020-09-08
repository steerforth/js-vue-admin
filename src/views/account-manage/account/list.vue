<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-date-picker
        v-model="condition.month"
        type="month"
        value-format="yyyy-MM"
        placeholder="选择月"
        :clearable="false">
      </el-date-picker>
      <el-select v-model="condition.shopId" placeholder="站点" @change="changeShop">
        <el-option v-for="item in optionsForShops" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button-group>
        <el-button @click="recalculateAccount">重新核算</el-button>
        <el-button @click="syncOrderStatus">同步订单派送结果</el-button>
      </el-button-group>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="tableData" border stripe :summary-method="getSummaries" show-summary
      :height="tableHeight" style="width:100%;">
      <el-table-column prop="orderDay" label="日期" sortable header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="adCost" label="广告投入" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="originOrderNum" label="原始订单数量" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="originOrderMoney" :label="'原始订单金额('+curShop.currencyCode+')'" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="adCostAvg" label="广告平均转化成本(USD)" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="orderNumAfterCheck" label="审单成功单量" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="orderMoneyAfterCheck" :label="'审单成功订单金额('+curShop.currencyCode+')'" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="adCostAvgAfterCheck" label="审单成功转化成本(USD)" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="checkCost" label="审单费用(CNY)" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="purchaseCost" label="采购费用(CNY)" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="deliveryCost" label="物流费用(CNY)" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="serviceCost" label="运营费用(CNY)	" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="signOrderNum" label="实际签收单量" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="signOrderMoney" :label="'实际签收订单金额('+curShop.currencyCode+')'" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="signRate" label="签收率" header-align="center" align="center">
      </el-table-column>
      <el-table-column :formatter="formatSignStatus" label="签收状态" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="signOrderMoneyAvg" label="平均客单价(USD)" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="profit" label="净利润(USD)" header-align="center" align="center">
      </el-table-column>
      <!-- 高度不平的BUG -->
      <el-table-column
      	fixed="right"
      	label="操作"
      	width="80">
        <!-- TODO 传month和shop -->
        <template slot-scope="scope">
          <router-link :to="'/account-manage/account/edit/'+scope.row.id">
            <el-button size="mini">编辑</el-button>
          </router-link>
        </template>
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
    accountList,
    recalculateByMonth
  } from '@/api/accountApi'
  import {
    syncOrderStatus
  } from '@/api/orderApi'
  import '@/utils/date'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import '@/utils/date'
  import Xlsx from 'xlsx'

  export default {
    name: 'AccountTable',
    components: {
      SubNavbar
    },
    filters: {
      //TODO
      getFinishStutas(rate, status){
      	if(typeof rate == "undefined"){
      		return "—";
      	}else{
      		if(status == "FINISHED"){
      			return rate + " (已完结)";
      		}else{
      			return rate + " (未完结)";
      		}
      	}
      },
    },
    data() {
      return {
        curShop:'',
        clearable:false,
        loading: false,
        condition: {
          shopId: null,
          month: null,
        },
        optionsForShops: [],
        tableData: [],
        tableHeight: DEFAULT_TABLE
      }
    },
    beforeMount() {
      this.$set(this.condition, 'month', this.initMonth)
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
      initMonth() {
        var today = new Date();
        return today.format('yyyy-MM');
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
            that.$set(this,"optionsForShops",res)
            if(res != null && res.length > 0){
              that.$set(that.condition,"shopId",res[0].id)
              that.$set(that,'curShop',res[0]);
            }
            that.reloadTable();
          },
          err => {
            console.log(err)
          })
      },
      changeShop(value){
        var flag = false;
        for (var shop of this.optionsForShops) {
           if(shop.id == value){
             this.$set(this,'curShop',shop);
             flag = true;
           }
        }

        if(!flag){
          this.$message.error('未找到对应shop: id'+value)
          return;
        }

        this.reloadTable();
      },
      reloadTable() {
        let that = this;
        that.loading = true;
        accountList(that.condition).then(
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
      formatSignStatus(row, column){
        if (row.signFinishedStatus === 'UNFINISHED') {
          return "未完结"
        } else if (row.signFinishedStatus === 'FINISHED') {
          return "已完结"
        } else {
          return "未知"
        }
      },
      // formatCost(row, column){
      //   if (column.label === '审单费用(CNY)') {
      //     return (row.checkCost == null? "":row.checkCost )+ '/' + (row.checkCost2 == null? "":row.checkCost2);
      //   }
      //   return ''
      // },
      //TODO
      getSummaries(param) {
        let that = this;
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
          if (column.label === '广告平均转化成本(USD)') {
            //广告投入/下单量
            sums[index] = sums[2] == 0 ? 0 : (sums[1] / sums[2]).toFixed(2);
            return;
          }
          if (column.label === '审单成功转化成本(USD)') {
            //广告投入/审单量
            sums[index] = sums[5] == 0 ? 0 : (sums[1] / sums[5]).toFixed(2);
            return;
          }

          if (column.label === '平均客单价(USD)') {
            //实际签收订单金额（SAR/UAE）*美元汇率 /实际签收单量
            sums[index] = sums[12] == 0 ? 0 : (sums[13]*that.curShop.exchangeRateUSD / sums[12]).toFixed(2);
            return;
          }

          if (column.label === '签收率') {
            //实际签收单量 /审单成功单量
            sums[index] = sums[5] == 0 ? 0 : (sums[12] / sums[5]).toFixed(2);
            return;
          }

          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            //求和
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            //保留2位小数
            if (index == 1 || index == 9 || index == 10 || index == 15) {
              sums[index] = sums[index].toFixed(2);
            }
          } else {
            sums[index] = 'N/A';
          }
        });
        return sums;
      },
      recalculateAccount:function(){
        let that = this
        that.loading = true
        recalculateByMonth(that.condition,[that.condition.shopId]).then(
          res => {
            that.loading = false
            that.reloadTable()
          },
          err => {
            that.loading = false
          }
        )
      },
      syncOrderStatus(){
        let that = this
      	syncOrderStatus().then(
          res => {
            that.$message.success(res)
          },
          err => {

          }
        )
      }
    }
  }
</script>

<style lang="scss" scoped>

  /* 解决el-button转圈遮罩层为正方形的BUG ::v-deep样式穿透*/
  ::v-deep .el-loading-mask{
    border-radius: 50%;
  }

</style>
