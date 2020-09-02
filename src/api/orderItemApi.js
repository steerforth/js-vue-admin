import request from '@/utils/request'

export function signRanking(data) {
  return request.post('/order/item/signRanking', null, {
    params: data
  })
}

export function itemList(data) {
  return request.post('/order/item/list', null, {
    params: data
  })
}
