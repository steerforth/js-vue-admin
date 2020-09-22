<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-select v-model="condition.type" @change="changePassageway">
        <el-option v-for="item in options" :key="item.type" :label="item.name" :value="item.type">
        </el-option>
      </el-select>
      <el-select v-model="passageway">
        <el-option v-for="item in optionsForPassageway[condition.type]" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-upload style="display: inline-block;" action="noaction" :show-file-list="false" :http-request="uploadFile">
        <el-tooltip class="item" effect="dark" content="文件上传" placement="right-end">
          <el-button v-loading="loadingUp" icon="el-icon-upload2" circle></el-button>
        </el-tooltip>
      </el-upload>
    </sub-navbar>
    <el-table v-loading="loading" :data="filesPage.records" ref="table" :height="tableHeight" stripe style="width: 100%">
      <el-table-column type="index" :index="indexMethod" width="50">
      </el-table-column>
      <el-table-column prop="name" label="文件名">
      </el-table-column>
      <el-table-column prop="uploaderName" label="上传人" align="center">
      </el-table-column>
      <el-table-column prop="uploadTime" label="上传时间" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="下载" align="center">
        <template slot-scope="scope">
          <el-link type="primary" class="mini" @click="download(scope.row.id)">本文件</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.index"
      :page-sizes="[20, 50, 100]" :page-size="condition.size" layout="sizes, prev, pager, next, total" :total="filesPage.total">
    </el-pagination>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import {
    uploadOrderFile
  } from '@/api/logisticsApi'
  import {
    page,
    downloadById
  } from '@/api/excelFileApi'
  import {
    handleFileDownload,
    handlePreUpload
  } from '@/utils/file-handler'

  export default {
    name: 'LogisticsAccountFileList',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        loadingUp: false,
        filesPage: {
          total: 0,
          records: []
        },
        passageway: 'imile@88172',
        options: [{
          name: "imile",
          type: 10
        }, {
          name: "yokesi",
          type: 11
        }],
        optionsForPassageway: {
          10: ['imile@88172', 'imile@88174', 'imile@88138'],
          11: ['yokesi@20125'],
        },
        condition: {
          type: 10,
          index: 1,
          size: 20,
        },
        tableHeight: DEFAULT_TABLE
      }
    },
    beforeMount() {},
    mounted() {
      this.$nextTick(() => {
        this.handleResize()
      })
      window.addEventListener('resize', this.handleResize)
      this.loadFiles();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM -
          this.$refs.pagination.$el.offsetHeight)
      },
      changePassageway() {
        this.$set(this, "passageway", this.optionsForPassageway[this.condition.type][0])
        this.handleCurrentChange(1)
      },
      loadFiles() {
        let that = this
        that.loading = true
        page(this.condition).then(
          res => {
            that.loading = false
            that.$set(that, 'filesPage', res)
          },
          err => {
            that.loading = false
          }
        )
      },
      handleSizeChange(val) {
        this.$set(this.condition, "index", 1);
        this.$set(this.condition, "size", val);
        this.loadFiles();
      },
      handleCurrentChange(val) {
        this.$set(this.condition, "index", val);
        this.loadFiles();
      },
      indexMethod(index) {
        return index + 1;
      },
      uploadFile(params) {
        const form = handlePreUpload(params)
        form.append("type", this.condition.type)
        form.append("passageway", this.passageway);
        let that = this
        that.loading = true
        that.loadingUp = true
        uploadOrderFile(form, that.condition).then(
          res => {
            that.loading = false
            that.loadingUp = false
            that.$message.success(res)
            that.loadFiles()
          },
          err => {
            that.loading = false
            that.loadingUp = false
          }
        )
      },
      download(id) {
        let that = this
        that.loading = true
        downloadById(id).then(
          res => {
            that.loading = false
            handleFileDownload(res)
          },
          err => {
            that.loading = false
          }
        )
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
