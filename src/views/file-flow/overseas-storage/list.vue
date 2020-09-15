<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-input placeholder="请输入sku" v-model="condition.query" clearable @keyup.enter.native="loadPage">
      </el-input>
      <el-select v-model="condition.passageway" clearable>
        <el-option v-for="value in options" :key="value" :label="value" :value="value">
        </el-option>
      </el-select>
      <el-tooltip class="item" effect="dark" content="查询" placement="right-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="loadPage"></el-button>
      </el-tooltip>
      <el-upload style="display: inline-block;" action="noaction" :show-file-list="false" :http-request="uploadFile">
        <el-tooltip class="item" effect="dark" content="库存文件上传" placement="right-end">
          <el-button v-loading="loadingUp" icon="el-icon-upload2" circle></el-button>
        </el-tooltip>
      </el-upload>
      <el-tooltip class="item" effect="dark" content="手动新增库存" placement="right-end">
        <el-button icon="el-icon-plus" circle @click="goAdd"></el-button>
      </el-tooltip>
    </sub-navbar>
    <el-table v-loading="loading" :data="page.records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column label="更新时间" prop="syncDate" align="center">
      </el-table-column>
      <el-table-column prop="targetCode" label="目标市场" align="center">
      </el-table-column>
      <el-table-column prop="storeName" label="暂存库网点" align="center">
      </el-table-column>
      <el-table-column prop="passageway" label="物流通道" align="center">
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" align="center">
      </el-table-column>
      <el-table-column prop="sku" label="SKU" align="center">
      </el-table-column>
      <el-table-column width="80" prop="amount" label="库存" align="center">
      </el-table-column>
      <el-table-column width="120" prop="matchAmount" label="已匹配库存" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/file-flow/overseas-storage/edit/'+scope.row.id">
            <el-button size="mini">编辑</el-button>
          </router-link>
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
    upload
  } from '@/api/overseasStorageApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import {
    handlePreUpload
  } from '@/utils/file-handler'

  export default {
    name: 'OverseasStorageList',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        loadingUp: false,
        page: {
          total: 0,
          records: []
        },
        options:['yokesi@20125','imile@88172','imile@88174','imile@88138'],
        condition: {
          passageway: '',
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
      uploadFile(params) {
        if(this.condition.passageway == null || this.condition.passageway === ''){
        	this.$message.warning("请选择对应的物流通道上传文件!");
        	return;
        }
        let form = handlePreUpload(params),
          that = this;
        form.append("passageway",that.condition.passageway)
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
      goAdd(){
        // this.$router.push({name:"AddOverseasStorage",params:{account:row}})
        this.$router.push({name:"AddOverseasStorage"})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-input {
    max-width: 230px;
  }
</style>
