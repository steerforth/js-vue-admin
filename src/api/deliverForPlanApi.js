import request from '@/utils/request'

export function listByStockPlanItem(id) {
  return request.get('/deliverForPlan/byStockPlanItem', {
    params: {
      stockPlanId: id,
    }
  })
}

export function edit(condition) {
  return request.post('/deliverForPlan/edit', condition)
}

export function batchCreate(condition) {
  return request.post('/deliverForPlan/batchCreate', condition)
}
