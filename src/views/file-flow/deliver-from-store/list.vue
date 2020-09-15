<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-select style="width: 540px;" v-model="selectedPassageways" multiple clearable placeholder="请选择匹配的通道">
          <el-option
            v-for="value in options"
            :key="value"
            :label="value"
            :value="value">
          </el-option>
      </el-select>
      <el-button v-loading="loading" type="primary" @click="match">匹配</el-button>
    </sub-navbar>
    <el-table v-loading="loading" :data="page.records" ref="table" :height="tableHeight" style="width: 100%" highlight-current-row @current-change="handleSelectRow">
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
    	<el-table-column prop="message" label="上传信息" align="center">
    	</el-table-column>
    	<el-table-column
    	  fixed="right"
    	  label="下载"
    	  align="center">
    	  <template slot-scope="scope">
    	    <el-button @click="download(scope.row.id)" type="text" size="mini">本文件</el-button>
    	    <el-button @click="downloadByType(scope.row.id,'4')" type="text" size="mini">imile运单</el-button>
    		<el-button @click="downloadByType(scope.row.id,'5')" type="text" size="mini">yokesi运单</el-button>
    		<el-button @click="downloadByType(scope.row.id,'16')" type="text" size="mini">结余审单结果</el-button>
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
    match
  } from '@/api/overseasStorageApi'
  import {
    page,
    getById,
    downloadById,
    downloadByType
  } from '@/api/excelFileApi'
  import { handleFileDownload } from '@/utils/file-handler'

  export default {
    name: 'DeliverFromStoreList',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        tableHeight: DEFAULT_TABLE,
        page: {
        	total: 0,
        	records:[]
        },
        condition: {
          type: 14,
        	index: 1,
        	size: 20,
        },
        selectedPassageways:['yokesi@20125','imile@88172'],
        options:['yokesi@20125','imile@88174','imile@88172','imile@88138'],
        currentRow: null,
        tipVisible:false
      }
    },
    beforeMount() {},
    mounted() {
      this.$nextTick(() => {
        this.handleResize()
      })
      window.addEventListener('resize', this.handleResize)
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
      download(id){
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
      downloadByType(srcId,type){
        let that = this
        let condition = {
          srcId: srcId,
          type: type
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
      match(){
      	if(this.currentRow == null){
      		this.$message.warning("请选择对应的行");
      		return;
      	}

      	if(this.selectedPassageways.length == 0){
      		this.$message.warning("请选择匹配的物流通道");
      		return;
      	}

        let that = this
        getById(this.currentRow.id).then(
          res => {
            if(res.message == null){
              this.doMatch()
            }else{
              that.$set(that,"tipVisible",true);
            }
          },
          err => {

          }
        )

      },
      doMatch(){
      	let condition = {
          passageways: this.selectedPassageways,
          fileId: this.currentRow.id
        }, that = this;
      	that.loading = true
        match(condition).then(
          res => {
            that.loading = false
            this.loadPage()
            this.$message.success(res);
          },
          err => {
            that.loading = false
          }
        )
        //TODO
      	this.$set(this,"tipVisible",false);
      },
      handleSelectRow(row){
      	this.currentRow = row;
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
