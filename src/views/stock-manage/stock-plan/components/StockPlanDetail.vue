<template>
  <div class="app-container" v-loading="loading">
    <el-form :model="postForm" ref="postForm" :rules="rules" label-position="right">
      <sticky :z-index="10" :class-name="'sub-navbar '+subNavBarCss">
        <el-button @click="cancel">返 回</el-button>
        <el-button type="info" @click="submitForm('DRAFT')" v-if="postForm.status == 'DRAFT'">存为草稿</el-button>
        <el-button type="primary" @click="submitForm('RELEASE')" v-if="postForm.status == 'DRAFT'">发 布</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="24">
            <el-form-item label="计划类型" prop="type">
              <el-select v-model="postForm.type" disabled>
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划人" prop="domain" v-if="type !='add'">
              <el-input v-model="postForm.planerName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的仓" prop="target">
              <el-select v-model="postForm.target" placeholder="请选择" :disabled="targetSelectDisabled">
                  <el-option
                    v-for="item in targetOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime" v-if="type != 'add'">
              <el-input v-model="postForm.createTime" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布时间" prop="releaseTime" v-if="type != 'add'">
              <el-input v-model="postForm.releaseTime" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" plain @click="addItem" v-if="showAddItem">新增明细</el-button>
      <el-table v-loading="tableLoading" :data="postForm.items" stripe style="width:100%" height="380px">
        <el-table-column label="SKU">
          <template slot-scope="scope">
            <el-form-item :prop="'items.' + scope.$index + '.sku'" :rules='rules.sku'>
              <el-input v-model="scope.row.sku" placeholder="请选择sku" @click.native="openSkuTableDialog(scope.$index)" readonly :disabled="postForm.status === 'RELEASE'"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column property="skuName" label="sku名称"></el-table-column>
        <el-table-column property="saleSituation" label="日均销售(件) / 时长(天)" v-if="showSituationColumn"></el-table-column>
        <el-table-column label="备货数量">
          <template slot-scope="scope">
            <el-form-item :prop="'items.' + scope.$index + '.amount'" :rules='rules.amount'>
              <el-input v-model="scope.row.amount" placeholder="请输入数量" :disabled="postForm.status === 'RELEASE'"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="showOpColumn">
          <template slot-scope="scope">
            <el-button @click="removeItem(scope.$index)" type="danger" size="mini" v-if="scope.row.status == 'DRAFT' || !scope.row.status">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <goods-sku-table :visible="dialogVisible" @db-click="handleSkuDbClick"></goods-sku-table>
  </div>
</template>

<!-- 1.提交SKU重复校验  2.草稿发布不校验空 3.计划发布人 后台处理 4.标题动态修改-->
<script>
  import Sticky from '@/components/Sticky'
  import GoodsSkuTable from '@/components/Service/GoodsSkuTable'
  import {
    stockPlanItemsByPlan,
    saveOrUpdate
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
      type: {
        type: String,
        default: 'see'
      }
    },
    data() {
      return {
        loading: false,
        tableLoading: false,
        // tableData: [],
        dialogVisible: false,
        postForm: {
          items:[]
        },
        curIndex:0,
        typeOptions:[
          {value:"COMMON", label:"普通备货"},
          {value:"FIRST", label:"新品首备"},
          {value:"SUPPLY", label:"	补充备货"},
        ],
        targetOptions: [
        	{value:"IMILE_UAE", label:"imile@阿联酋"},
        	{value:"IMILE_KSA", label:"imile@沙特"},
        	{value:"YOKESI_UAE", label:"yokesi@阿联酋"},
        	{value:"YOKESI_KSA", label:"yokesi@沙特"},
        	{value:"YOKESI_SHENZHEN", label:"yokesi@深圳"},
        	{value:"YIWU_LOCAL", label:"义乌本地仓"}
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
        if(this.type === 'add'){
          return 'add'
        }else{
          return 'edit'
        }
      },
      showSituationColumn(){
        return this.postForm.type != 'COMMON'
      },
      showOpColumn(){
        return this.postForm.status === 'DRAFT'
      },
      targetSelectDisabled(){
        return this.type === 'see' || this.postForm.status === 'RELEASE' || this.postForm.type != 'COMMON'
      },
      showAddItem(){
        return this.type != 'see' && this.postForm.status === 'DRAFT' && this.postForm.type === 'COMMON'
      }
    },
    created() {
      if (this.type === 'edit' || this.type === 'see') {
        const stockPlan = this.$route.params && this.$route.params.stockPlan
        this.$set(this, 'postForm', stockPlan)
        this.fetchData(stockPlan.id)
      }else{
        //新增 为普通备货的草稿
        this.$set(this.postForm,'type','COMMON')
        this.$set(this.postForm,'status','DRAFT')
        this.$set(this.postForm,'target','IMILE_UAE')
      }

      // let title = ''
      // if(this.postForm.type === 'COMMON'){
      //   title = '普通备货'
      // }else if(this.postForm.type === 'FIRST'){
      //   title = '新品首备'
      // }else if(this.postForm.type === 'SUPPLY'){
      //   title = '补充备货'
      // }
      // this.$route.meta.title = this.$route.meta.title+ '('+title+')'
    },
    methods: {
      fetchData(planId) {
        let that = this
        that.tableLoading = true
        stockPlanItemsByPlan(planId).then(
          res => {
            that.postForm.items = res
            that.tableLoading = false
          },
          err => {
            that.tableLoading = false
          }
        )
      },
      submitForm(status) {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            //重复SKU校验
            if(this.checkDuplicateSku()){
              return;
            }
            let that = this
            that.loading = true
            that.postForm.status = status
            saveOrUpdate(that.postForm).then(
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
      checkDuplicateSku(){
        let tableData = this.postForm.items
        var hash = {}
        for(let data of tableData){
          if(hash[data.sku]) {
            this.$message.warn('存在重复的SKU:'+data.sku)
            return true
          }
          hash[data.sku] = true
        }
        return false
      },
      removeItem(index){
        this.postForm.items.splice(index, 1);
      },
      addItem(){
        this.postForm.items.unshift({});
      },
      openSkuTableDialog(index){
        if(this.isEdit){
        	return;
        }
        this.$set(this,'curIndex',index)
        this.$set(this,"dialogVisible",true)
      },
      handleSkuDbClick(goodsSku){
        let row = this.postForm.items[this.curIndex]
        row.sku = goodsSku.sku
        row.skuName = goodsSku.name
        row.skuNameEn = goodsSku.nameEn
        this.$set(this.postForm.items,this.curIndex,row)
        this.$set(this,"dialogVisible",false)
      }
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
