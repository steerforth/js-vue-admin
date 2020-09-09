import request from '@/utils/request'
import qs from 'qs'

export function accountList(condition) {
  return request.get('/account/list', {
    params: condition
  })
}

export function update(condition) {
  return request.post('/account/save', condition)
}

export function recalculateByMonth(condition,shopIds) {
  return request.post('/account/recalculateByMonth', shopIds, {
    params: condition,
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      })
    }
  })
}
