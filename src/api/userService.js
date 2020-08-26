import request from '@/utils/request'

export function login(data) {
  return request.post('/user/login',null,{params:data})
}

export function getInfo() {
  return request.get('/user/info')
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
