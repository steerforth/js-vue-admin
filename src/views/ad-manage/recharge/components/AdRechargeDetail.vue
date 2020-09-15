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
            <el-form-item label="充值日期" prop="rechargeTime">
              <el-date-picker
                v-model="postForm.rechargeTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :readonly="isEdit">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="充值店铺" prop="shopId">
              <el-select v-model="postForm.shopId" clearable filterable placeholder="请输入站点" :disabled="isEdit">
                <el-option v-for="item in shops" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
              <!-- <el-input v-model="postForm.shopName" readonly></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="充值金额" prop="money">
              <el-input v-model="postForm.money"></el-input>
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
    saveOrUpdate
  } from '@/api/adRechargeApi.js'
  import {
    shopList
  } from '@/api/shopApi'
  import {
    validElPosNum
  } from '@/utils/el-form-validate'

  export default {
    name: 'AdRechargeDetail',
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
        shops:[],
        rules: {
          rechargeTime:{
          	required: true,
          	message: '请选择充值日期',
          	trigger: ['change', 'blur']
          },
          shopId:{
          	required: true,
          	message: '请选择充值店铺',
          	trigger: ['change', 'blur']
          },
          money: [{
            validator: validElPosNum,
            trigger: ['change', 'blur']
          }, {
            required: true,
            message: '请输入充值金额',
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
      this.loadShops()
    },
    methods: {
      loadShops() {
        let that = this
        shopList().then(
          res => {
            that.$set(that,'shops',res)
            if (that.isEdit) {
              const id = that.$route.params && that.$route.params.id
              that.fetchData(id)
            }
          },
          err => {

          }
        )
      },
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
      }
    },

  }
</script>

<style>
</style>
