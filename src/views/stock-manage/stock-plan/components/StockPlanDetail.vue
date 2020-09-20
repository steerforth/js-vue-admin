<template>
  <div class="app-container" v-loading="loading">
    <el-form :model="postForm" ref="postForm" :rules="rules" label-position="right">
      <sticky :z-index="10" :class-name="'sub-navbar '+subNavBarCss">
        <el-button @click="cancel">返 回</el-button>
        <el-button type="info" @click="submitForm">存为草稿</el-button>
        <el-button type="primary" @click="submitForm">发 布</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划人" prop="domain" v-if="isEdit">
              <el-input v-model="postForm.planerName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的仓" prop="target">
              <el-select v-model="postForm.target" placeholder="请选择">
                  <el-option
                    v-for="item in targetOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime" v-if="isEdit">
              <el-input v-model="postForm.createTime" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布时间" prop="releaseTime" v-if="isEdit">
              <el-input v-model="postForm.releaseTime" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" plain @click="addItem" v-if="!isEdit">新增明细</el-button>
      <el-table v-loading="tableLoading" :data="postForm.tableData" stripe style="width:100%" height="380px">
        <el-table-column label="SKU">
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.sku'" :rules='rules.sku'>
              <el-input v-model="scope.row.sku" placeholder="请选择sku" @click.native="openSkuTableDialog(scope.$index)" readonly></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="skuName" label="sku名称"></el-table-column>
        <el-table-column property="saleSituation" label="日均销售(件) / 时长(天)"></el-table-column>
        <el-table-column label="备货数量">
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.amount'" :rules='rules.amount'>
              <el-input v-model="scope.row.amount" placeholder="请输入数量"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="removeItem(scope.$index)" type="danger" size="mini" v-if="scope.row.status == 'DRAFT' || !scope.row.status">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <goods-sku-table :visible="dialogVisible" @db-click="handleSkuDbClick"></goods-sku-table>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import GoodsSkuTable from '@/components/Service/GoodsSkuTable'
  import {
    stockPlanItemsByPlan,
    // update
  } from '@/api/stockPlanApi'
  import {
    validElPI
  } from '@/utils/el-form-validate'

  export default {
    name: 'StockPlanDetail',
    components: {
      Sticky, GoodsSkuTable
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        tableLoading: false,
        // tableData: [],
        dialogVisible: false,
        postForm: {
          tableData:[]
        },
        curIndex:0,
        targetOptions: [
        	{value:"IMILE_UAE", name:"imile@阿联酋"},
        	{value:"IMILE_KSA", name:"imile@沙特"},
        	{value:"YOKESI_UAE", name:"yokesi@阿联酋"},
        	{value:"YOKESI_KSA", name:"yokesi@沙特"},
        	{value:"YOKESI_SHENZHEN", name:"yokesi@深圳"},
        	{value:"YIWU_LOCAL", name:"义乌本地仓"}
        ],
        rules: {
          target: {
            required: true,
            message: '请选择目的仓',
            trigger: ['change', 'blur']
          },
          sku: {
            required: true,
            message: '请选择sku',
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
        return this.isEdit ? 'edit' : 'add'
      }
    },
    created() {
      if (this.isEdit) {
        const stockPlan = this.$route.params && this.$route.params.stockPlan
        this.$set(this, 'postForm', stockPlan)
        this.fetchData(stockPlan.id)
      }
    },
    methods: {
      fetchData(planId) {
        let that = this
        that.tableLoading = true
        stockPlanItemsByPlan(planId).then(
          res => {
            that.postForm.tableData = res
            that.tableLoading = false
          },
          err => {
            that.tableLoading = false
          }
        )
      },
      //            <!--编辑界面 样式问题 SKU重复校验-->
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            let that = this;
            that.loading = true
            // update(that.postForm).then(
            //   res => {
            //     that.loading = false
            //     that.$message.success(res)
            //   },
            //   err => {
            //     that.loading = false
            //   }
            // )
            that.loading = false
          } else {
            this.$message.warning('请填写正确的表单内容')
            return false
          }
        })
      },
      cancel() {
        this.$router.go(-1)
      },
      removeItem(index){
        this.postForm.tableData.splice(index, 1);
      },
      addItem(){
        this.postForm.tableData.unshift({});
      },
      openSkuTableDialog(index){
        if(this.isEdit){
        	return;
        }
        this.$set(this,'curIndex',index)
        this.$set(this,"dialogVisible",true)
      },
      handleSkuDbClick(goodsSku){
        let row = this.postForm.tableData[this.curIndex]
        row.sku = goodsSku.sku
        row.skuName = goodsSku.name
        row.skuNameEn = goodsSku.nameEn
        this.$set(this.postForm.tableData,this.curIndex,row)
        this.$set(this,"dialogVisible",false)
      }
    },

  }
</script>

<style lang="scss" scoped>
  // el-form的label-width和el-table中的el-form-item冲突
  //TODO 没生效
  ::v-deep .el-form-item .el-form-item__label{
    width: 120px;
  }
</style>
