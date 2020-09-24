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
            <el-form-item label="运单号:" prop="billNo">
              <el-input v-model="postForm.billNo" @change="getDeliverRecords"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="到货日期:" prop="arriveDate">
              <!-- TODO 格式化 format -->
              <el-date-picker type="date" v-model="postForm.arriveDate" placeholder="选择日期" :picker-options="pickerOptions" :clearable="false" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-table :data="postForm.tableData" stripe style="width:100%" height="380px">
        <el-table-column prop="sku" label="SKU" align="center">
        </el-table-column>
        <el-table-column prop="amount" label="发货数量" align="center">
        </el-table-column>
        <el-table-column label="到货数量" align="center">
        	<template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.arrivedAmount'" :rules='rules.arrivedAmount'>
              <el-input v-model="scope.row.arrivedAmount" placeholder="请输入数量" @input="checkAmount(scope.row)"></el-input>
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
    deliverForPlanByBilNo,
    handleArrivedFromImile
  } from '@/api/stockPlanApi'
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
          arriveDate: new Date().format('yyyy-MM-dd'),
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
            message: '请输入发货单号',
            trigger: ['change', 'blur']
          },
          arriveDate: {
            required: true,
            message: '请选择发货日期',
            trigger: ['change', 'blur']
          },
          arrivedAmount: [{
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
    },
    methods: {
      getDeliverRecords(){
        let that = this
        that.loading = true
        deliverForPlanByBilNo(that.postForm.billNo).then(
          res => {
            that.loading = false
            that.$set(that.postForm, 'tableData', res);
          },
          err => {
            that.loading = false
          }
        )
      },
      checkAmount(row) {
        let reg = /^[1-9]\d*$/;
        if (!new RegExp(reg).test(row.arrivedAmount)) {
          this.$message.warning('请填写正确的数字')
          row.arrivedAmount = 0;
          return;
        }
        if (row.arrivedAmount > row.amount) {
          this.$message.warning('到货数量不能大于发货数量')
          row.arrivedAmount = 0;
          return;
        }
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            let that = this
            if(that.postForm.tableData.length == 0){
              that.$message.warning('无可提交数据')
              return;
            }
            that.loading = true
            handleArrivedFromImile(that.postForm.arriveDate, that.postForm.tableData).then(
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
