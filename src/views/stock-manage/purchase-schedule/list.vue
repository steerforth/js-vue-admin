<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-tooltip class="item" effect="dark" content="导出" placement="right-end">
        <el-button icon="el-icon-download" circle @click="exportFile"></el-button>
      </el-tooltip>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="page.records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column prop="sku" label="SKU" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="SKU名称" width="60" align="center">
      </el-table-column>
      <el-table-column prop="skuNameEn" label="SKU英文" align="center">
      </el-table-column>
      <el-table-column prop="releaseTime" label="计划时间" align="center">
      </el-table-column>
      <el-table-column prop="one.target | getTargetName" label="目的仓" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="计划采购数量" align="center">
      </el-table-column>
      <!-- TODO显示 -->
      <el-table-column prop="amount" label="计划采购总数量" align="center">
      </el-table-column>
    </el-table>
    <!-- <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.pageIndex"
      :page-sizes="[100, 200, 300]" :page-size="condition.pageSize" layout="sizes, prev, pager, next, total" :total="skuPage.total">
    </el-pagination> -->
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    stockPlanItems
  } from '@/api/stockApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import Xlsx from 'xlsx'

  export default {
    name: 'PurchaseSchedule',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        page: {
          total: 0,
          records: []
        },
        condition: {
          status: 'NOT_PURCHASED'
        },
        tableHeight: DEFAULT_TABLE
      }
    },
    beforeMount() {},
    mounted() {
      this.$nextTick(() => {
        this.handleResize()
      })
      window.addEventListener('resize', this.handleResize)
      this.loadPage()
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR);
      },
      loadPage() {
        let that = this
        that.loading = true
        stockPlanItems(this.condition).then(
          res => {
            that.loading = false
            that.$set(that, 'page', res)
          },
          err => {
            that.loading = false
          }
        )
      },
      // handleSizeChange(val) {
      //   this.$set(this.condition, "pageIndex", 1);
      //   this.$set(this.condition, "pageSize", val);
      //   this.loadGoodsSku();
      // },
      // handleCurrentChange(val) {
      //   this.$set(this.condition, "pageIndex", val);
      //   this.loadGoodsSku();
      // },
      exportFile() {
        const options = {
          '!cols': [
        		{ wpx: 60 },
        		{ wpx: 180 },
        		{ wpx: 300 },
        		{ wpx: 130 },
        		{ wpx: 90 },
        		{ wpx: 90 },
        		{ wpx: 90 },
        ]};

        const name = '待采购明细.xlsx';
        const table =  this.$refs.table.$el;
        const workbook = Xlsx.utils.book_new();
        //原生字符导出
        const sheet = Xlsx.utils.table_to_sheet(table,{raw:true});
        sheet['!cols'] = options['!cols'];
        Xlsx.utils.book_append_sheet(workbook, sheet,'待采购明细');
        // Xlsx.write(workbook, {bookType:'xlsx',type:'binary'});
        Xlsx.writeFile(workbook, name);
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
