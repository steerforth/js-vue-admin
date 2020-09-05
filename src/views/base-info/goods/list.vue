<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-input placeholder="请输入中文名/SKU" v-model="condition.query" clearable @keyup.enter.native="loadGoods">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="goodsPage.records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column prop="name" label="名称" align="center">
      </el-table-column>
      <el-table-column prop="sku" label="SKU" align="center">
      </el-table-column>
      <el-table-column prop="cost" label="采购价格" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/base-info/goods/edit/'+scope.row.id">
            <el-button size="mini">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.index"
      :page-sizes="[100, 200, 300]" :page-size="condition.size" layout="sizes, prev, pager, next, total" :total="goodsPage.total">
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
    page
  } from '@/api/goodsApi'

  export default {
    name: 'GoodsList',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        shops: [],
        goodsPage: {
          total: 0,
          records: []
        },
        condition: {
          query: '',
          index: 1,
          size: 50,
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
      this.loadGoods();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM -
          this.$refs.pagination.$el.offsetHeight);
      },
      loadGoods() {
        let that = this
        that.loading = true
        page(this.condition).then(
          res => {
            that.loading = false
            that.$set(that, 'goodsPage', res)
          },
          err => {
            that.loading = false
          }
        )
      },
      handleSizeChange(val) {
        this.$set(this.condition, "index", 1);
        this.$set(this.condition, "size", val);
        this.loadGoods();
      },
      handleCurrentChange(val) {
        this.$set(this.condition, "index", val);
        this.loadGoods();
      }
    }
  }
</script>

<style lang="scss" scoped>
  /* 解决el-button转圈遮罩层为正方形的BUG ::v-deep样式穿透*/
  ::v-deep .el-loading-mask {
    border-radius: 50%;
  }

  .el-input {
    max-width: 280px;
  }
</style>
