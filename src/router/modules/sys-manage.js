
import Layout from '@/layout'

const sysManageRouter = {
  path: '/sys-manage',
  component: Layout,
  name: 'SysManage', //<keep-alive>使用
  redirect: '/sys-manage/log-manage',
  meta: {
    title: '系统管理',
    icon: 'el-icon-s-tools', //支持 svg-class，也支持 el-icon-x
    roles:['menu-SysManage']
  },
  children: [
    {
      path: 'log-manage',
      component: () => import('@/views/sys-manage/log-manage/list'),
      name: 'LogManage',
      meta: { title: '日志管理',roles:['menu-LogManage']}
    },
    // {
    //   path: 'map-for-city',
    //   component: () => import('@/views/sys-manage/map-for-city/index'),
    //   redirect: '/sys-manage/map-for-city/list',
    //   name: 'MapForCity',
    //   meta: { title: '城市映射配置'},
    //   children: [
    //     {
    //       path: 'list',
    //       component: () => import('@/views/sys-manage/map-for-city/list'),
    //       name: 'ListMapForCity',
    //       meta: { title: '列表', roles:['menu-MapForCity'] },
    //       hidden:true
    //     },
    //     {
    //       path: 'edit/:id(\\d+)',
    //       component: () => import('@/views/sys-manage/map-for-city/edit'),
    //       name: 'EditMapForCity',
    //       meta: { title: '编辑', noCache: true, activeMenu: '/sys-manage/map-for-city/list',roles:['menu-MapForCity'] },
    //       hidden: true
    //     },

    //   ]
    // },
    {
      path: 'map-for-city/list',
      component: () => import('@/views/sys-manage/map-for-city/list'),
      name: 'ListMapForCity',
      meta: { title: '城市映射配置',roles:['menu-MapForCity']},
    },
    {
      path: 'map-for-city/edit/:id(\\d+)',
      component: () => import('@/views/sys-manage/map-for-city/edit'),
      name: 'EditMapForCity',
      meta: { title: '编辑城市映射配置', noCache: true, activeMenu: '/sys-manage/map-for-city/list',roles:['menu-MapForCity']},
      hidden: true
    }
  ]
}
export default sysManageRouter
