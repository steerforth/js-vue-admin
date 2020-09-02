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
            <el-form-item label="原城市名" prop="k">
              <el-input v-model="postForm.k"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="映射城市名" prop="v">
              <el-input v-model="postForm.v"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
  <!-- <div slot="footer" class="dialog-footer">

    </div> -->
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {
    getById,
    update
  } from '@/api/mapForCityApi'

  export default {
    name: 'MapForCityDetail',
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
          k: {
            required: true,
            message: '请输入原城市名',
            trigger: ['change', 'blur']
          },
          v: {
            required: true,
            message: '请输入映射城市名',
            trigger: ['change', 'blur']
          },
        }
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

      // Why need to make a copy of this.$route here?
      // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
      // https://github.com/PanJiaChen/vue-element-admin/issues/1221
      // this.tempRoute = Object.assign({}, this.$route)
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
