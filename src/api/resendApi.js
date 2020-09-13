import request from '@/utils/request'

export function uploadTempstorage(formData) {
  return request.post('/resend/file/upload/tempstorage', formData, {
    'Content-Type': 'multipart/form-data',
    timeout: -1
  })
}


export function uploadCheckResult(formData) {
  return request.post('/resend/file/upload/checkresult', formData, {
    'Content-Type': 'multipart/form-data',
    timeout: -1
  })
}
