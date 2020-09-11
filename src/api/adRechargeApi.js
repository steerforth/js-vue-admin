import request from '@/utils/request'
import qs from 'qs'

export function page(condition) {
  return request.get('/adrecharge/page2', {
    params: condition,
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      })
    }
  })
}

export function deleteOne(id) {
  return request.post('/adrecharge/rm', null, {
    params: {
      id: id
    }
  })
}

export function saveOrUpdate(condition) {
  return request.post('/adrecharge/save', condition)
}

export function getById(id) {
  return request.get('/adrecharge', {
    params: {
      id: id
    }
  })
}

export function reportList(condition) {
  return request.get('/adrecharge/reportList', {
    params: condition
  })
}
