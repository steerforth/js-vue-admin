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
            <el-form-item label="订单编号">
              <el-input prefix-icon="el-icon-search" v-model="condition.orderNo" placeholder="请输入1688订单编号查询"
               autocomplete="off" @change="queryUnArrived"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" plain @click="handleStockAmount">一键处理</el-button>
      <el-table :data="postForm.tableData" stripe style="width:100%" height="380px">
        <el-table-column property="orderNo" label="1688订单号"></el-table-column>
        <el-table-column property="sku" label="SKU"></el-table-column>
        <el-table-column property="orderTime" label="下单时间"></el-table-column>
        <el-table-column property="orderAmount" label="下单数量"></el-table-column>
        <el-table-column property="stockAmount" label="备货数量"></el-table-column>
        <el-table-column label="备货到货数量">
        	<template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.arrivedAmount'" :rules='rules.arrivedAmount'>
              <el-input v-model="scope.row.arrivedAmount" placeholder="请输入数量" @change="checkArriveAmount(scope.row)"></el-input>
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
    unArrived,
    saveArrived
  } from '@/api/purchaseOrderItemApi'
  import {
    validElPI
  } from '@/utils/el-form-validate'

  export default {
    name: 'LocalCheckin',
    components: {
      Sticky
    },
    props: {

    },
    data() {
      return {
        loading: false,
        postForm: {
          tableData:[]
        },
        condition:{
        	//1688订单号
        	orderNo:''
        },
        rules: {
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
      this.queryUnArrived()
    },
    methods: {
      queryUnArrived(){
        let that = this
        that.loading = true
        unArrived(that.condition).then(
          res => {
            that.loading = false
            that.$set(that.postForm, 'tableData', res)
          },
          err => {
            that.loading = false
          }
        )
      },
      handleStockAmount(){
      	let tableData = this.postForm.tableData;
      	for(let data of tableData){
      		data.arrivedAmount = data.stockAmount;
      	}
      	this.$set(this.postForm,"tableData",tableData);
      },
      checkArriveAmount(row){
        let reg = /^[0-9]\d*$/;
        var arrivedAmount = row.arrivedAmount;
        if(!new RegExp(reg).test(arrivedAmount)){
          this.$message.warning('请填写正确的数字')
        	row.arrivedAmount = 0;
        	return;
        }
        if(arrivedAmount > row.stockAmount){
          this.$message.warning('备货到货数量不能大于备货数量')
        	row.arrivedAmount = 0;
        	return;
        }
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {

            let that = this
            that.loading = true
            saveArrived(that.postForm.tableData).then(
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
  ::v-deep .form-container .el-form-item .el-form-item__label{
    width: 120px;
  }
  ::v-deep .form-container .el-form-item .el-form-item__content{
    margin-left: 120px;
  }

</style>
