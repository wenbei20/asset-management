import request from '@/utils/request'
import { data2FormData } from '@/utils'

export function createAssets(data) {
  return request({
    url: '/assets/save',
    method: 'post',
    data: data2FormData(data)
  })
}

export function updateAssets(data) {
  return request({
    url: '/assets/update',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getAssetsList(data) {
  return request({
    url: '/assets/list',
    method: 'post',
    data: data2FormData(data)
  })
}
export function deleteAsset(data) {
  return request({
    url: '/assets/delete',
    method: 'post',
    data: data2FormData(data)
  })
}

