import request from '@/utils/request'

export function page(condition) {
  return request.get('/billTrace/page', {
    params: condition
  })
}

export function downloadUnfinished(billNo) {
  return request.get('/billTrace/unfinished/download', {
    responseType: 'blob',
    params: {
      billNo: billNo
    },
    timeout: -1
  })
}
