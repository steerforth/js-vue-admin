<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-cascader style='min-width:310px' :options="optionsForMulti" :props="{multiple: true}" placeholder="广告代理/站点"
        collapse-tags clearable v-model="shopIdsArr">
      </el-cascader>
      <el-tooltip class="item" effect="dark" content="查询" placement="right-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="loadPage"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="新增记录" placement="right-end">
        <el-button icon="el-icon-plus" circle @click="goAdd"></el-button>
      </el-tooltip>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="page.records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column prop="rechargeTime" label="充值日期" align="center">
      </el-table-column>
      <el-table-column prop="shopName" label="网店名称" align="center">
      </el-table-column>
      <el-table-column prop="agent" label="广告代理商" align="center">
      </el-table-column>
      <el-table-column prop="money" label="充值金额/$" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="remove(scope.row)" type="danger" size="mini">删除</el-button>
          <router-link :to="'/ad-manage/recharge/edit/'+scope.row.id">
            <el-button size="mini">编辑</el-button>
          </router-link>
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
    optionForAgent
  } from '@/api/shopApi'
  import {
    page,
    deleteOne
  } from '@/api/adRechargeApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'

  export default {
    name: 'AdManageList',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        optionsForMulti:[],
        //for多选
        shopIdsArr:[],
        page: {
          total: 0,
          records: []
        },
        condition: {
          shopIds: [],
          pageIndex: 1,
          pageSize: 20,
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
      loadPage() {
        let that = this, shopIds = [];

        //去除分组的值
        for (var shopIdArr of that.shopIdsArr) {
          shopIds.push(shopIdArr[1])
        }
        that.$set(that.condition,'shopIds',shopIds)

        that.loading = true
        page(that.condition).then(
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
        optionForAgent().then(
          res => {
            var optionsForMulti = this.buildOptionForMulti(res);
            that.$set(that, 'optionsForMulti', optionsForMulti);
            that.loadPage()
          },
          err => {

          }
        )
      },
      buildOptionForMulti(optionForAgent){
        var optionsForMulti = [];
        for(var option of optionForAgent){
          var op = {};
          op.label = option.agent;
          op.value = 'null';
          var children = [];
          if(option.shops != null){
            for(var shop of option.shops){
              var child = {};
              child.label = shop.name;
              child.value = shop.id;
              children.push(child);
            }
          }
          op.children = children;
          optionsForMulti.push(op);
        }
        return optionsForMulti;
      },
      remove(row){
      	this.$confirm('此操作将删除[日期:'+row.rechargeTime+',网店:'+row.shopName+']的广告充值记录, 是否继续?', '提示', {
      	  confirmButtonText: '确定',
      	  cancelButtonText: '取消',
      	  type: 'warning'
      	}).then(() => {
          deleteOne(row.id).then(
            res => {
              this.loadPage()
            },
            err => {

            }
          )
      	}).catch(action => {
      		if(action === 'cancel'){
            this.$message.info('已取消删除')
      		}
      	});

      },
      goAdd(){
        this.$router.push('/ad-manage/recharge/add')
      }
    }
  }
</script>

<style lang="scss" scoped>
  /* 解决el-button转圈遮罩层为正方形的BUG ::v-deep样式穿透*/
  ::v-deep .el-loading-mask {
    border-radius: 50%;
  }

</style>
