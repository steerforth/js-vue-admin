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
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="postForm.name" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="SKU" prop="sku">
              <el-input v-model="postForm.sku" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="采购费用" prop="cost">
              <el-input v-model="postForm.cost"></el-input>
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
  } from '@/api/goodsApi'
  import {
    validElPosNum
  } from '@/utils/el-form-validate'

  export default {
    name: 'GoodsDetail',
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
          cost: [{
            validator: validElPosNum,
            trigger: ['change', 'blur']
          }, {
            required: true,
            message: '请输入采购费用',
            trigger: ['change', 'blur']
          }]
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
