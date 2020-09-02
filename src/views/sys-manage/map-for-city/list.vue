<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-select v-model="condition.type">
        <el-option v-for="item in options" :key="item.type" :label="item.name" :value="item.type">
        </el-option>
      </el-select>
      <el-input placeholder="请输入城市名称" v-model="condition.query" clearable
        @keyup.enter.native="loadMapForCity">
      </el-input>
      <el-tooltip class="item" effect="dark" content="查询" placement="right-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="loadMapForCity"></el-button>
      </el-tooltip>
      <el-upload
        style="display: inline-block;"
        action="noaction"
        :show-file-list="false"
        :http-request="uploadFile">
        <el-tooltip class="item" effect="dark" content="文件上传" placement="right-end">
          <el-button icon="el-icon-upload2" circle></el-button>
        </el-tooltip>
      </el-upload>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="mapForCityPage.records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column label="类型" prop="type" :formatter="formatType" align="center">
      </el-table-column>
      <el-table-column prop="k" label="原城市名" align="center">
      </el-table-column>
      <el-table-column prop="v" label="映射城市名" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button data-funccode='btn-DelSku' @click="remove(scope.row)" type="danger" size="mini">删除</el-button>
          <router-link :to="'/sys-manage/map-for-city/edit/'+scope.row.id">
            <el-button data-funccode='btn-EditSku' size="mini">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.index"
      :page-sizes="[50, 100, 200]" :page-size="condition.size" layout="sizes, prev, pager, next, total" :total="mapForCityPage.total">
    </el-pagination>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    page,
    deleteOne,
    update,
    upload
  } from '@/api/mapForCityApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import { getFileExtensions } from '@/utils/string'

  export default {
    name: 'MapForCity',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        options: [{
          name: "Yokesi物流",
          type: 1
        }, {
          name: "Imile物流",
          type: 2
        }],
        mapForCityPage: {
          total: 0,
          records: []
        },
        condition: {
          type: 1,
          query: '',
          index: 1,
          size: 50,
        },
        tableHeight: DEFAULT_TABLE,
      }
    },
    beforeMount() {
      this.loadMapForCity();
    },
    mounted() {
      this.$nextTick(() => {
        this.handleResize();
      })
      window.addEventListener('resize', this.handleResize)
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM -
          this.$refs.pagination.$el.offsetHeight);
      },
      loadMapForCity() {
        let that = this;
        that.loading = true;
        page(this.condition).then(
          res => {
            that.loading = false;
            that.$set(that, 'mapForCityPage', res);
          },
          err => {
            that.loading = false;
          }
        )
      },
      formatType(row, column) {
        if (row.type === 1) {
          return "Yokesi"
        } else if (row.type === 2) {
          return "Imile"
        } else {
          return "未知"
        }
      },
      handleSizeChange(val) {
        this.$set(this.condition, "index", 1);
        this.$set(this.condition, "size", val);
        this.loadMapForCity();
      },
      handleCurrentChange(val) {
        this.$set(this.condition, "index", val);
        this.loadMapForCity();
      },
      uploadFile(params){
        const file = params.file,
        fileName = file.name,
        // fileType = file.type,
        isExcel = getFileExtensions(fileName).indexOf(".xls") != -1;
        if (!isExcel) {
          this.$message.error("只能上传excel格式.xls,.xlsx!")
          return
        }
        const form = new FormData()
        form.append("file", file)
        let that = this
        upload(form,that.condition).then(
          res => {
            that.$message.success(res)
            that.loadMapForCity()
          },
          err => {

          }
        )
      },
      remove(row) {
        this.$confirm('此操作将删除"原城市名:' + row.k + ',新城市名:' + row.v + '"的记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOne(row.id).then(
            res => {
              this.loadMapForCity();
            },
            err => {

            }
          )
        }).catch(action => {
          if (action === 'cancel') {
            this.$message.info('已取消删除')
          }
        });

      },
      // handleRouter(id){
      //   this.$router.push({ path: `/sys-manage/map-for-city/edit/${id}`})
      // },
    }
  }
</script>

<style lang="scss" scoped>
  .el-input{
    max-width: 230px;
  }
</style>
