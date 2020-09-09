
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
      path: 'purchase-schedule/list',
      component: () => import('@/views/stock-manage/purchase-schedule/list'),
      name: 'PurchaseSchedule',
      meta: { title: '采购进度',roles:['menu-PurchaseOrderFile']},
    },
    {
      path: 'stock-schedule/list',
      component: () => import('@/views/stock-manage/stock-schedule/list'),
      name: 'StockSchedule',
      meta: { title: '收货、发货进度',roles:['menu-StockProgress']},
    },
  ]
}
export default stockManageRouter
