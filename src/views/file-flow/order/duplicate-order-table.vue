<template>
  <div class="app-container repeat-order-list">
    <sticky :z-index="10" :class-name="'sub-navbar '+subNavBarCss">
      <el-button @click="cancel">返 回</el-button>
      <el-button type="primary" @click="submit">确定删除</el-button>
    </sticky>
    <el-table v-loading="loading" ref="table" :height="tableHeight" row-key="id" :data="repeatOrders" :row-class-name="tableRowClassName"
      default-expand-all style="width: 100%;" :tree-props="{children: 'repeatList', hasChildren: 'repeatList.length > 0'}">
      <el-table-column fixed="left" prop="orderNo" label="订单号" width="200">
      </el-table-column>
      <el-table-column fixed="left" prop="spec" label="规格" width="200">
      </el-table-column>
      <el-table-column prop="domain" label="域名" width="170">
      </el-table-column>
      <el-table-column prop="orderTime" label="下单时间" width="170">
      </el-table-column>
      <el-table-column prop="deliverStatus" label="配送状态" width="170">
      </el-table-column>
      <el-table-column prop="shortPhoneNum" label="手机号码" width="120">
      </el-table-column>
      <el-table-column prop="customer" label="买家" width="170">
      </el-table-column>
      <el-table-column prop="city" label="城市" width="150">
      </el-table-column>
      <el-table-column prop="area" label="地区" width="150">
      </el-table-column>
      <el-table-column prop="addr" label="详细地址" width="200">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope" v-if="scope.row.hasRepeat == true">
          <el-button size="mini" type="info" @click="handleDeleteOrRecover(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import {
    repeatOrders,
    deleteOrders
  } from '@/api/orderApi'
  export default {
    name: 'RepeatOrderTable',
    components: {
      Sticky
    },
    data() {
      return {
        loading: false,
        subNavBarCss: 'edit',
        tableHeight: DEFAULT_TABLE,
        repeatOrders: [],
        deleteOrderIds: [],
        deleteRowIdxs: []
      }
    },
    computed: {},
    mounted() {
      this.$nextTick(() => {
        this.handleResize()
      });
      window.addEventListener('resize', this.handleResize);
      this.getRepeatOrders()
    },
	destroyed() {
	  window.removeEventListener('resize', this.handleResize)
	},
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM);
      },
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (this.deleteRowIdxs.indexOf(rowIndex) > -1) {
          return 'delete-row'
        } else {
          return 'normal-row'
        }
      },
      getRepeatOrders() {
        let that = this
        that.loading = true;
        repeatOrders().then(
          res => {
            that.loading = false;
            this.$set(this, 'repeatOrders', res)
          },
          err => {
            that.loading = false;
          }
        )
      },
      submit() {
        let len = this.deleteOrderIds.length,
          that = this;
        if (len == 0) {
          that.$message.warning('无可删订单!');
          return;
        }
        that.loading = true;
        deleteOrders(that.deleteOrderIds).then(
          res => {
            that.loading = false
            that.$message.success(res)
          },
          err => {
            that.loading = false
          }
        )
      },
      //修改按钮名称，Row样式，
      handleDeleteOrRecover(index, row) {
        let target = event.target.tagName == "BUTTON" ? event.target : event.target.parentNode;
        if (target.innerText == "删除") {
          target.innerText = "恢复";
          target.className = "el-button el-button--success el-button--mini";

          this.deleteRowIdxs.push(index)
          this.deleteOrderIds.push(row.id);
        } else {
          target.innerText = "删除";
          target.className = "el-button el-button--info el-button--mini";

          let newRowIdx = this.deleteRowIdxs.filter(function(item) {
            return item != index
          });
          this.$set(this, 'deleteRowIdxs', newRowIdx)

          let newIds = this.deleteOrderIds.filter(function(item) {
            return item != row.id
          });
          this.$set(this, 'deleteOrderIds', newIds)
        }
      },
      cancel() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-table {
    .delete-row {
      background-color: #FF6666;
      text-decoration: line-through;
    }

    .normal-row {
      background-color: #FFF;
      text-decoration: blink;
    }
  }
</style>
