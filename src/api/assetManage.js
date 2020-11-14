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
export function baseCode(data) {
  return request({
    url: '/assets/baseCode',
    method: 'post',
    data: data2FormData(data)
  })
}

export function copyAsset(data) {
  return request({
    url: '/assets/copy',
    method: 'post',
    data: data2FormData(data)
  })
}

/*
**
********* 资产调拨管理
**
**/

// 资产调拨新增和修改页面中的码表接口
export function assetTransferBaseCode() {
  return request({
    url: '/sys/allot/baseCode',
    method: 'post'
  })
}

// 资产调拨列表
export function assetTransferList(params) {
  return request({
    url: '/sys/allot/listAllot',
    method: 'get',
    params
  })
}

// 删除资产调拨信息
export function deleteAssetAllot(id) {
  return request({
    url: '/sys/allot/deleteAllot' + id,
    method: 'get'
  })
}

// 查询资产调拨信息
export function queryAssetAllot(id) {
  return request({
    url: '/sys/allot/getAllot/' + id,
    method: 'get'
  })
}

// 新建资产调拨单
export function saveAssetAllot(data) {
  return request({
    url: '/sys/allot/saveAllot',
    method: 'post',
    data: data2FormData(data)
  })
}

// 修改资产调拨信息
export function updateAssetAllot(data) {
  return request({
    url: '/sys/allot/updateAllot',
    method: 'post',
    data: data2FormData(data)
  })
}

// 获取新增页面资产列表信息
export function queryNewAssetList(params) {
  return request({
    url: '/sys/allot/findAsset',
    method: 'get',
    params
  })
}

/*
**
********* 资产处置管理 —— 退运
**
**/

// 退运列表
export function queryAssetBackList(data) {
  return request({
    url: '/sys/back/listBack',
    method: 'post',
    data: data2FormData(data)
  })
}
