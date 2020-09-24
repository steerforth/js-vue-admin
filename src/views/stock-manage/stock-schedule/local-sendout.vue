<template>
  <div class="app-container" v-loading="loading">
    <el-form :model="postForm" ref="postForm" :rules="rules" label-position="right">
      <sticky :z-index="10" :class-name="'sub-navbar '+subNavBarCss">
        <el-button @click="cancel">返 回</el-button>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="12">
            <el-form-item label="SKU:" prop="sku">
              <el-input v-model="postForm.sku" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备货计划数量:" prop="amount">
              <el-input v-model="postForm.amount" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备货计划发布时间:" prop="releaseTime">
              <el-input v-model="postForm.releaseTime" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" plain icon="el-icon-plus" @click="addNew">增加发货计划</el-button>
      <el-table :data="postForm.tableData" stripe style="width:100%" height="380px">
        <el-table-column label="发货的单号">
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.billNo'" :rules='rules.billNo'>
              <el-input v-model="scope.row.billNo" placeholder="请输入单号"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="发货日期">
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.deliverDate'" :rules='rules.deliverDate'>
              <el-date-picker type="date" v-model="scope.row.deliverDate" placeholder="选择日期" :picker-options="pickerOptions"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="发货数量">
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.amount'" :rules='rules.amount'>
              <el-input v-model="scope.row.amount" placeholder="请输入数量" @change="checkAmount(scope.row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="remove(scope.$index)" type="danger" size="mini" :disabled="scope.row.removable">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {
    edit,
    listByStockPlanItem
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
          deliverDate: {
            required: true,
            message: '请选择发货日期',
            trigger: ['change', 'blur']
          },
          amount: [{
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
      const selection = this.$route.params && this.$route.params.selection
      this.$set(this, 'postForm', selection)
      this.fetchById(selection.id)
    },
    methods: {
      fetchById(id) {
        let that = this
        that.loading = true
        listByStockPlanItem(id).then(
          res => {
            that.loading = false
            for(var plan of res){
            	plan.removable = true;
            }
            that.$set(that.postForm, 'tableData', res)
          },
          err => {
            that.loading = false
          }
        )
      },
      checkAmount(row) {
        let reg = /^[1-9]\d*$/;
        var amount = row.amount;
        if (!new RegExp(reg).test(amount)) {
          this.$message.warning('请填写正确的数字')
          row.amount = 0;
          return;
        }
        if (amount > this.postForm.amount) {
          this.$message.warning('发货数量不能大于计划数量')
          row.amount = 0;
          return;
        }
      },
      addNew() {
        var plan = {};
        plan.planItemId = this.postForm.id;
        plan.sku = this.postForm.sku;
        plan.amount = 0;
        plan.deliverDate = new Date().format('yyyy-MM-dd');
        plan.removable = false;
        var data = this.postForm.tableData;
        data.unshift(plan);
      },
      remove(index){
        this.postForm.tableData.splice(index,1);
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            let that = this,
              tableData = this.postForm.tableData
            //实体类不一样
            for (var deliverPlan of tableData) {
              deliverPlan.planItemId = this.postForm.id;
              deliverPlan.sku = this.postForm.sku;
            }

            that.loading = true
            edit(tableData).then(
              res => {
                that.loading = false
                this.handleUploadResMsg(res);
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
      handleUploadResMsg(res){
        if(typeof res == "object"){
        	var count = 0;
        	for(let key in res){
        		count++;
        		setTimeout(() => {
        			this.$message({
        				duration: 0,
        				showClose: true,
        				message: key + res[key],
        				type: 'info'
        			});
        		}, 200)
        	}
        	if(count == 0){
        		this.$message.success(msg);
        	}
        }else{
        	this.$message.success(res.body);
        }
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
