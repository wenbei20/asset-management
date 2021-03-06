import request from '@/utils/request'
import { data2FormData } from '@/utils'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function getPermission() {
  return request({
    url: '/sys/getPermission',
    method: 'get'
  })
}

