<template>
  <!-- TODO 点击右上角x号 会报错，改变子组件的visible -->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :show-close="false">
    <el-row>
    	<el-col :span="24">
  		<el-input prefix-icon="el-icon-search" v-model="condition.query" placeholder="请输入sku/中文名查询/规格"
  		 autocomplete="off" @change="loadPage"></el-input>
  		<el-table :data="page.records" stripe style="width:100%" height="400px" @row-dblclick="dbClick">
  			<el-table-column property="sku" label="SKU"></el-table-column>
  			<el-table-column property="name" label="中文名"></el-table-column>
  			<el-table-column property="spec" label="规格"></el-table-column>
  			<el-table-column property="amount" label="数量"></el-table-column>
  		</el-table>
  		<el-pagination
  		  @size-change="handleSizeChange"
  		  @current-change="handleCurrentChange"
  		  :current-page="condition.index"
  		  :page-sizes="[10, 25, 50]"
  		  :page-size="condition.size"
  		  layout="sizes, prev, pager, next, total"
  		  :total="page.total">
  		</el-pagination>
    	</el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import { distinctPage } from '@/api/goodsSkuApi'

  export default {
    name: 'GoodsSkuTable',
    components: {

    },
    props: {
      title: {
        type: String,
        default: '双击选取',
        required: false
      },
      visible: {
        type: Boolean,
        default: false,
        required: true
      }
    },
    data() {
      return {
        loading: false,
        condition:{
        	query:'',
        	index: 1,
        	size: 10,
        },
        page: {
        	total: 0,
        	records: []
        },
      }
    },
    computed:{
    },
    created() {
    },
    methods: {
      loadPage(){
        let that = this
        that.loading = true
        distinctPage(that.condition).then(
          res => {
            that.loading = false
            this.$set(this,'page',res);
          },
          err => {
            that.loading = false
          }
        )
      },
      handleSizeChange(val) {
      	this.$set(this.condition, "index", 1);
      	this.$set(this.condition, "size", val);
      	this.loadPage();
      },
      handleCurrentChange(val) {
      	this.$set(this.condition, "index", val);
      	this.loadPage();
      },
      dbClick(row, column, event){
        this.$emit('db-click', row)
      }
    },

  }
</script>

<style>
</style>
