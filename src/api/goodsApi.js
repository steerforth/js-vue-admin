import request from '@/utils/request'

export function page(condition) {
  return request.get('/goods/page', {
    params: condition
  })
}

export function update(condition) {
  return request.post('/goods/update', null, {
    params: condition
  })
}


export function getById(id) {
  return request.get('/goods', {
    params: {
      id: id
    }
  })
}


export function upload(formData, condition) {
  return request.post('/goods/file/upload', formData, {
    'Content-Type': 'multipart/form-data',
    params: condition
  })
}