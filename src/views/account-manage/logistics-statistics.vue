<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-tooltip class="item" effect="dark" content="excel导出" placement="right-end">
        <el-button icon="el-icon-paperclip" circle @click="exportExcel"></el-button>
      </el-tooltip>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column prop="column1" label="通道" align="center">
      </el-table-column>
      <el-table-column prop="column2" label="imile@88174" align="center">
      </el-table-column>
      <el-table-column prop="column3" label="imile@88172" align="center">
      </el-table-column>
      <el-table-column prop="column4" label="imile@88138" align="center">
      </el-table-column>
      <el-table-column prop="column5" label="yokesi@20125" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    statistics
  } from '@/api/logisticsApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import Xlsx from 'xlsx'

  export default {
    name: 'LogisticsStatistics',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        records: [],
        condition: {
          type: 1,
          query: '',
          index: 1,
          size: 50,
        },
        colomn1Obj:{sum:'已快递单数', directMailNum:'直邮订单数', directMailPrice:'直邮销售金额', directMailPurchaseCost:'直邮采购成本',
        forwardNum:'转寄订单数', forwardPrice:'转寄销售金额', forwardPurchaseCost:'转寄采购成本', overseasWarehouseNum:'海外仓订单数',
        overseasWarehousePrice:'海外仓销售金额', overseasWarehousePurchaseCost:'海外仓采购成本', distributionNum:'派送中', successNum:'派送成功',
        failedNum:'派送失败', finishedNum:'已结算单数', finishedPrice:'已结算金额', unFinishedNum:'未结算单数', unFinishedPrice:'未结算金额'},
        tableHeight: DEFAULT_TABLE,
      }
    },
    filters:{
    	// changeData: function(data){
    	// 	if(data == null || typeof data == "undefined"){
    	// 		return "—";
    	// 	}else{
    	// 		return data;
    	// 	}
    	// }
    },
    beforeMount() {
      this.loadPage()
    },
    mounted() {
      this.$nextTick(() => {
        this.handleResize();
      })
      window.addEventListener('resize', this.handleResize)
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM);
      },
      loadPage() {
        let that = this;
        that.loading = true;
        statistics().then(
          res => {
            that.loading = false;

            var data = this.buildDataPage(res)
            that.$set(that, 'records', data);
          },
          err => {
            that.loading = false;
          }
        )
      },
      buildDataPage(resData){
        debugger
        var column2Obj = resData['imile@88174'];
        var column3Obj = resData['imile@88172'];
        var column4Obj = resData['imile@88138'];
        var column5Obj = resData['yokesi@20125'];

        var data = [];
        for(var key in this.colomn1Obj){
          var row = {}
          row.column1 = this.colomn1Obj[key]
          row.column2 = column2Obj[key] == null ? "-": column2Obj[key]
          row.column3 = column3Obj[key] == null ? "-": column3Obj[key]
          row.column4 = column4Obj[key] == null ? "-": column4Obj[key]
          row.column5 = column5Obj[key] == null ? "-": column5Obj[key]
          data.push(row)
        }
        return data
      },
      // formatType(row, column) {
      //   if (row.type === 1) {
      //     return "Yokesi"
      //   } else if (row.type === 2) {
      //     return "Imile"
      //   } else {
      //     return "未知"
      //   }
      // },
      handleSizeChange(val) {
        this.$set(this.condition, "index", 1);
        this.$set(this.condition, "size", val);
        this.loadPage();
      },
      handleCurrentChange(val) {
        this.$set(this.condition, "index", val);
        this.loadPage();
      },
      exportExcel: function(){
      	const options = {
      	  '!cols': [
      			{ wpx: 100 },
      			{ wpx: 100 },
      			{ wpx: 100 },
      			{ wpx: 100 },
      			{ wpx: 100 },
      	]};
      	const name = '物流统计表.xlsx';
      	const table = this.$refs.table.$el;
      	const workbook = Xlsx.utils.book_new();
      	const sheet = Xlsx.utils.table_to_sheet(table);
      	sheet['!cols'] = options['!cols'];
      	Xlsx.utils.book_append_sheet(workbook, sheet);
      	Xlsx.writeFile(workbook, name);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-input{
    max-width: 230px;
  }
</style>
