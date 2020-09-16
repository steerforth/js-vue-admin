import request from '@/utils/request'

export function stockPlanItems(condition) {
  return request.post('/stock/stockPlanItem/list',null,{params:condition})
}