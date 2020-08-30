
import Layout from '@/layout'

const stasticsTableRouter = {
  path: '/stastics-table',
  component: Layout,
  // redirect: '/stastics-table/order-status',
  name: 'StasticsTable',
  meta: {
    title: '统计图表',
    icon: 'table'
  },
  children: [
    {
      path: 'order-sale',
      component: () => import('@/views/stastics-table/order-sale'),
      name: 'OrderSale',
      meta: { title: '订单销量图'}
    },
    {
      path: 'order-status',
      component: () => import('@/views/stastics-table/order-status'),
      name: 'OrderList',
      meta: { title: '订单状态表'}
    },
    {
      path: 'sale-ranking',
      component: () => import('@/views/stastics-table/sale-ranking'),
      name: 'saleRanking',
      meta: { title: '销量排行'}
    },
    {
      path: 'sign-ranking',
      component: () => import('@/views/stastics-table/sign-ranking'),
      name: 'signRanking',
      meta: { title: '签收排行'}
    }
  ]
}
export default stasticsTableRouter
