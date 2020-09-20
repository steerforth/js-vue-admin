import request from '@/utils/request'

export function stockPlanItemsByStatus(condition) {
  return request.post('/stock/stockPlanItem/list', null, {
    params: condition
  })
}

//TODO 改get
export function planPage(condition) {
  return request.post('/stock/stockPlan/page', null, {
    params: condition
  })
}

export function firstStock() {
  return request.get('/stock/create/first-stock-plan')
}

export function supplyStock() {
  return request.get('/stock/create/supply-stock-plan')
}

export function deleteOne(id) {
  return request.post('/stock/stockPlan/delete', null, {
    params: {
      planId: id
    }
  })
}

export function stockPlanItemsByPlan(planId) {
  return request.get('/stock/stockPlan/get/items', {
    params: {
      planId: planId
    }
  })
}
