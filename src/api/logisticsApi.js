import request from '@/utils/request'

export function upload(formData, condition) {
  return request.post('/logistics/file/upload', formData, {
    'Content-Type': 'multipart/form-data',
    params: condition
  })
}

export function uploadOrderFile(formData, condition) {
  return request.post('/logistics/file/uploadOrderFile', formData, {
    'Content-Type': 'multipart/form-data',
    params: condition
  })
}