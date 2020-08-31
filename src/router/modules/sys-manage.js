
import Layout from '@/layout'

const sysManageRouter = {
  path: '/sys-manage',
  component: Layout,
  name: 'SysManage',
  meta: {
    title: '系统管理',
    icon: 'table'
  },
  children: [
    {
      path: 'log-manage',
      component: () => import('@/views/sys-manage/log-manage'),
      name: 'LogManage',
      meta: { title: '日志管理'}
    },
    {
      path: 'map-for-city',
      component: () => import('@/views/sys-manage/map-for-city'),
      name: 'MapForCity',
      meta: { title: '城市映射配置'}
    }
  ]
}
export default sysManageRouter
