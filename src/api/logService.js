import request from '@/utils/request'

export function changeLogLevel(condition) {
  return request.get('/log/',{ params: condition })
}