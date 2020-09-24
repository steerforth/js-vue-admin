import request from '@/utils/request'
import qs from 'qs'

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

export function saveOrUpdate(entity) {
  return request.post('/stock/stockPlan/insertOrUpdate', entity)
}

//TODO 改get
export function planItemPage(condition) {
  return request.post('/stock/stock-plan-item/page', null, {
    params: condition
  })
}

//TODO 改为 deliverForPlanApi
export function deliverForPlanByBilNo(billNo) {
  return request.get('/stock/list/deliver-for-plan', {
    params: {
      billNo: billNo
    }
  })
}

export function handleArrivedFromImile(condition, arriveDate) {
  return request.post('/stock/upload/imile-arrived-records', condition, {
    params: {
      arriveDateStr: arriveDate,
    },
    // paramsSerializer: params => {
    //   return qs.stringify(params, {
    //     indices: false
    //   })
    // }
  })
}

export function uploadArrivedFromYokesi(formData) {
  return request.post('/stock/file/upload/yokesi-arrived-file', formData, {
    'Content-Type': 'multipart/form-data',
    timeout: -1
  })
}
