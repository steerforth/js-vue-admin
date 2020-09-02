
import Layout from '@/layout'

const baseInfoRouter = {
  path: '/base-info',
  component: Layout,
  redirect: '/base-info/goods-sku/list',
  name: 'BaseInfoTable',
  meta: {
    title: '基础信息',
    icon: 'table',
    roles: ['menu-BaseInfo']
  },
  children: [
    {
      path: 'goods-sku/list',
      component: () => import('@/views/base-info/goods-sku/list'),
      name: 'GoodsSku',
      meta: { title: '商品sku管理',roles: ['menu-SkuManage']}
    },
    {
      path: 'goods-sku/edit/:id(\\d+)',
      component: () => import('@/views/base-info/goods-sku/edit'),
      name: 'EditGoodsSku',
      meta: { title: '编辑商品sku',noCache: true,activeMenu: '/base-info/goods-sku/list',roles:['btn-EditSku']},
      hidden: true
    },
    {
      path: 'goods/list',
      component: () => import('@/views/base-info/goods/list'),
      name: 'Goods',
      meta: { title: '商品管理',roles: ['menu-GoodsManage']}
    },
  ]
}
export default baseInfoRouter
