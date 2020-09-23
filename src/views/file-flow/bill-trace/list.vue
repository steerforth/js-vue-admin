<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-input placeholder="请输入国内运单号" v-model="condition.query" clearable @keyup.enter.native="loadPage">
      </el-input>
      <el-tooltip class="item" effect="dark" content="查询" placement="right-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="doQuery"></el-button>
      </el-tooltip>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="page.records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column label="创建时间" prop="createAt" align="center">
      </el-table-column>
      <el-table-column prop="updateAt" label="更新时间" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="国内运单号" align="center">
      </el-table-column>
      <el-table-column prop="passageway" label="物流通道" align="center">
      </el-table-column>
      <el-table-column prop="orderAmount" label="发货单数" align="center">
      </el-table-column>
      <el-table-column prop="finishedAmount" label="抵达单数" align="center">
      </el-table-column>
      <el-table-column label="下载" align="center">
        <template slot-scope="scope">
          <el-link type="primary" class="mini" @click="download(scope.row.fileId)">源文件</el-link>
          <el-link type="primary" class="mini" @click="downloadUnfinished(scope.row.billNo)">未抵达明细</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.index"
      :page-sizes="[20, 50, 100]" :page-size="condition.size" layout="sizes, prev, pager, next, total" :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    page,
    downloadUnfinished
  } from '@/api/billTraceApi'
  import {
    downloadById
  } from '@/api/excelFileApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import {
    handleFileDownload
  } from '@/utils/file-handler'

  export default {
    name: 'BillTraceList',
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
          query: '',
          index: 1,
          size: 20,
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
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM -
          this.$refs.pagination.$el.offsetHeight);
      },
      doQuery(){
        this.$set(this.condition, "index", 1);
        this.loadPage();
      },
      loadPage() {
        let that = this
        that.loading = true
        page(this.condition).then(
          res => {
            that.loading = false
            that.$set(that, 'page', res)
          },
          err => {
            that.loading = false
          }
        )
      },
      handleSizeChange(val) {
        this.$set(this.condition, "index", 1);
        this.$set(this.condition, "size", val);
        this.loadPage();
      },
      handleCurrentChange(val) {
        this.$set(this.condition, "index", val);
        this.loadPage();
      },
      download(id) {
        let that = this
        that.loading = true
        downloadById(id).then(
          res => {
            handleFileDownload(res)
            that.loading = false
          },
          err => {
            that.loading = false
          }
        )
      },
      downloadUnfinished(billNo) {
        let that = this
        that.loading = true
        downloadUnfinished(billNo).then(
          res => {
            handleFileDownload(res)
            that.loading = false
          },
          err => {
            that.loading = false
          }
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-input {
    max-width: 230px;
  }
</style>
