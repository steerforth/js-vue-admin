<template>
  <div class="app-container">
    <el-form :model="postForm" ref="postForm" :rules="rules" label-position="right" label-width="120px">
      <sticky :z-index="10" :class-name="'sub-navbar '+subNavBarCss">
        <el-button @click="cancel">返 回</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </sticky>
      <div class="form-container">
        <el-row>
          <el-col :span="24">
            <el-form-item label="日期" prop="orderDay">
              <el-input v-model="postForm.orderDay" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="广告投入" prop="adCost">
              <el-input v-model="postForm.adCost"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审单费用1" prop="checkCost">
              <el-input v-model="postForm.checkCost" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审单费用2" prop="checkCost2">
              <el-input v-model="postForm.checkCost2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采购费用" prop="purchaseCost">
              <el-input v-model="postForm.purchaseCost"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国内物流费用" prop="deliveryCost">
              <el-input v-model="postForm.deliveryCost"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="COD费用" prop="codCost">
              <el-input v-model="postForm.codCost"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运营费用" prop="serviceCost">
              <el-input v-model="postForm.serviceCost"></el-input>
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
    update
  } from '@/api/accountApi'
  import {
    validElPosNum
  } from '@/utils/el-form-validate'

  export default {
    name: 'AccountDetail',
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
          adCost: {
            validator: validElPosNum,
            trigger: ['change', 'blur']
          },
          checkCost2: {
            validator: validElPosNum,
            trigger: ['change', 'blur']
          },
          purchaseCost: {
            validator: validElPosNum,
            trigger: ['change', 'blur']
          },
          deliveryCost: {
            validator: validElPosNum,
            trigger: ['change', 'blur']
          },
          codCost: {
            validator: validElPosNum,
            trigger: ['change', 'blur']
          },
          serviceCost: {
            validator: validElPosNum,
            trigger: ['change', 'blur']
          },
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
        const postForm = this.$route.params && this.$route.params.account
        this.$set(this,'postForm',postForm)
      }
    },
    methods: {
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
