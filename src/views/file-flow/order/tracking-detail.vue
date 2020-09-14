<template>
  <div class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '">
      <el-button @click="cancel">返 回</el-button>
    </sticky>
    <el-form :model="postForm" ref="postForm" label-position="right" label-width="80px">
      <el-row>
      	<el-col :span="24">
      		<el-form-item label="物流通道" prop="passageway">
      			<el-input v-model="postForm.passageway" readonly></el-input>
      		</el-form-item>
      	</el-col>
      </el-row>
      <el-row>
      	<el-col :span="24">
      		<el-form-item label="订单号" prop="orderNo">
      			<el-input v-model="postForm.orderNo" readonly></el-input>
      		</el-form-item>
      	</el-col>
      </el-row>
      <el-row>
      	<el-col :span="24">
      		<el-form-item label="运单号" prop="trackingNo">
      			<el-input v-model="postForm.trackingNo" readonly></el-input>
      		</el-form-item>
      	</el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {
    getById,
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
        postForm: {}
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
      getTrackingDetail(){

      },
      cancel() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
