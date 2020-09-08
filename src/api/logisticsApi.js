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
    params: condition,
    timeout: -1
  })
}

export function statistics() {
  return request.get('/logistics/statistics')
}