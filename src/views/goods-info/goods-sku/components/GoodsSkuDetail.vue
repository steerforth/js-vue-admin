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
            <el-form-item label="域名" prop="domain">
              <el-input v-model="postForm.domain" readonly></el-input>
              <!-- <el-select v-model="postForm.domain" placeholder="请输入站点" >
        			    <el-option
        			      v-for="item in shops"
        			      :key="item.id"
        			      :label="item.name"
        			      :value="item.domain">
        			    </el-option>
        			</el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ID" prop="goodsId">
              <el-input v-model="postForm.goodsId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createAt">
              <el-input v-model="postForm.createAt" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间" prop="updateAt">
              <el-input v-model="postForm.updateAt" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="sku" prop="sku">
              <el-input v-model="postForm.sku" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="sku缩写" prop="shortSku">
              <el-input v-model="postForm.shortSku" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="在售规格" prop="spec">
              <el-input v-model="postForm.spec"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="英文名" prop="nameEn">
              <el-input v-model="postForm.nameEn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="中文名" prop="name">
              <el-input v-model="postForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="中文缩写" prop="shortName">
              <el-input v-model="postForm.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="amount">
              <el-input-number size="medium" v-model="postForm.amount" :precision="0" :min="1" label="库存数量"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {
    getById,
    update
  } from '@/api/goodsSkuApi'
  import {
    validElPI,
    validElPINotRequired
  } from '@/utils/el-form-validate'

  export default {
    name: 'GoodsSkuDetail',
    components: {
      Sticky
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
        rules: {
          // domain:{
          // 	required: true,
          // 	message: '请选择域名',
          // 	trigger: ['change', 'blur']
          // },
          goodsId: [{
            validator: validElPINotRequired,
            trigger: ['change', 'blur']
          }],
          // sku:{
          // 	required: true,
          // 	message: '请输入SKU',
          // },
          // shortSku:{
          // 	required: true,
          // 	message: '请输入SKU缩写',
          // },
          spec: {
            required: true,
            message: '请输入规格',
            trigger: ['change', 'blur']
          },
          nameEn: {
            required: true,
            message: '请输入英文名',
            trigger: ['change', 'blur']
          },
          name: {
            required: true,
            message: '请输入中文名',
            trigger: ['change', 'blur']
          },
          shortName: {
            required: true,
            message: '请输入中文缩写',
            trigger: ['change', 'blur']
          },
          amount: [{
            validator: validElPI,
            trigger: ['change', 'blur']
          }, {
            required: true,
            message: '请输入数量',
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
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
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
            update(that.postForm).then(
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
      }
    },

  }
</script>

<style>
</style>
