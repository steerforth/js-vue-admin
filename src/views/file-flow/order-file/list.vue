<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-select v-model="selectedShop" clearable filterable placeholder="请输入站点">
        <el-option v-for="item in shops" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-upload style="display: inline-block;" action="noaction" :show-file-list="false" :http-request="uploadFile">
        <el-tooltip class="item" effect="dark" content="文件上传" placement="right-end">
          <el-button v-loading="loadingUp" icon="el-icon-upload2" circle></el-button>
        </el-tooltip>
      </el-upload>
    </sub-navbar>
    <el-table v-loading="loading" :data="page.records" ref="table" :height="tableHeight" stripe style="width: 100%">
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
    	    <el-button @click="downloadOrderFile(scope.row.id)" type="text" size="mini">订单表</el-button>
          <el-button @click="downloadCheckFile(scope.row.id)" type="text" size="mini">审单表</el-button>
          <el-button @click="downloadPurchaseFile(scope.row.id)" type="text" size="mini">采购表</el-button>
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
    uploadOrderFile,
    downloadPurchaseFile
  } from '@/api/orderApi'
  import {
    shopList
  } from '@/api/shopApi'
  import {
    page,
    downloadById,
    downloadByType
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
        loadingUp: false,
        shops:[],
        selectedShop:null,
        tableHeight: DEFAULT_TABLE,
        page: {
        	total: 0,
        	records:[]
        },
        condition: {
          type: 0,
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
      this.loadShops()
      this.loadPage();

    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM -
          this.$refs.pagination.$el.offsetHeight);
      },
      loadShops(){
        shopList().then(
          res => {
            this.$set(this,'shops',res)
          }
        )
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
      indexMethod(index){
      	return index+1;
      },
      uploadFile(params) {
        let that = this
        if(that.selectedShop == null){
          that.$message.warning('请选择上传的店铺站点!')
          return;
        }
        const form = handlePreUpload(params)
        that.loading = true
        that.loadingUp = true
        uploadOrderFile(form, that.selectedShop).then(
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
      downloadOrderFile(id){
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
      downloadCheckFile(srcId){
        let that = this
        let condition = {
          srcId: srcId,
          type: 1
        }
        that.loading = true
        downloadByType(condition).then(
          res => {
            that.loading = false
            handleFileDownload(res)
          },
          err => {
            that.loading = false
          }
        )
      },
      downloadPurchaseFile(srcId){
        let that = this
        let condition = {
          fileId: srcId,
        }
        that.loading = true
        downloadPurchaseFile(condition).then(
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
