<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-input placeholder="请输入ID/规格/中文名/SKU" v-model="condition.query" clearable @keyup.enter.native="loadPage">
      </el-input>
      <el-select v-model="condition.domain" clearable filterable placeholder="请输入站点">
        <el-option v-for="item in shops" :key="item.id" :label="item.name" :value="item.domain">
        </el-option>
      </el-select>
      <el-tooltip class="item" effect="dark" content="查询" placement="right-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="doQuery"></el-button>
      </el-tooltip>
      <el-upload style="display: inline-block;" action="noaction" :show-file-list="false" :http-request="uploadFile">
        <el-tooltip class="item" effect="dark" content="sku文件上传" placement="right-end">
          <el-button v-loading="loadingUp" icon="el-icon-upload2" circle></el-button>
        </el-tooltip>
      </el-upload>
      <el-button-group>
        <el-button icon="el-icon-download" @click="exportAsPy">普源产品表</el-button>
        <el-button icon="el-icon-download" @click="exportAsYks">Yokesi产品表</el-button>
      </el-button-group>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="page.records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column prop="domain" label="域名" width="200" align="center">
      </el-table-column>
      <el-table-column prop="goodsId" label="ID" width="60" align="center">
      </el-table-column>
      <el-table-column prop="spec" label="在售规格" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.goodsLink" target="_blank">{{ scope.row.spec }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="中文名" width="200" align="center">
      </el-table-column>
      <el-table-column prop="sku" label="SKU" width="200" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="数量" width="60" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="remove(scope.row)" type="danger" size="mini">删除</el-button>
          <router-link :to="'/goods-info/goods-sku/edit/'+scope.row.id">
            <el-button size="mini">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.pageIndex"
      :page-sizes="[100, 200, 300]" :page-size="condition.pageSize" layout="sizes, prev, pager, next, total" :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    shopList
  } from '@/api/shopApi'
  import {
    page,
    upload,
    deleteOne,
    download4py,
    download4yks
  } from '@/api/goodsSkuApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import { handleFileDownload, handlePreUpload } from '@/utils/file-handler'

  export default {
    name: 'GoodsSkuList',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        loadingUp: false,
        shops: [],
        page: {
          total: 0,
          records: []
        },
        condition: {
          domain: '',
          query: '',
          pageIndex: 1,
          pageSize: 100,
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
      this.loadShops()
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
        this.$set(this.condition, "pageIndex", 1);
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
        this.$set(this.condition, "pageIndex", 1);
        this.$set(this.condition, "pageSize", val);
        this.loadPage();
      },
      handleCurrentChange(val) {
        this.$set(this.condition, "pageIndex", val);
        this.loadPage();
      },
      loadShops() {
        let that = this
        shopList().then(
          res => {
            that.$set(that,'shops',res)
            that.loadPage()
          },
          err => {

          }
        )
      },
      uploadFile(params) {
        let form = handlePreUpload(params),that = this;
        that.loadingUp = true
        that.loading = true
        upload(form, that.condition).then(
          res => {
            that.loadingUp = false
            that.loading = false
            that.$message.success(res)
            that.loadPage()
          },
          err => {
            that.loadingUp = false
            that.loading = false
          }
        )
      },
      exportAsPy() {
        download4py().then(
          res => {
            handleFileDownload(res)
          },
          err => {

          }
        )
      },
      exportAsYks() {
        download4yks().then(
          res => {
            handleFileDownload(res)
          },
          err => {

          }
        )
      },
      remove(row){
      	this.$confirm('此操作将删除['+row.domain+'站点的'+row.sku+'], 是否继续?', '提示', {
      	  confirmButtonText: '确定',
      	  cancelButtonText: '取消',
      	  type: 'warning'
      	}).then(() => {
          deleteOne(row.id).then(
            res => {
              this.loadPage();
            },
            err => {

            }
          )
      	}).catch(action => {
      		if(action === 'cancel'){
            this.$message.info('已取消删除')
      		}
      	});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-input {
    max-width: 230px;
  }
</style>
