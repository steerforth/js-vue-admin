<template>
  <div class="app-container">
    <sticky :z-index="10" :class="'sub-navbar'">
      <el-input style="margin-right: 5px;max-width: 230px;" placeholder="请输入城市名称" v-model="condition.query" clearable
        @keyup.enter.native="loadMapForCity">
      </el-input>
      <el-select style="margin-right: 5px;" v-model="condition.type">
        <el-option v-for="item in options" :key="item.type" :label="item.name" :value="item.type">
        </el-option>
      </el-select>
      <el-tooltip class="item" effect="dark" content="查询" placement="right-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="loadMapForCity"></el-button>
      </el-tooltip>
      <!-- <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :limit="1"
        data="condition.type"
        :accept="'.xls, .xlsx'"
        show-file-list=false
        :on-change="handleFileChange"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload> -->
    </sticky>
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
          <el-button data-funccode='btn-EditSku' @click="edit(scope.row)" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="formData" ref="formData" :rules="rules" label-position="right" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="原城市名" prop="k">
              <el-input v-model="formData.k"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="映射城市名" prop="v">
              <el-input v-model="formData.v"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveForm('formData')">保 存</el-button>
      </div>
    </el-dialog>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.index"
      :page-sizes="[50, 100, 200]" :page-size="condition.size" layout="sizes, prev, pager, next, total" :total="mapForCityPage.total">
    </el-pagination>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {
    page,
    deleteOne,
    update,
    upload
  } from '@/api/mapForCityService'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'

  export default {
    name: 'MapForCity',
    components: {
      Sticky
    },
    filters: {},
    data() {
      return {
        loading: false,
        options: [{
          name: "Yokesi",
          type: 1
        }, {
          name: "Imile",
          type: 2
        }],
        uploading: false,
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
        fileList:[],
        dialogTitle: '',
        dialogFormVisible: false,
        formData: {},
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
    beforeMount: function() {
      this.loadMapForCity();
    },
    mounted: function() {
      this.$nextTick(() => {
        this.resizeTableHeight();
      })
      window.onresize = () => {
        return (() => {
          this.resizeTableHeight();
        })()
      };
    },
    methods: {
      resizeTableHeight() {
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
      handleFileChange(file, fileList){

      },
      upload: function(e) {
        // this.uploading = true;
        // var formData = new FormData();
        // formData.append("file", $("#file")[0].files[0]);
        // var url = App.Constants.HOST + "/mapForCity/file/upload?type="+this.condition.type;
        // $.ajax({
        // 	type: "POST",
        // 	url: url,
        // 	data: formData,
        // 	processData: false,
        // 	contentType: false,
        // 	success: res=>{
        // 		if(!res.success){
        // 			App.alert(res.errMsg);
        // 		}else{
        // 			this.$message({
        // 			   message: '导入成功',
        // 			   type: 'success'
        // 			});
        // 		}
        // 		this.loadMapForCity();
        // 		$("#file")[0].value = '';
        // 	},
        // });

        // this.uploading = false;
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
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }
        });

      },
      edit(row) {
        var entity = {};
        for (var i in row) {
          entity[i] = row[i];
        }
        this.$set(this, 'formData', entity);
        this.$set(this, "dialogTitle", "编辑");
        this.$set(this, "dialogFormVisible", true);
      },
      saveForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = this.formData;
            update(data).then(
              res => {
                this.loadMapForCity()
              },
              err => {

              }
            )
            this.$set(this, "dialogFormVisible", false);
          } else {
            this.$message({
              message: '请填写正确的表单内容',
              type: 'warning'
            });
            return false;
          }
        });

      }
    }
  }
</script>

<style>
</style>
