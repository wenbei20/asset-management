import request from '@/utils/request'
import {data2FormData} from '@/utils'

export function getData() {
    return request({
      url: '/sys/home/variousStatistics',
      method: 'post'
    })
}

export function getZcfl(data) {
    return request({
      url: '/sys/home/propStatistics',
      method: 'post',
      data: data2FormData(data)
    })
}

export function getGssy(data) {
  return request({
    url: '/sys/home/compStatistics',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getZczb() {
  return request({
    url: '/sys/home/assetStatusStatistics',
    method: 'post'
  })
}

export function getQy() {
  return request({
    url: '/sys/home/zoneStatistics',
    method: 'post'
  })
}