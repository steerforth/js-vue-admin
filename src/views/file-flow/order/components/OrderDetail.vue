<template>
  <div class="app-container">
    <el-form v-loading="loading" :model="postForm" ref="postForm" :rules="rules" label-position="right" label-width="120px">
      <sticky :z-index="10" :class-name="'sub-navbar '+subNavBarCss">
        <el-button @click="cancel">返 回</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单号" prop="orderNo">
              <el-input v-model="postForm.orderNo" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品链接" prop="goodsLink">
              <el-input v-model="postForm.goodsLink" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
          	<el-form-item label="商品标题" prop="title">
          		<el-input v-model="postForm.title"></el-input>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
          	<el-form-item label="规格" prop="spec">
          		<el-input v-model="postForm.spec"></el-input>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          	<el-form-item label="单价" prop="price">
          		<el-input v-model="postForm.price"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="12">
          	<el-form-item label="数量" prop="amount">
          		<el-input v-model="postForm.amount"></el-input>
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
  } from '@/api/orderApi'
  import {
    validElPI,
    validElPosNum
  } from '@/utils/el-form-validate'

  export default {
    name: 'OrderDetail',
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
          title:{
          	required: true,
          	message: '请输入商品标题',
          	trigger: ['change', 'blur']
          },
          spec:{
          	required: true,
          	message: '请输入商品规格',
          	trigger: ['change', 'blur']
          },
          price:[{
          	required: true,
          	message: '请输入商品价格',
          	trigger: ['change', 'blur']
          },{
          	validator: validElPosNum,
          	trigger: ['change', 'blur']
          }],
          amount:[{
          	required: true,
          	message: '请输入商品数量',
          	trigger: ['change', 'blur']
          },{
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
