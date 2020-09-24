
import Layout from '@/layout'

const stockManageRouter = {
  path: '/stock-manage',
  component: Layout,
  name: 'StockManage', //<keep-alive>使用
  redirect: '/stock-manage/stock-plan/list',
  meta: {
    title: '备货管理',
    icon: 'el-icon-house', //支持 svg-class，也支持 el-icon-x
    roles:['menu-StockManage']
  },
  children: [
    {
      path: 'stock-plan/list',
      component: () => import('@/views/stock-manage/stock-plan/list'),
      name: 'StockPlan',
      meta: { title: '备货计划',roles:['menu-StockPlan']}
    },
    {
      path: 'stock-plan/edit',
      component: () => import('@/views/stock-manage/stock-plan/edit'),
      name: 'EditStockPlan',
      meta: { title: '编辑备货计划',noCache: true,activeMenu: '/stock-manage/stock-plan/list',roles:['menu-StockPlan']},
      hidden: true
    },
    {
      path: 'stock-plan/add',
      component: () => import('@/views/stock-manage/stock-plan/add'),
      name: 'AddStockPlan',
      meta: { title: '新增备货计划',noCache: true,activeMenu: '/stock-manage/stock-plan/list',roles:['menu-StockPlan']},
      hidden: true
    },
    {
      path: 'stock-plan/see',
      component: () => import('@/views/stock-manage/stock-plan/see'),
      name: 'SeeStockPlan',
      meta: { title: '查看备货计划',noCache: true,activeMenu: '/stock-manage/stock-plan/list'},
      hidden: true
    },
    {
      path: 'unpurchase/list',
      component: () => import('@/views/stock-manage/unpurchase/list'),
      name: 'Unpurchase',
      meta: { title: '未采购明细',roles:['menu-PurchaseOrderFile']},
    },
    {
      path: 'purchase-file/list',
      component: () => import('@/views/stock-manage/purchase-file/list'),
      name: 'PurchaseFile',
      meta: { title: '采购文件',roles:['menu-PurchaseOrderFile']},
    },
    {
      path: 'stock-schedule/list',
      component: () => import('@/views/stock-manage/stock-schedule/list'),
      name: 'StockSchedule',
      meta: { title: '收货、发货进度',roles:['menu-StockProgress']},
    },
    {
      path: 'stock-schedule/local-checkin',
      component: () => import('@/views/stock-manage/stock-schedule/local-checkin'),
      name: 'LocalCheckin',
      meta: { title: '本地仓到货处理',noCache: true,activeMenu: '/stock-manage/stock-schedule/list',roles:['menu-StockProgress']},
      hidden: true
    },
    {
      path: 'stock-schedule/local-sendout-batch',
      component: () => import('@/views/stock-manage/stock-schedule/local-sendout-batch'),
      name: 'LocalSendoutBatch',
      meta: { title: '本地仓发货处理(批量)',noCache: true,activeMenu: '/stock-manage/stock-schedule/list',roles:['menu-StockProgress']},
      hidden: true
    },
    {
      path: 'stock-schedule/local-sendout',
      component: () => import('@/views/stock-manage/stock-schedule/local-sendout'),
      name: 'LocalSendout',
      meta: { title: '本地仓发货处理',noCache: true,activeMenu: '/stock-manage/stock-schedule/list',roles:['menu-StockProgress']},
      hidden: true
    },
    {
      path: 'stock-schedule/imile-arrived',
      component: () => import('@/views/stock-manage/stock-schedule/imile-arrived'),
      name: 'ImileArrived',
      meta: { title: 'imile到货处理',noCache: true,activeMenu: '/stock-manage/stock-schedule/list',roles:['menu-StockProgress']},
      hidden: true
    },
  ]
}
export default stockManageRouter
