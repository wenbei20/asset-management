import request from '@/utils/request'
import {data2FormData} from '@/utils'

export function getData() {
    return request({
      url: '/home/variousStatistics',
      method: 'post'
    })
}

export function getZcfl() {
    return request({
      url: '/home/propStatistics',
      method: 'post'
    })
}

export function getGssy() {
  return request({
    url: '/home/compStatistics',
    method: 'post'
  })
}

export function getZczb() {
  return request({
    url: '/home/assetStatusStatistics',
    method: 'post'
  })
}

export function getQy() {
  return request({
    url: '/home/zoneStatistics',
    method: 'post'
  })
}