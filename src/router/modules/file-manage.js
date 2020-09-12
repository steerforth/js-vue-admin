
import Layout from '@/layout'

const fileManageRouter = {
  path: '/file-manage',
  component: Layout,
  name: 'FileManage', //<keep-alive>使用
  redirect: '/file-manage/purchase',
  alwaysShow: true,
  meta: {
    title: '文件管理',
    icon: 'el-icon-folder', //支持 svg-class，也支持 el-icon-x
    roles:['menu-FileManage']
  },
  children: [
    {
      path: 'purchase',
      component: () => import('@/views/file-manage/purchase/list'),
      name: 'Purchase',
      meta: { title: '采购',roles:['menu-GoodsManage']}
    },
    {
      path: 'logistics-order',
      component: () => import('@/views/file-manage/logistics-order/list'),
      name: 'LogisticsOrder',
      meta: { title: '物流订单',roles:['menu-LogisticsStatistics']}
    },
    {
      path: 'logistics-account',
      component: () => import('@/views/file-manage/logistics-account/list'),
      name: 'LogisticsAccount',
      meta: { title: '物流结算',roles:['menu-LogisticsFile']}
    },
  ]
}
export default fileManageRouter
