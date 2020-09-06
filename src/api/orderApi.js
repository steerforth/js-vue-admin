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
