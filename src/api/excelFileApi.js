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

export function getById(id) {
  return request.get('/excelFile', {
    params: {
      id: id
    }
  })
}

export function downloadById(id) {
  return request.get('/excelFile/download', {
    params:{
      id:id
    },
    responseType: 'blob',
    timeout: 60000
  })
}

export function downloadBySrcAndType(condition) {
  return request.get('/excelFile/downloadBySrcAndType', {
    params:condition,
    responseType: 'blob',
    timeout: 60000
  })
}
