<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="postForm" ref="postForm" :rules="rules" label-position="right" label-width="120px">
      <sticky :z-index="10" :class-name="'sub-navbar '+subNavBarCss">
        <el-button @click="cancel">返 回</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
        	<el-col :span="12">
        		<el-form-item label="物流通道" prop="passageway">
        			<el-select v-model="postForm.passageway" :disabled="isEdit">
        			    <el-option
        			      v-for="item in options"
        			      :key="item"
        			      :label="item"
        			      :value="item">
        			    </el-option>
        			</el-select>
        		</el-form-item>
        	</el-col>
        	<el-col :span="12">
        		<el-form-item label="仓库网点" prop="storeName">
        			<el-select v-model="postForm.storeName" :disabled="isEdit">
        			    <el-option
        			      v-for="item in optionsForSite"
        			      :key="item"
        			      :label="item"
        			      :value="item">
        			    </el-option>
        			</el-select>
        		</el-form-item>
        	</el-col>
        </el-row>
        <el-row>
        	<el-col :span="12">
        		<el-form-item label="SKU" prop="sku">
        			<el-input v-model="postForm.sku" readonly @click.native="openSkuTableDialog" placeholder="请选择SKU"></el-input>
        		</el-form-item>
        	</el-col>
        	<el-col :span="12">
        		<el-form-item label="商品名称" prop="goodsName">
        			<el-input v-model="postForm.goodsName" readonly></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>
        <el-row>
        	<el-col :span="24">
        		<el-form-item label="库存" prop="amount">
        			<el-input-number size="medium" v-model="postForm.amount" :precision="0" :min="1" label="库存数量"></el-input-number>
        		</el-form-item>
        	</el-col>
        </el-row>
      </div>
    </el-form>
    <goods-sku-table :visible="dialogVisible" @db-click="handleSkuDbClick"></goods-sku-table>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import GoodsSkuTable from '@/components/Service/GoodsSkuTable'
  import {
    getById,
    saveOrUpdate
  } from '@/api/overseasStorageApi'
  import {
    validElPI
  } from '@/utils/el-form-validate'

  export default {
    name: 'OverseasStorageDetail',
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
        postForm: {},
        options: ['yokesi@20125','imile@88172','imile@88174','imile@88138'],
        yokesiSites: ['迪拜1仓', '沙特2仓', '沙特3仓'],
        imileSites: ['Riyadh Return Center','Dubai Center'],
        optionsForSite: [],
        dialogVisible: false,
        rules:{
        	passageway:{
        		required: true,
        		message: '请选择物流通道账号',
        		trigger: ['change', 'blur']
        	},
        	storeName:{
        		required: true,
        		message: '请选择仓库网点',
        		trigger: ['change', 'blur']
        	},
        	sku:{
        		required: true,
        		message: '请选择SKU',
        		trigger: ['change', 'blur']
        	},
        	amount:[{
        		validator: validElPI,
        		trigger: ['change', 'blur']
        	}],
        }
      }
    },
    watch:{
    	'postForm.passageway':{
    		handler(newValue) {
    		   if(!this.isEdit){
    		   	if(newValue.indexOf("imile") > -1){
    		   		this.$set(this,'optionsForSite',this.imileSites);
    		   		this.$set(this.postForm,'storeName',this.imileSites[0]);
    		   	}else if(newValue.indexOf("yokesi") > -1){
    		   		this.$set(this,'optionsForSite',this.yokesiSites);
    		   		this.$set(this.postForm,'storeName',this.yokesiSites[0]);
    		   	}else{
    		   		log.error("未找到匹配的通道")
    		   		this.$set(this,'optionsForSite',[]);
    		   		this.$set(this.postForm,'storeName',null);
    		   	}
    		   }
    		},
    		deep: true
    	}
    },
    computed: {
      subNavBarCss() {
        return this.isEdit ? 'edit' : 'add'
      }
    },
    created() {
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
      }else{
        this.$set(this.postForm,'amount',1)
        this.$set(this.postForm,'passageway',this.options[0])
      }
    },
    methods: {
      fetchData(id) {
        let that = this
        getById(id).then(
          res => {
            that.postForm = res
          },
          err => {

          }
        )
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            let that = this;
            that.loading = true
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
      openSkuTableDialog(){
        if(this.isEdit){
        	return;
        }
        this.$set(this,"dialogVisible",true)
      },
      handleSkuDbClick(sku, cnName){
         this.$set(this,"dialogVisible",false)
         this.$set(this.postForm,'sku',sku)
         this.$set(this.postForm,'goodsName',cnName)
      }
    },

  }
</script>

<style>
</style>
