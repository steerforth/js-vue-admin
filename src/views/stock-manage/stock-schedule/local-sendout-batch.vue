<template>
  <div class="app-container" v-loading="loading">
    <el-form :model="postForm" ref="postForm" :rules="rules" label-position="right">
      <sticky :z-index="10" :class-name="'sub-navbar '+subNavBarCss">
        <el-button @click="cancel">返 回</el-button>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="24">
            <el-form-item label="发货单号:" prop="billNo">
              <el-input v-model="postForm.billNo" placeholder="请输入发货单号" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发货日期:" prop="deliverDate">
              <el-date-picker type="date" v-model="postForm.deliverDate" placeholder="选择日期" :picker-options="pickerOptions"
                value-format="yyyy-MM-dd" :clearable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" plain @click="handleDeliverAmount">一键处理</el-button>
      <el-table :data="postForm.tableData" stripe style="width:100%" height="380px">
        <el-table-column property="sku" label="SKU"></el-table-column>
        <el-table-column property="releaseTime" label="备货计划发布时间"></el-table-column>
        <el-table-column property="amount" label="备货计划数量"></el-table-column>
        <el-table-column label="发货数量">
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.deliverToOverseaAmount'" :rules='rules.deliverToOverseaAmount'>
              <el-input v-model="scope.row.deliverToOverseaAmount" placeholder="请输入数量" @change="checkAmount(scope.row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {
    batchCreate
  } from '@/api/deliverForPlanApi'
  import '@/utils/date'
  import {
    validElPI
  } from '@/utils/el-form-validate'

  export default {
    name: 'LocalSendout',
    components: {
      Sticky
    },
    props: {

    },
    data() {
      return {
        loading: false,
        postForm: {
          billNo: '',
          deliverDate: new Date().format('yyyy-MM-dd'),
          tableData: []
        },
        pickerOptions: {
        	disabledDate: (time) => {
        		return time.getTime() > Date.now();
        	}
        },
        rules: {
          billNo: {
            required: true,
            message: '请输入运单号',
            trigger: ['change', 'blur']
          },
          deliverDate: {
            required: true,
            message: '请选择发货日期',
            trigger: ['change', 'blur']
          },
          deliverToOverseaAmount: [{
            validator: validElPI,
            trigger: ['change', 'blur']
          }],
        },
      }
    },
    computed: {
      subNavBarCss() {
        return 'edit'
      }
    },
    created() {
      const multiSel = this.$route.params && this.$route.params.selection
      this.$set(this.postForm, 'tableData', multiSel)
    },
    methods: {
      handleDeliverAmount() {
        let multiSel = this.postForm.tableData;
        for (let sel of multiSel) {
          sel.deliverToOverseaAmount = sel.amount;
        }
        this.$set(this.postForm, "tableData", multiSel);
      },
      checkAmount(row) {
        let reg = /^[1-9]\d*$/;
        var deliverToOverseaAmount = row.deliverToOverseaAmount;
        if (!new RegExp(reg).test(deliverToOverseaAmount)) {
          this.$message.warning('请填写正确的数字')
          row.deliverToOverseaAmount = 0;
          return;
        }
        if (deliverToOverseaAmount > row.amount) {
          this.$message.warning('发货数量不能大于计划数量')
          row.deliverToOverseaAmount = 0;
          return;
        }
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            let that = this,
              tableData = this.postForm.tableData,
              condition = []
            //实体类不一样
            for (var data of tableData) {
              var deliverPlan = {};
              deliverPlan.planItemId = data.id;
              deliverPlan.sku = data.sku;
              deliverPlan.amount = data.deliverToOverseaAmount;
              deliverPlan.billNo = this.postForm.billNo
              deliverPlan.deliverDate = this.postForm.deliverDate;
              condition.push(deliverPlan)
            }

            that.loading = true
            batchCreate(condition).then(
              res => {
                that.loading = false
                that.$message.success(res)
              },
              err => {
                that.loading = false
              }
            )
          } else {
            this.$message.warning('请填写正确的表单内容')
            return false
          }
        })
      },
      cancel() {
        this.$router.go(-1)
      },
    },

  }
</script>

<style lang="scss" scoped>
  // el-form的label-width和el-table中的el-form-item冲突
  ::v-deep .form-container .el-form-item .el-form-item__label {
    width: 120px;
  }

  ::v-deep .form-container .el-form-item .el-form-item__content {
    margin-left: 120px;
  }
</style>
