import request from '@/utils/request'
import { data2FormData } from '@/utils'

export function getRfid() {
  return request({
    url: '/sys/operCode/rfid',
    method: 'post'
  })
}

export function standardtype(data) {
  return request({
    url: '/sys/assets/standardtype',
    method: 'post',
    data: data2FormData(data)
  })
}

export function exportAssets(data) {
  return request({
    url: '/sys/assets/export',
    method: 'post',
    data: data2FormData(data)

  })
}

export function doAssetUpdate(data) {
  return request({
    url: '/sys/assets/doUpdate',
    method: 'post',
    data: data2FormData(data)
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

export function createReceive(data) {
  return request({
    url: '/sys/receive/save',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getInnerAssetList(params) {
  return request({
    url: '/sys/receive/assetList',
    method: 'get',
    params
  })
}

export function deleteReceive(data) {
  return request({
    url: '/sys/receive/delete',
    method: 'post',
    data: data2FormData(data)
  })
}

export function assetDetailList(data) {
  return request({
    url: '/sys/receive/assetDetailList',
    method: 'post',
    data: data2FormData(data)
  })
}
export function getUpdateData(data) {
  return request({
    url: '/sys/receive/update',
    method: 'post',
    data: data2FormData(data)
  })
}

export function deleteCheck(id) {
  return request({
    url: '/sys/check/deleteCheck/' + id,
    method: 'get',
    params: { checkId: id }
  })
}

export function saveCheck(data) {
  return request({
    url: '/sys/check/saveCheck',
    method: 'post',
    data: data2FormData(data)
  })
}

export function updateCheckStatus(params) {
  return request({
    url: '/sys/check/updateStatus/' + params.checkId,
    method: 'get',
    params
  })
}

export function updateCheck(data) {
  return request({
    url: '/sys/check/updateCheck/' + data.checkId,
    method: 'post',
    data: data2FormData(data)
  })
}

export function getCheckInfo(checkId) {
  return request({
    url: '/sys/check/getCheck/' + checkId,
    method: 'get'
  })
}

export function getOpenAssetCode() {
  return request({
    url: '/sys/operCode/zc',
    method: 'post'
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
    url: '/sys/allot/deleteAllot/' + id,
    method: 'get',
    params: { allotId: id }
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
    url: '/sys/allot/updateAllot/' + data.allotId,
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

// 资产调拨取消
export function cancelAssetAllot(data) {
  return request({
    url: '/sys/allot/allotCancel',
    method: 'post',
    data: data2FormData(data)
  })
}

// 资产调拨确认
export function confirmAssetAllot(data) {
  return request({
    url: '/sys/allot/allotConfirm',
    method: 'post',
    data: data2FormData(data)
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

// 查询资产退运信息
export function getAssetBack(id) {
  return request({
    url: '/sys/back/getBack/' + id,
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
export function updateAssetBack(data, id) {
  return request({
    url: '/sys/back/updateBack/' + id,
    method: 'post',
    data: data2FormData(data)
  })
}

// 获取新增页面资产列表信息
export function queryNewAssetBackList(params) {
  return request({
    url: '/sys/back/findAsset',
    method: 'get',
    params
  })
}

// 列表导出
export function exportAssetBack() {
  return request({
    url: '/sys/back/export',
    method: 'post',
    responseType: 'blob'
  })
}

// 删除资产退运信息
export function deleteAssetBack(id) {
  return request({
    url: '/sys/back/deleteBack/' + id,
    method: 'get'
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
    url: '/sys/discard/deleteDiscard/' + id,
    method: 'get'
  })
}

// 资产报废还原
export function assetDiscardReturn(data) {
  return request({
    url: '/sys/discard/returnDiscord',
    method: 'post',
    data: data2FormData(data)
  })
}

// 资产报废新增和修改页面中的码表接口
export function assetDiscardBaseCode() {
  return request({
    url: '/sys/discard/baseCode',
    method: 'post'
  })
}

export function getDiscardInfo(discardId) {
  return request({
    url: '/sys/discard/getDiscard/' + discardId,
    method: 'get'
  })
}

export function findAssetInfo(params) {
  return request({
    url: '/sys/discard/findAsset',
    method: 'get',
    params
  })
}

export function saveDiscardInfo(data) {
  return request({
    url: '/sys/discard/saveDiscard',
    method: 'post',
    data: data2FormData(data)
  })
}

export function updateDiscardInfo(data, discardId) {
  return request({
    url: '/sys/discard/updateDiscard/' + discardId,
    method: 'post',
    data: data2FormData(data)
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
export function repairBaseCode() {
  return request({
    url: '/sys/repair/baseCode ',
    method: 'post'
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

// 资产盘点

export function getListCheck(data) {
  return request({
    url: '/sys/check/listCheck',
    method: 'post',
    data: data2FormData(data)
  })
}
/*
********************
********* 资产借还管理
********************
**/

// 资产借还列表
export function queryAssetLendreList(params) {
  return request({
    url: '/sys/lendre/listLendre',
    method: 'get',
    params
  })
}

// 新建资产借还信息
export function saveAssetLendre(data) {
  return request({
    url: '/sys/lendre/saveLendre',
    method: 'post',
    data: data2FormData(data)
  })
}
export function getLendreBaseCode() {
  return request({
    url: '/sys/lendre/baseCode',
    method: 'post'
  })
}

export function createTaskTxt(id) {
  return request({
    url: '/sys/check/createTaskTxt/' + id,
    method: 'get',
    params: { checkId: id }
  })
}

export function checkBaseCode() {
  return request({
    url: '/sys/check/baseCode',
    method: 'post'
  })
}

// 归还
export function returnAssetLendre(data) {
  return request({
    url: '/sys/lendre/returnLendre',
    method: 'post',
    data: data2FormData(data)
  })
}

// 查询资产借还信息
export function getAssetLendre(id) {
  return request({
    url: '/sys/lendre/getLendre/' + id,
    method: 'get'
  })
}

// 修改资产借还信息
export function updateAssetLendre(data, id) {
  return request({
    url: '/sys/lendre/updateLendre/' + id,
    method: 'post',
    data: data2FormData(data)
  })
}

// 删除资产借还信息
export function deleteAssetLendre(id) {
  return request({
    url: '/sys/lendre/deleteLendre/' + id,
    method: 'get'
  })
}

// 获取新增页面资产列表信息
export function queryNewAssetLendreList(params) {
  return request({
    url: '/sys/lendre/findAsset',
    method: 'get',
    params
  })
}
