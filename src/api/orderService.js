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
