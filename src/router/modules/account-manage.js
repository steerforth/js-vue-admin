
import Layout from '@/layout'

const accountManageRouter = {
  path: '/account-manage',
  component: Layout,
  name: 'AccountManage', //<keep-alive>使用
  redirect: '/account-manage/account/list',
  meta: {
    title: '成本管理',
    icon: 'table', //支持 svg-class，也支持 el-icon-x
    roles:['menu-AccountTop']
  },
  children: [
    {
      path: 'account/list',
      component: () => import('@/views/account-manage/account/list'),
      name: 'Account',
      meta: { title: '成本核算',roles:['menu-Account']}
    },
    {
      path: 'account/edit/:id(\\d+)',
      component: () => import('@/views/account-manage/account/edit'),
      name: 'EditAccount',
      meta: { title: '编辑成本',noCache: true,activeMenu: '/account-manage/account/list',roles:['menu-Account']},
      hidden: true
    },
    {
      path: 'logistics-statistics',
      component: () => import('@/views/account-manage/logistics-statistics'),
      name: 'LogisticsStatistics',
      meta: { title: '物流统计',roles:['menu-LogisticsStatistics']}
    }
  ]
}
export default accountManageRouter
