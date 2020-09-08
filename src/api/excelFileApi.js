import request from '@/utils/request'

// export function upload(formData, condition) {
//   return request.post('/excelFile/upload', formData, {
//     'Content-Type': 'multipart/form-data',
//     params: condition
//   })
// }

export function page(condition) {
  return request.get('/excelFile/page', {
    params: condition
  })
}

export function downloadById(id) {
  return request.get('/excelFile/download', {
    params:{
      id:id
    },
    responseType: 'blob'
  })
}