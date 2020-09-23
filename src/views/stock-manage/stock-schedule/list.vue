<template>
  <div class="app-container">
    <sub-navbar :z-index="10" :class="'sub-navbar'">
      <el-input placeholder="请输入sku" v-model="condition.sku" @change="loadPage" @keyup.enter="$event.target.change" clearable>
      </el-input>
      <el-select v-model="condition.target" clearable placeholder="请选择目的仓" @change="loadPage">
        <el-option v-for="item in targetOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="condition.status" clearable placeholder="请选择备货状态" @change="loadPage">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <!-- <el-tooltip class="item" effect="dark" content="查询" placement="left-end">
        <el-button v-loading="loading" icon="el-icon-search" circle @click="doQuery"></el-button>
      </el-tooltip> -->
      <el-dropdown @command="handleCommand">
        <el-button icon="el-icon-more" circle></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="localArrived">本地仓到货</el-dropdown-item>
          <el-dropdown-item command="localSendout">发货登记</el-dropdown-item>
          <el-dropdown-item command="yokesiArrived">yokesi仓到货单</el-dropdown-item>
          <el-dropdown-item command="imileArrived">imile海外仓到货处理</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </sub-navbar>
    <el-table :data="page.records" ref="table" :height="tableHeight" style="width:100%" @selection-change="handleSelectionChange">
    	<el-table-column
    	    type="selection"
    	    width="55">
    	</el-table-column>
    	<el-table-column prop="status" width="120" label="状态" align="center">
    		<template slot-scope="scope">
    			<el-tag :color="(scope.row.target == 'YIWU_LOCAL' && scope.row.status == 'IN_LOCAL_WAREHOUSE') ? colorForStatus['finish']:colorForStatus[scope.row.status]"
    			 disable-transitions>{{statusHash[scope.row.status]}}</el-tag>
    		</template>
    	</el-table-column>
    	<el-table-column prop="sku" label="SKU" width="120" align="center">
    	</el-table-column>
    	<el-table-column prop="skuName" label="SKU名称" align="center">
    	</el-table-column>
    	<el-table-column prop="releaseTime" label="发布时间" align="center">
    	</el-table-column>
    	<el-table-column prop="target" label="目的仓" align="center" :formatter="targetFormatter">
    	</el-table-column>
    	<el-table-column prop="amount" label="计划备货数量" width="90" align="center">
    	</el-table-column>
    	<el-table-column prop="stockAmountFromPurchase" label="计划采购备货数量" width="90" align="center">
    	</el-table-column>
    	<el-table-column prop="allocationAmount" label="计划调拨备货数量" width="90" align="center">
    	</el-table-column>
    	<el-table-column prop="arrivedAmount" label="采购到货数量" width="90" align="center">
    	</el-table-column>
    	<el-table-column prop="deliverToOverseaAmount" label="发往目的仓数量" width="90" align="center">
    	</el-table-column>
    	<el-table-column prop="arrivedOverseaAmount" label="目的仓到货数量" width="90" align="center">
    	</el-table-column>
    </el-table>
    <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="condition.pageIndex"
      :page-sizes="[20, 50, 100]" :page-size="condition.pageSize" layout="sizes, prev, pager, next, total" :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
  import SubNavbar from '@/components/SubNavbar'
  import {
    planItemPage
  } from '@/api/stockPlanApi'
  import {
    NAV_BAR,
    PADDING_BOTTOM,
    DIFF,
    DEFAULT_TABLE
  } from '@/utils/dynamic-table'
  import { handlePreUpload } from '@/utils/file-handler'

  export default {
    name: 'GoodsSkuList',
    components: {
      SubNavbar
    },
    filters: {},
    data() {
      return {
        loading: false,
        targetOptions:[
          {label:'imile@阿联酋',value:'IMILE_UAE'},
          {label:'imile@沙特',value:'IMILE_KSA'},
          {label:'yokesi@阿联酋',value:'YOKESI_UAE'},
          {label:'yokesi@沙特',value:'YOKESI_KSA'},
          {label:'yokesi@深圳',value:'YOKESI_SHENZHEN'},
          {label:'义乌本地仓',value:'YIWU_LOCAL'},
        ],
        statusOptions:[
          {label:'未采购',value:'NOT_PURCHASED'},
          {label:'已采购',value:'PURCHASED'},
          {label:'货物已到本地仓',value:'IN_LOCAL_WAREHOUSE'},
          {label:'货物发往目的仓',value:'DELIVER_GOODS'},
          {label:'货物已到目的仓',value:'IN_OVERSEAS_WAREHOUSE'},
        ],
        statusHash:{
          "NOT_PURCHASED": "未采购",
          "PURCHASED": "已采购",
          "IN_LOCAL_WAREHOUSE": "货物已到本地仓",
          "DELIVER_GOODS": "货物发往目的仓",
          "IN_OVERSEAS_WAREHOUSE": "货物已到目的仓"
        },
        colorForStatus:{
        	"NOT_PURCHASED": "#f56c6c",
        	"PURCHASED": "#e6a23c",
        	"IN_LOCAL_WAREHOUSE": "#909399",
        	"DELIVER_GOODS": "#409eff",
        	"IN_OVERSEAS_WAREHOUSE": "#0ee00e",
        	"finish": "#67c23a"
        },
        page: {
        	total: 0,
        	records:[]
        },
        condition: {
        	target: null,
        	status: null,
        	pageIndex: 1,
        	pageSize: 20,
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
      this.loadPage()
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        this.$set(this, 'tableHeight', window.innerHeight - this.$refs.table.$el.offsetTop - NAV_BAR - PADDING_BOTTOM -
          this.$refs.pagination.$el.offsetHeight);
      },
      loadPage() {
        let that = this
        that.loading = true
        planItemPage(this.condition).then(
          res => {
            that.loading = false
            that.$set(that, 'page', res)
          },
          err => {
            that.loading = false
          }
        )
      },
      handleSizeChange(val) {
        this.$set(this.condition, "pageIndex", 1);
        this.$set(this.condition, "pageSize", val);
        this.loadPage();
      },
      handleCurrentChange(val) {
        this.$set(this.condition, "pageIndex", val);
        this.loadPage();
      },
      targetFormatter(row, column){
        if(row.target === 'IMILE_UAE'){
        	return "imile@阿联酋"
        }else if(row.target === 'IMILE_KSA'){
        	return "imile@沙特"
        }else if(row.target === 'YOKESI_UAE'){
        	return "yokesi@阿联酋"
        }else if(row.target === 'YOKESI_KSA'){
        	return "yokesi@沙特"
        }else if(row.target === 'YOKESI_SHENZHEN'){
        	return "yokesi@深圳"
        }else if(row.target === 'YIWU_LOCAL'){
        	return "义乌本地仓"
        }else{
        	return "未知"
        }
      },
      handleCommand(command){
        switch (command){
        	case "localArrived":
            this.$router.push('/stock-manage/stock-schedule/local-checkin')
        		break;
        	case "localSendout":
            // this.$router.push('/file-flow/order/duplicate')
        		break;
        	case "yokesiArrived":
            // this.openExportDialog()
        		break;
        	case "imileArrived":
        		// this.download()
        		break;
        	default:
        		this.$message.error('未知的下拉菜单项')
        		break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-input {
    max-width: 230px;
  }

  .el-tag{
  	color:#d9ecff
  }
</style>
