<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-upload v-loading="loading" style="display: inline-block;" action="noaction" :show-file-list="false" :http-request="uploadFile">
        <el-tooltip class="item" effect="dark" content="文件上传" placement="right-end">
          <el-button icon="el-icon-upload2" circle></el-button>
        </el-tooltip>
      </el-upload>
    </sub-navbar>
    <el-table v-loading="tableLoading" :data="filesPage.records" ref="table" :height="tableHeight" stripe style="width: 100%">
    	<el-table-column
    	  type="index"
    	  :index="indexMethod"
    	  width="50">
    	</el-table-column>
    	<el-table-column prop="name" label="文件名">
    	</el-table-column>
    	<el-table-column prop="uploaderName" label="上传人" align="center">
    	</el-table-column>
    	<el-table-column prop="uploadTime" label="上传时间" align="center">
    	</el-table-column>
    	<el-table-column
    	  fixed="right"
    	  label="下载"
    	  align="center">
    	  <template slot-scope="scope">
    	    <el-button @click="downloadFile(scope.row.id)" type="text" size="mini">本文件</el-button>
    	  </template>
    	</el-table-column>
    </el-table>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.index"
      :page-sizes="[100, 200, 300]" :page-size="condition.size" layout="sizes, prev, pager, next, total" :total="filesPage.total">
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
    upload
  } from '@/api/goodsApi'
  import {
    page,
    downloadById
  } from '@/api/excelFileApi'
  import { handleFileDownload,handlePreUpload } from '@/utils/file-handler'

  export default {
    name: 'PurchaseFileList',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        tableLoading: false,
        filesPage: {
          total: 0,
          records: []
        },
        condition: {
          type: 9,
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
      this.loadFiles();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM -
          this.$refs.pagination.$el.offsetHeight);
      },
      loadFiles() {
        let that = this
        that.tableLoading = true
        page(this.condition).then(
          res => {
            that.tableLoading = false
            that.$set(that, 'filesPage', res)
          },
          err => {
            that.tableLoading = false
          }
        )
      },
      handleSizeChange(val) {
        this.$set(this.condition, "index", 1);
        this.$set(this.condition, "size", val);
        this.loadFiles();
      },
      handleCurrentChange(val) {
        this.$set(this.condition, "index", val);
        this.loadFiles();
      },
      indexMethod(index){
      	return index+1;
      },
      uploadFile(params) {
        const form = handlePreUpload(params)
        let that = this
        that.loading = true
        upload(form, that.condition).then(
          res => {
            that.loading = false
            that.$message.success(res)
            that.loadFiles()
          },
          err => {
            that.loading = false
          }
        )
      },
      downloadFile(id){
        let that = this
        that.tableLoading = true
        downloadById(id).then(
          res => {
            that.tableLoading = false
            handleFileDownload(res)
          },
          err => {
            that.tableLoading = false
          }
        )
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
