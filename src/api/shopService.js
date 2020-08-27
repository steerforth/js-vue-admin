import request from '@/utils/request'

export function shopList() {
  return request.get('/shop/list')
}

