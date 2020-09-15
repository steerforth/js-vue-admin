<template>
  <div class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '">
      <el-button @click="cancel">返 回</el-button>
    </sticky>
    <div class="form-container">
      <el-form :model="postForm" ref="postForm" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="物流通道" prop="passageway">
              <el-tag>{{postForm.passageway}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单号" prop="orderNo">
              <el-tag>{{postForm.orderNo}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="运单号" prop="trackingNo">
              <el-tag>{{postForm.trackingNo}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-timeline v-loading="loading">
      <el-timeline-item v-for="(detail, index) in details" :key="index" :timestamp="detail.split('&')[0]">
        {{detail.split('&')[1]}}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {
    trackingDetails
  } from '@/api/orderApi'
  export default {
    name: 'TrackingDetail',
    components: {
      Sticky
    },
    data() {
      return {
        loading: false,
        postForm: {},
        details: []
      }
    },
    computed: {},
    created() {
      this.postForm = this.$route.params;
    },
    mounted() {
      this.getTrackingDetail()
    },
    methods: {
      getTrackingDetail() {
        let that = this
        that.loading = true
        trackingDetails(that.postForm).then(
          res => {
            that.loading = false
            that.$set(that, 'details', res);
          },
          err => {
            that.loading = false
          }
        )
      },
      cancel() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-timeline{
    min-height: 200px;
  }
</style>
