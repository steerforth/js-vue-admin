import request from '@/utils/request'
import qs from 'qs'

export function page(condition) {
  return request.get('/overseasStorage/page', {
    params: condition
  })
}

export function getById(id) {
  return request.get('/overseasStorage', {
    params: {
      id: id
    }
  })
}

export function saveOrUpdate(condition) {
  return request.post('/overseasStorage/saveOrUpdate', null, {
    params: condition
  })
}

export function match(condition) {
  return request.post('/overseasStorage/match', null, {
    params: condition,
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      })
    }
  })
}

export function upload(formData) {
  return request.post('/overseasStorage/file/upload', formData, {
    'Content-Type': 'multipart/form-data',
    timeout: 60000
  })
}
