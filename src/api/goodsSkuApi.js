import request from '@/utils/request'

export function page(condition) {
  return request.get('/goodsSku/page', {
    params: condition
  })
}

export function deleteOne(id) {
  return request.post('/goodsSku/delete', null, {
    params: {
      id: id
    }
  })
}

export function update(condition) {
  return request.post('/goodsSku/update', null, {
    params: condition
  })
}

export function upload(formData, condition) {
  return request.post('/goodsSku/import', formData, {
    'Content-Type': 'multipart/form-data',
    params: condition
  })
}

export function getById(id) {
  return request.get('/goodsSku', {
    params: {
      id: id
    }
  })
}

export function download4py() {
  return request.get('/goodsSku/download4py', {
    responseType: 'blob'
  })
}

export function download4yks() {
  return request.get('/goodsSku/download4yks', {
    responseType: 'blob'
  })
}
