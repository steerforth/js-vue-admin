<template>
  <div class="app-container" v-loading="loading">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-button-group>
        <el-button @click="firstStock">新品首备</el-button>
        <el-button @click="supplyStock">补充备货</el-button>
        <el-button @click="goAdd">新增计划</el-button>
      </el-button-group>
    </sub-navbar>
    <el-table ref="table" :data="page.records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column label="计划状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="colorForStatus[scope.row.status]"
            disable-transitions>{{scope.row.status | getStatusName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="planerName" label="计划人" align="center">
      </el-table-column>
      <el-table-column :formatter="formatType" label="SKU计划类型" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column prop="releaseTime" label="发布时间" align="center">
      </el-table-column>
      <el-table-column :formatter="formatTarget" label="目的仓" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="remove(scope.row.id)" type="danger" size="mini" v-if="scope.row.status == 'DRAFT'">删除</el-button>
          <!-- <router-link :to="'/stock-plan/goods-sku/edit/'+scope.row.id"> -->
            <el-button size="mini" @click="goEdit(scope.row)">{{scope.row.status == 'DRAFT' ? '修改' : '查看'}}</el-button>
          <!-- </router-link> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.pageIndex"
      :page-sizes="[20, 50, 100]" :page-size="condition.pageSize" layout="sizes, prev, pager, next, total" :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    planPage,
    firstStock,
    supplyStock,
    deleteOne
  } from '@/api/stockPlanApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'

  export default {
    name: 'PurchaseSchedule',
    components: {
      SubNavbar
    },
    filters: {
      getStatusName(status){
        switch(status){
        	case "DRAFT":
        		return "草稿";
        	case "RELEASE":
        		return "已发布";
        	default:
        		return "未知";
        }
      }
    },
    data() {
      return {
        loading: false,
        page: {
          total: 0,
          records: []
        },
        condition: {
          pageIndex: 1,
          pageSize: 20,
        },
        tableHeight: DEFAULT_TABLE,
        colorForStatus:{
        	"DRAFT": "info",
          "RELEASE": "success",
        },
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
        planPage(this.condition).then(
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
      formatType(row, column){
        if(row.type === 'FIRST'){
          return '新品首备'
        }else if(row.type === 'SUPPLY'){
          return '补充备货'
        }else if(row.type === 'COMMON'){
          return '普通备货'
        }else{
          return '未知'
        }
      },
      formatTarget(row, column){
        if(row.target === 'IMILE_UAE'){
          return 'imile@阿联酋'
        }else if(row.target === 'IMILE_KSA'){
          return 'imile@沙特'
        }else if(row.target === 'YOKESI_UAE'){
          return 'yokesi@阿联酋'
        }else if(row.target === 'YOKESI_KSA'){
          return 'yokesi@沙特'
        }else if(row.target === 'YOKESI_SHENZHEN'){
          return 'yokesi@深圳'
        }else if(row.target === 'YIWU_LOCAL'){
          return '义乌本地仓'
        }else{
          return '未知'
        }
      },
      firstStock(){
        let that = this
        that.loading = true
        firstStock().then(
          res => {
            that.loading = false
            that.loadPage()
          },
          err => {
            that.loading = false
          }
        )
      },
      supplyStock(){
        let that = this
        that.loading = true
        supplyStock().then(
          res => {
            that.loading = false
            if(res.success){
            	that.$message.success(res.success);
            }
            if(res.errorSku){
              that.$message({
                duration: 0,
                showClose: true,
                message: res.errorSku,
                type: 'error'
              });
            }
            that.loadPage()
          },
          err => {
            that.loading = false
          }
        )
      },
      remove(id){
        let that = this
        that.loading = true
        deleteOne(id).then(
          res => {
            that.loading = false
            that.loadPage()
          },
          err => {
            that.loading = false
          }
        )
      },
      goEdit(row){
        this.$router.push({name:"EditStockPlan",params:{stockPlan:row}})
      },
      goAdd(){
        this.$router.push({name:"AddStockPlan"})
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
