<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-input
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 2}"
        placeholder="请输入订单号"
        v-model="condition.orderNo"
        clearable="">
      </el-input>
      <el-input placeholder="请输入手机号" v-model="condition.shortPhoneNum" clearable>
      </el-input>
      <el-select v-model="condition.deliverStatus" clearable placeholder="请选择状态">
        <el-option v-for="item in statusForOptions" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="condition.shopId" clearable filterable placeholder="请选择站点">
        <el-option v-for="item in shopsForOptions" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-tooltip class="item" effect="dark" content="查询" placement="left-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="loadOrders"></el-button>
      </el-tooltip>
      <el-dropdown @command="handleCommand">
        <el-button icon="el-icon-more" circle></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="checkPermission(['btn-ImportOrder'])" command="import">导入订单</el-dropdown-item>
          <el-dropdown-item v-if="checkPermission(['btn-CleanRepeatOrder'])" command="rmDupli">订单去重</el-dropdown-item>
          <el-dropdown-item v-if="checkPermission(['btn-ExportOrder'])" command="export">生成订单与审单</el-dropdown-item>
          <el-dropdown-item v-if="checkPermission(['btn-ImportOrder'])" command="download" divided>下载</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </sub-navbar>
    <el-table v-loading="loading" ref="table" :data="orderPage.records" :height="tableHeight" stripe style="width: 100%">
      <el-table-column
        prop="orderNo"
        label="订单号"
        width="180"
        fixed="left">
      </el-table-column>
      <el-table-column
        label="商品标题"
        width="200"
        fixed="left">
        <template slot-scope="scope">
          <el-link :href="scope.row.goodsLink" type="info">{{scope.row.title}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="spec"
        label="规格"
        width="200">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="price"
        label="单价">
      </el-table-column>
      <el-table-column
        prop="orderTime"
        label="创建时间"
         width="100">
      </el-table-column>
      <el-table-column
        prop="customer"
        label="买家">
      </el-table-column>
      <el-table-column
        prop="shortPhoneNum"
        label="联系方式(不含区号)"
        width="100">
      </el-table-column>
      <el-table-column
        prop="deliverStatus"
        label="配送状态"
        width="100">
        <template slot-scope="scope">
          <el-link type="primary" :disabled="scope.row.deliverStatus==null" @click="goTrackingDetails(scope.row)">{{scope.row.deliverStatus | getDeliverStatus}}</el-link>
        	<!-- <a :class="{'no-link': scope.row.deliverStatus==null}" @click="getTrackingDetails(scope.row)"> -->
      	<!-- </a> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="domain"
        label="域名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mark"
        label="备注"
        width="150">
      	<template slot-scope="scope">
      		<el-popover class="item" placement="right" effect="dark" width="250" trigger="hover" >
      		  <div>{{scope.row.mark}}</div>
      		  <span slot="reference">{{(scope.row.mark != null && scope.row.mark.length>20)? scope.row.mark.substr(0,20)+'...': scope.row.mark}}</span>
      		</el-popover>
      	</template>
      </el-table-column>
      <el-table-column
        prop="city"
        label="城市"
         width="100">
      </el-table-column>
      <el-table-column
        prop="area"
        label="地区"
        width="120">
      </el-table-column>
      <el-table-column
        prop="addr"
        label="地址"
        width="220">
      </el-table-column>
      <el-table-column
      	fixed="right"
      	label="操作"
      	width="80">
      	<template slot-scope="scope">
          <router-link :to="'/file-flow/order/edit/'+scope.row.id">
            <el-button size="mini">编辑</el-button>
          </router-link>
      	</template>
      </el-table-column>
    </el-table>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.pageIndex"
      :page-sizes="[20, 50, 100, 200]" :page-size="condition.pageSize" layout="sizes, prev, pager, next, total" :total="orderPage.total">
    </el-pagination>
    <date-dialog :title="dialogTitle" :is-import="dialogIsImport" :shops-for-options="shopsForOptions" :visible="dialogVisible" @submit="handleSubmit" @cancel="dialogCancel"></date-dialog>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import DateDialog from './components/DateDialog'
  import {
    shopList
  } from '@/api/shopApi'
  import {
    page,
    downloadOrders,
    importOrders,
    exportFiles
  } from '@/api/orderApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import { handleFileDownload } from '@/utils/file-handler'
  import checkPermission from '@/utils/permission'

  export default {
    name: 'OrderList',
    components: {
      SubNavbar, DateDialog
    },
    filters: {
      getDeliverStatus(deliverStatus){
      	switch (deliverStatus){
      		case "DISTRIBUTION":
      			return "正在配送";
      			break;
      		case "SUCCESS":
      			return "配送成功";
      			break;
      		case "RETURN":
      			return "暂存_途中";
      			break;
      		case "TEMPORARY":
      			return "暂存_在库";
      			break;
      		case "FORWARD":
      			return "转寄";
      			break;
          case "CANCEL":
            return "商家已取消";
            break;
          case "CODREFUND":
          	return "COD退款";
          	break;
          case undefined:
          	return "-";
          	break;
      		default:
      			return "未知";
      			break;
      	}
      }
    },
    data() {
      return {
        loading: false,
        statusForOptions:[{'name':'正在配送','value':'DISTRIBUTION'},{'name':'配送成功','value':'SUCCESS'},{'name':'暂存_途中','value':'RETURN'},{'name':'暂存_在库','value':'TEMPORARY'},{'name':'转寄','value':'FORWARD'},{'name':'商家已取消','value':'CANCEL'},{'name':'COD退款','value':'CODREFUND'}],
        shopsForOptions: [],
        orderPage: {
          total: 0,
          records: []
        },
        condition: {
        	orderNo: "",
        	pageIndex: 1,
        	pageSize: 20,
        	deliverStatus: "",
        	shortPhoneNum: ""
        },
        tableHeight: DEFAULT_TABLE,
        //dialog
        dialogVisible: false,
        dialogTitle: '',
        //订单导入/审单文件导出
        dialogIsImport:false
      }
    },
    computed:{
      calcuOrderNo(){
        return this.condition.orderNo.replace(/[ ]/g, "").replace(/[\r\n]/g, ",").replace("，", ",")
      },
      calcuPhone(){
        return this.condition.shortPhoneNum.replace(/[ ]/g, "")
      },
    },
    beforeMount() {},
    mounted() {
      this.$nextTick(() => {
        this.handleResize()
      })
      window.addEventListener('resize', this.handleResize)
      this.loadShops()
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM -
          this.$refs.pagination.$el.offsetHeight);
      },
      loadOrders() {
        let that = this
        that.condition.orderNo = that.calcuOrderNo
        that.condition.shortPhoneNum = that.calcuPhone
        that.loading = true
        page(that.condition).then(
          res => {
            that.loading = false
            that.$set(that, 'orderPage', res)
          },
          err => {
            that.loading = false
          }
        )
      },
      loadShops() {
        let that = this
        shopList().then(
          res => {
            that.$set(that,'shopsForOptions',res)
            that.loadOrders()
          },
          err => {

          }
        )
      },
      handleSizeChange(val) {
        this.$set(this.condition, "pageIndex", 1);
        this.$set(this.condition, "pageSize", val);
        this.loadOrders();
      },
      handleCurrentChange(val) {
        this.$set(this.condition, "pageIndex", val);
        this.loadOrders();
      },
      handleCommand(command){
        switch (command){
        	case "import":
            this.openImportDialog()
        		break;
        	case "rmDupli":
             this.$router.push('/file-flow/order/duplicate')
        		break;
        	case "export":
            this.openExportDialog()
        		break;
        	case "download":
        		this.download()
        		break;
        	default:
        		this.$message.error('未知的下拉菜单项')
        		break;
        }
      },
      openImportDialog(){
        this.$set(this,'dialogVisible',true)
        this.$set(this,'dialogIsImport',true)
        this.$set(this,'dialogTitle','站点自动导入订单')
      },
      handleSubmit(event,condition){
        if(event === 'import'){
          this.handleImportSubmit(condition)
        }else if(event === 'export'){
          this.handleExportSubmit(condition)
        }else{
          log.error('未知事件')
        }
      },
      handleImportSubmit(condition){
        let that = this
        that.loading = true
        that.$set(that,'dialogVisible',false)
        importOrders(condition).then(
          res => {
            that.loading = false

            let hasFailed = false;
            for(let i=0; i< res.length; i++){
            	if(!res[i].success){
            		hasFailed = true;
            		setTimeout(() => {
            			that.$notify({
            			  title: '提示',
            			  message: res[i].name + '订单导入失败！',
            			  duration: 0,
            			  type: "error"
            			});
            		}, 250);
            	}
            }

            if(!hasFailed){
            	that.$notify({
            	  title: '提示',
            	  message: '订单导入成功！',
            	  duration: 0,
            	  type: "success"
            	});
            }

            that.handleSizeChange(20)
          },
          err => {
            that.loading = false
          }
        )
      },
      openExportDialog(){
        this.$set(this,'dialogVisible',true)
        this.$set(this,'dialogIsImport',false)
        this.$set(this,'dialogTitle','生成订单和待审单文件')
      },
      handleExportSubmit(condition){
        let that = this
        that.loading = true
        that.$set(that,'dialogVisible',false)
        exportFiles(condition).then(
          res => {
            that.loading = false
            this.$message.success(res)
          },
          err => {
            that.loading = false
          }
        )
      },
      dialogCancel(){
        this.$set(this,'dialogVisible',false)
      },
      download() {
        this.condition.orderNo = this.calcuOrderNo
        this.condition.shortPhoneNum = this.calcuPhone
        downloadOrders(this.condition).then(
          res => {
            handleFileDownload(res)
          },
          err => {

          }
        )
      },
      goTrackingDetails(row){
        if(row.deliverStatus == null){
          this.$message.warning('当前并没有配送信息')
          return;
        }
        this.$router.push({ name: 'TrackingDetail', params: {orderNo: row.orderNo,trackingNo: row.trackingNo,passageway: row.passageway }})
      },
      //TODO 调用4次?
      checkPermission(value){
        return checkPermission(value)
      }
    }
  }
</script>

<style lang="scss" scoped>

  .el-input {
    max-width: 230px;
  }

  .el-textarea {
    max-width: 230px;
    vertical-align: middle;
  }
</style>
