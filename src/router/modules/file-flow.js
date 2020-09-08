
import Layout from '@/layout'

const fileFlowRouter = {
  path: '/file-flow',
  component: Layout,
  // alwaysShow: true,//只有一个子菜单时,自动展开
  redirect: '/file-flow/order-list',
  name: 'FileFlow',
  meta: {
    title: 'Excel文件流转',
    icon: 'el-icon-tickets',
    roles:['menu-ExcelFile']
  },
  children: [
    {
      path: 'order-list',
      component: () => import('@/views/file-flow/order-list'),
      name: 'OrderList',
      meta: { title: '订单列表', roles: ['menu-OrderList']}
    },
    {
      path: 'order-file',
      component: () => import('@/views/file-flow/order-file'),
      name: 'OrderFile',
      meta: { title: '订单文件', roles: ['menu-OrderFile'] }
    },
    {
      path: 'order-resend',
      component: () => import('@/views/file-flow/order-resend'),
      name: 'OrderResend',
      meta: { title: '转寄处理', roles: ['menu-Resend'] }
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
