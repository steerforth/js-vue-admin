<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-upload style="display: inline-block;" action="noaction" :show-file-list="false" :http-request="upload">
        <el-tooltip class="item" effect="dark" content="审单文件上传" placement="right-end">
          <el-button v-loading="loadingUp" icon="el-icon-upload2" circle></el-button>
        </el-tooltip>
      </el-upload>
    </sub-navbar>
    <el-table v-loading="loading" :data="page.records" ref="table" :height="tableHeight" stripe style="width: 100%">
      <el-table-column type="index" :index="indexMethod" width="50">
      </el-table-column>
      <el-table-column prop="name" label="文件名">
      </el-table-column>
      <el-table-column prop="uploaderName" label="上传人" align="center">
      </el-table-column>
      <el-table-column prop="uploadTime" label="上传时间" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="下载" align="center">
        <template slot-scope="scope">
          <el-link type="primary" class="mini" @click="download(scope.row.id)">审单结果</el-link>
          <el-link type="primary" class="mini" @click="downloadBySrcAndType(scope.row.id,'4')">imile直邮运单表</el-link>
          <el-link type="primary" class="mini" @click="downloadBySrcAndType(scope.row.id,'5')">yokesi直邮运单表</el-link>
          <el-link type="primary" class="mini" @click="downloadBySrcAndType(scope.row.id,'17')">合联直邮运单表</el-link>
          <el-link type="primary" class="mini" @click="downloadBySrcAndType(scope.row.id,'6')">普源入库表</el-link>
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
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import {
    uploadCheckResultForDirectMail
  } from '@/api/orderApi'
  import {
    page,
    downloadById,
    downloadBySrcAndType
  } from '@/api/excelFileApi'
  import {
    handleFileDownload,
    handlePreUpload
  } from '@/utils/file-handler'

  export default {
    name: 'DirectMailList',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        loadingUp: false,
        tableHeight: DEFAULT_TABLE,
        page: {
          total: 0,
          records: []
        },
        condition: {
          type: 2,
          index: 1,
          size: 20,
        }
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
      indexMethod(index) {
        return index + 1;
      },
      upload(params) {
        const form = handlePreUpload(params)
        //TODO 删除，后台接口改造
        form.append('shopId', 1)
        let that = this
        that.loading = true
        that.loadingUp = true
        uploadCheckResultForDirectMail(form).then(
          res => {
            that.loading = false
            that.loadingUp = false
            that.$message.success(res)
            that.loadPage()
          },
          err => {
            that.loading = false
            that.loadingUp = false
          }
        )
      },
      download(id) {
        let that = this
        that.loading = true
        downloadById(id).then(
          res => {
            that.loading = false
            handleFileDownload(res)
          },
          err => {
            that.loading = false
          }
        )
      },
      downloadBySrcAndType(srcId, type) {
        let that = this
        let condition = {
          srcId: srcId,
          type: type
        }
        that.loading = true
        downloadBySrcAndType(condition).then(
          res => {
            that.loading = false
            handleFileDownload(res)
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
</style>
