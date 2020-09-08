
import Layout from '@/layout'

const goodsInfoRouter = {
  path: '/goods-info',
  component: Layout,
  redirect: '/goods-info/goods-sku/list',
  name: 'BaseInfoTable',
  meta: {
    title: '商品信息',
    icon: 'el-icon-shopping-cart-2',
    roles: ['menu-BaseInfo']
  },
  children: [
    {
      path: 'goods-sku/list',
      component: () => import('@/views/goods-info/goods-sku/list'),
      name: 'GoodsSku',
      meta: { title: '商品sku管理',roles: ['menu-SkuManage']}
    },
    {
      path: 'goods-sku/edit/:id(\\d+)',
      component: () => import('@/views/goods-info/goods-sku/edit'),
      name: 'EditGoodsSku',
      meta: { title: '编辑商品sku',noCache: true,activeMenu: '/goods-info/goods-sku/list',roles:['btn-EditSku']},
      hidden: true
    },
    {
      path: 'goods/list',
      component: () => import('@/views/goods-info/goods/list'),
      name: 'Goods',
      meta: { title: '商品管理',roles: ['menu-GoodsManage']}
    },
    {
      path: 'goods/edit/:id(\\d+)',
      component: () => import('@/views/goods-info/goods/edit'),
      name: 'EditGoods',
      meta: { title: '编辑商品',noCache: true,activeMenu: '/goods-info/goods/list'},
      hidden: true
    },
  ]
}
export default goodsInfoRouter
