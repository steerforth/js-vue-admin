import request from '@/utils/request'
import qs from 'qs'

export function deliverStatistic(data) {
  return request.post('/order/deliver/statistics', null, {
    params: data,
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      })
    }
  })
}

export function saleStatistic(data) {
  return request.post('/order/statistics', null, {
    params: data,
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      })
    }
  })
}

export function syncOrderStatus(data) {
  return request.get('/order/syncOrderStatus')
}

export function page(condition) {
  return request.post('/order/page',null, {
    params: condition
  })
}

export function downloadOrders(condition) {
  return request.get('/order/download', {
    responseType: 'blob',
    params: condition,
    timeout: -1
  })
}

export function getById(id) {
  return request.get('/order', {
    params: {
      id: id
    }
  })
}

export function update(condition) {
  return request.post('/order/update', null, {
    params: condition
  })
}

export function importOrders(condition) {
  return request.post('/order/import/orders', null, {
    params: condition,
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      })
    },
    timeout: -1
  })
}
