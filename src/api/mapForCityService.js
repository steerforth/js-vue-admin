import request from '@/utils/request'

export function page(condition) {
  return request.get('/mapForCity/page',{ params: condition })
}

export function deleteOne(id) {
  return request.post('/mapForCity/delete', null, { params: {id:id} })
}

export function update(condition) {
  return request.post('/mapForCity/update', null, { params: condition })
}

export function upload(formData,condition){
  return request.post('/mapForCity/file/upload', formData ,{
    'Content-Type': 'multipart/form-data',
    params: condition
  })
}
