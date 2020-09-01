
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
      component: () => import('@/views/sys-manage/log-manage/list'),
      name: 'LogManage',
      meta: { title: '日志管理'}
    },
    {
      path: 'map-for-city',
      // component: Layout,
      component: () => import('@/views/sys-manage/map-for-city/list'),
      // redirect: '/sys-manage/map-for-city/edit/1',
      name: 'MapForCity',
      meta: { title: '城市映射配置'},
      children: [
        // {
        //   path: 'create',
        //   component: () => import('@/views/example/create'),
        //   name: 'CreateArticle',
        //   meta: { title: 'Create Article', icon: 'edit' }
        // },
        {
          path: 'edit/:id(\\d+)',
          component: () => import('@/views/sys-manage/map-for-city/edit'),
          name: 'EditMapForCity',
          // meta: { title: '编辑', noCache: true, activeMenu: '/sys-manage/map-for-city/list' },
          meta: { title: '编辑', noCache: true },
          hidden: true
        },
        {
          path: 'list',
          component: () => import('@/views/sys-manage/map-for-city/list'),
          name: 'ListMapForCity',
          meta: { title: '城市映射列表', icon: 'list' }
        }
      ]
    }
  ]
}
export default sysManageRouter
