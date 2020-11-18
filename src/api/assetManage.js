import request from '@/utils/request'
import { data2FormData } from '@/utils'

export function getRfid() {
  return request({
    url: '/sys/operCode/rfid',
    method: 'post'
  })
}
export function printTag(data) {
  return request({
    url: '/sys/assets/printTag',
    method: 'post',
    data: data2FormData(data)
  })
}
export function getReviewList(data) {
  return request({
    url: '/sys/review/list',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getReceiveList(data) {
  return request({
    url: '/sys/receive/list',
    method: 'post',
    data: data2FormData(data)
  })
}

export function sendCard(data) {
  return request({
    url: '/sys/assets/sendCard',
    method: 'post',
    data: data2FormData(data)
  })
}

export function changeCard(data) {
  return request({
    url: '/sys/assets/changeCard',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getAssetInfo(data) {
  return request({
    url: '/sys/assets/update',
    method: 'post',
    data: data2FormData(data)
  })
}

export function createAssets(data) {
  return request({
    url: '/sys/assets/save',
    method: 'post',
    data: data2FormData(data)
  })
}

export function updateAssets(data) {
  return request({
    url: '/sys/assets/update',
    method: 'post',
    data: data2FormData(data)
  })
}
export function getAllMechartUser(data) {
  return request({
    url: '/sys/assets/useUser',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getAssetsList(data) {
  return request({
    url: '/sys/assets/list',
    method: 'post',
    data: data2FormData(data)
  })
}
export function deleteAsset(data) {
  return request({
    url: '/sys/assets/delete',
    method: 'post',
    data: data2FormData(data)
  })
}
export function baseCode(data) {
  return request({
    url: '/sys/assets/baseCode',
    method: 'post',
    data: data2FormData(data)
  })
}

export function copyAsset(data) {
  return request({
    url: '/sys/assets/copy',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getListChild(data) {
  return request({
    url: '/sys/assets/listChild',
    method: 'post',
    data: data2FormData(data)
  })
}
/*
*********************
********* 资产调拨管理
*********************
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
export function queryNewAssetAllotList(params) {
  return request({
    url: '/sys/allot/findAsset',
    method: 'get',
    params
  })
}

/*
****************************
********* 资产处置管理 —— 退运
****************************
**/

// 退运列表
export function queryAssetBackList(params) {
  return request({
    url: '/sys/back/listBack',
    method: 'get',
    params
  })
}

// 删除资产退运信息
export function deleteAssetBack(id) {
  return request({
    url: '/sys/back/deleteBack/' + id,
    method: 'get'
  })
}

// 资产退运新增和修改页面中的码表接口
export function assetBackBaseCode() {
  return request({
    url: '/sys/back/baseCode',
    method: 'post'
  })
}

// 新建资产退运
export function saveAssetBack(data) {
  return request({
    url: '/sys/back/saveBack',
    method: 'post',
    data: data2FormData(data)
  })
}

// 修改资产退运信息
export function updateAssetBack(data) {
  return request({
    url: '/sys/back/updateBack',
    method: 'post',
    data: data2FormData(data)
  })
}

// 列表导出
export function assetBackExport() {
  return request({
    url: '/sys/back/export',
    method: 'post'
  })
}

/*
***************************
********* 资产处置管理 —— 报废
***************************
**/

// 资产报废列表
export function queryAssetDiscardList(params) {
  return request({
    url: '/sys/discard/listDiscard',
    method: 'get',
    params
  })
}

// 删除资产报废信息
export function deleteAssetDiscard(id) {
  return request({
    url: '/sys/back/deleteBack/' + id,
    method: 'get'
  })
}

// 资产报废还原
export function assetDiscardReturn(params) {
  return request({
    url: '/sys/discard/returnDiscord',
    method: 'get',
    params
  })
}

// 资产报废新增和修改页面中的码表接口
export function assetDiscardBaseCode() {
  return request({
    url: '/sys/discard/baseCode',
    method: 'post'
  })
}

// 列表导出
export function assetDiscardExport() {
  return request({
    url: '/sys/discard/export',
    method: 'post'
  })
}

/*
********************
********* 资产维修管理
********************
**/

// 资产维修列表
export function queryAssetRepairList(params) {
  return request({
    url: '/sys/repair/listRepair',
    method: 'get',
    params
  })
}

// 新建资产维修信息
export function saveAssetRepair(data) {
  return request({
    url: '/sys/repair/saveRepair',
    method: 'post',
    data: data2FormData(data)
  })
}

// 维修完成
export function endAssetRepair(data) {
  return request({
    url: '/sys/repair/endRepair',
    method: 'post',
    data: data2FormData(data)
  })
}

// 查询资产维修信息
export function getAssetRepair(id) {
  return request({
    url: '/sys/repair/getRepair/' + id,
    method: 'get'
  })
}

// 修改资产维修信息
export function updateAssetRepair(data, id) {
  return request({
    url: '/sys/repair/updateRepair/' + id,
    method: 'post',
    data: data2FormData(data)
  })
}

// 删除资产维修信息
export function deleteAssetRepair(id) {
  return request({
    url: '/sys/repair/deleteRepair/' + id,
    method: 'get'
  })
}

// 获取新增页面资产列表信息
export function queryNewAssetRepairList(params) {
  return request({
    url: '/sys/repair/findAsset',
    method: 'get',
    params
  })
}
