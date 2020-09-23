import request from '@/utils/request'

export function unArrived(condition) {
  return request.get('/purchaseOrderItem/unArrived', {
    params: condition
  })
}


export function saveArrived(condition) {
  return request.post('/purchaseOrderItem/saveArrived', condition)
}