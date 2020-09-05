
import Layout from '@/layout'

const fileManageRouter = {
  path: '/file-manage',
  component: Layout,
  name: 'FileManage', //<keep-alive>使用
  redirect: '/file-manage/purchase-file',
  alwaysShow: true,
  meta: {
    title: '文件管理',
    icon: 'table', //支持 svg-class，也支持 el-icon-x
    roles:['menu-FileManage']
  },
  children: [
    {
      path: 'purchase-file',
      component: () => import('@/views/file-manage/purchase-file/list'),
      name: 'PurchaseFile',
      meta: { title: '采购文件',roles:['menu-GoodsManage']}
    }
  ]
}
export default fileManageRouter
