
import Layout from '@/layout'

const adManageRouter = {
  path: '/ad-manage',
  component: Layout,
  name: 'AdManage', //<keep-alive>使用
  redirect: '/ad-manage/recharge/list',
  meta: {
    title: '广告支出',
    icon: 'el-icon-bank-card', //支持 svg-class，也支持 el-icon-x
    roles:['menu-AdManage']
  },
  children: [
    {
      path: 'recharge/list',
      component: () => import('@/views/ad-manage/recharge/list'),
      name: 'RechargeList',
      meta: { title: '充值记录',roles:['menu-AdRecharge']}
    },
    {
      path: 'recharge/edit',
      component: () => import('@/views/ad-manage/recharge/edit'),
      name: 'EditRecharge',
      meta: { title: '编辑充值记录',noCache: true,activeMenu: '/ad-manage/recharge/list',roles:['menu-AdRecharge']},
      hidden: true
    },
    {
      path: 'recharge/add',
      component: () => import('@/views/ad-manage/recharge/add'),
      name: 'AddRecharge',
      meta: { title: '新增充值记录',noCache: true,activeMenu: '/ad-manage/recharge/list',roles:['menu-AdRecharge']},
      hidden: true
    },
    {
      path: 'report/list',
      component: () => import('@/views/ad-manage/report/list'),
      name: 'AdReport',
      meta: { title: '费用月报',roles:['menu-AdReport']}
    }
  ]
}
export default adManageRouter
