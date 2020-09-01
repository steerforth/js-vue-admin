<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-autocomplete class="inline-input" v-model="condition.path" :fetch-suggestions="querySearch" placeholder="请输入包名"></el-autocomplete>
      <el-select v-model="condition.level" placeholder="日志级别">
        <el-option v-for="item in optionsForLevel" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-tooltip class="item" effect="dark" content="设置" placement="right-end">
        <el-button v-loading="loading" icon="el-icon-set-up" circle @click="changeLevel"></el-button>
      </el-tooltip>
    </sub-navbar>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar' // 粘性header组件
  import {
    changeLogLevel
  } from '@/api/logService'


  export default {
    name: 'LogManage',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        condition: {
          level: "DEBUG",
          path: "com.zhile.account"
        },
        optionsForPath: [{
            "value": "com.zhile.account"
          }, {
            "value": "com.zhile.account.service"
          },
          {
            "value": "com.zhile.account.excel"
          }, {
            "value": "com.zhile.account.task"
          }
        ],
        optionsForLevel: ["DEBUG", "INFO", "WARN", "ERROR"],
      }
    },
    methods: {
      changeLevel() {
        let that = this
        that.loading = true
        changeLogLevel(this.condition).then(
          res => {
            that.loading = false
            that.$message({
              message: res,
              type: 'success'
            })

          },
          err => {
            that.loading = false
            that.$message({
              message: err,
              type: 'error'
            })
          }
        )
      },
      querySearch(queryString, cb) {
        var optionsForPath = this.optionsForPath
        var results = queryString ? optionsForPath.filter(this.createFilter(queryString)) : optionsForPath
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter(queryString) {
        return (optionsForPath) => {
          return (optionsForPath.value.indexOf(queryString.toLowerCase()) >= 0)
        }
      }
    }
  }
</script>

<style>
</style>
