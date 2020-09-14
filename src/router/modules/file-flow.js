
import Layout from '@/layout'

const fileFlowRouter = {
  path: '/file-flow',
  component: Layout,
  // alwaysShow: true,//只有一个子菜单时,自动展开
  redirect: '/file-flow/order',
  name: 'FileFlow',
  meta: {
    title: 'Excel文件流转',
    icon: 'el-icon-tickets',
    roles:['menu-ExcelFile']
  },
  children: [
    {
      path: 'order/list',
      component: () => import('@/views/file-flow/order/list'),
      name: 'OrderList',
      meta: { title: '订单列表', roles: ['menu-OrderList']}
    },
    {
      path: 'order/edit/:id(\\d+)',
      component: () => import('@/views/file-flow/order/edit'),
      name: 'EditOrder',
      meta: { title: '编辑订单',noCache: true,activeMenu: '/file-flow/order/list',roles:['btn-EditOrder']},
      hidden: true
    },
    {
      path: 'order/duplicate',
      component: () => import('@/views/file-flow/order/duplicate-order-table'),
      name: 'DuplicateOrder',
      meta: { title: '订单去重',noCache: true,activeMenu: '/file-flow/order/list',roles:['btn-CleanRepeatOrder']},
      hidden: true
    },
    {
      path: 'order/tracking-detail',
      component: () => import('@/views/file-flow/order/tracking-detail'),
      name: 'TrackingDetail',
      meta: { title: '轨迹跟踪',noCache: true,activeMenu: '/file-flow/order/list'},
      hidden: true
    },
    {
      path: 'order-file/list',
      component: () => import('@/views/file-flow/order-file/list'),
      name: 'OrderFile',
      meta: { title: '订单文件', roles: ['menu-OrderFile'] }
    },
    {
      path: 'order-resend/list',
      component: () => import('@/views/file-flow/order-resend/list'),
      name: 'OrderResend',
      meta: { title: '转寄处理', roles: ['menu-Resend'] }
    },
    {
      path: 'overseas-storage',
      component: () => import('@/views/file-flow/overseas-storage'),
      name: 'OverseasStorage',
      meta: { title: '海外仓库存', roles: ['menu-DeliverFromStore'] }
    },
    {
      path: 'deliver-from-store',
      component: () => import('@/views/file-flow/deliver-from-store'),
      name: 'DeliverFromStore',
      meta: { title: '海外仓发货', roles: ['menu-DeliverFromStore'] }
    },
    {
      path: 'direct-mail',
      component: () => import('@/views/file-flow/direct-mail'),
      name: 'DirectMail',
      meta: { title: '直邮', roles: ['menu-DirectMail'] }
    },
    {
      path: 'deliver-type',
      component: () => import('@/views/file-flow/deliver-type'),
      name: 'DeliverType',
      meta: { title: '销售发货清单', roles: ['menu-Deliver'] }
    }
  ]
}
export default fileFlowRouter
