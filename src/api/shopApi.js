import request from '@/utils/request'

export function shopList() {
  return request.get('/shop/list')
}

export function targetMarkets() {
  return request.get('/shop/targetMarkets')
}

export function optionForAgent() {
  return request.get('/shop/optionForAgent')
}

