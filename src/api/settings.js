import request from '@/utils/request'
import { data2FormData } from '@/utils'

export function getSysUserList(params) {
  return request({
    url: '/sys/regUser/listRegUser',
    method: 'get',
    params
  })
}

export function addSysUserList(data) {
  return request({
    url: '/sys/regUser/saveRegUser',
    method: 'post',
    data: data2FormData(data)
  })
}

export function deleteSysUserList(id) {
  return request({
    url: '/sys/regUser/deleteRegUser/' + id,
    method: 'get'
  })
}

export function editSysUserList(data, id) {
  return request({
    url: '/sys/regUser/updateRegUser/' + id,
    method: 'post',
    data: data2FormData(data)
  })
}

export function getListGroup(params) {
  return request({
    url: '/sys/group/listGroup',
    method: 'get',
    params
  })
}

export function getRegUser(id) {
  return request({
    url: '/sys/regUser/getRegUser/' + id,
    method: 'get',
    params: { reguserId: id }
  })
}

// 用户管理

export function checkReguserNameExist(name) {
  return request({
    url: '/sys/regUser/checkReguserNameExist',
    method: 'get',
    params: { reguserName: name }
  })
}

export function checkMobileExist(mobile) {
  return request({
    url: '/sys/regUser/checkMobileExist',
    method: 'get',
    params: { mobile }
  })
}
export function getOrganizationGroup(params) {
  return request({
    url: '/sys/group/listGroupByParentId',
    method: 'get',
    params
  })
}

export function saveOrganizationGroup(data) {
  return request({
    url: '/sys/group/saveGroup',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getListRegUserByGroupId(params) {
  return request({
    url: '/sys/regUser/listRegUserByGroupId',
    method: 'get',
    params
  })
}

export function updateGroup(data) {
  return request({
    url: '/sys/group/updateGroup/' + data.groupId,
    method: 'post',
    data: data2FormData(data)
  })
}

export function deleteGroup(groupId) {
  return request({
    url: '/sys/group/deleteGroup/' + groupId,
    method: 'get',
    params: { groupId }
  })
}

//  商户管理
export function getlistMerchant(params) {
  return request({
    url: '/sys/merchant/listMerchant',
    method: 'get',
    params
  })
}

export function findUsersByMerchant() {
  return request({
    url: '/sys/merchant/findUsersByMerchant',
    method: 'post'
  })
}

// export function deleteMerchant(id) {
//   return request({
//     url: '/sys/merchant/deleteMerchant/' + id,
//     method: 'get'
//   })
// }

export function updateMerchant(data, id) {
  return request({
    url: '/sys/merchant/updateMerchant/' + id,
    method: 'post',
    data: data2FormData(data)
  })
}

export function getListRegUserByChineseName(params) {
  return request({
    url: '/sys/regUser/listRegUserByChineseName',
    method: 'get',
    params
  })
}

export function getMerchant(id) {
  return request({
    url: '/sys/merchant/getMerchant/' + id,
    method: 'get',
    params: { merchantId: id }
  })
}
// 用户组

export function getlistRole(params) {
  return request({
    url: '/sys/role/listRole',
    method: 'get',
    params
  })
}

export function saveRole(data) {
  return request({
    url: '/sys/role/saveRole',
    method: 'post',
    data: data2FormData(data)
  })
}

export function getlistRegUserByRoleId(params) {
  return request({
    url: '/sys/regUser/listRegUserByRoleId',
    method: 'get',
    params
  })
}

export function updateRole(data, id) {
  return request({
    url: '/sys/role/updateRole/' + id,
    method: 'post',
    data: data2FormData(data)
  })
}

export function deleteRole(params, id) {
  return request({
    url: '/sys/role/deleteRole/' + id,
    method: 'get',
    params
  })
}

export function getListRightsByRoleId(params) {
  return request({
    url: '/sys/role/listRightsByRoleId',
    method: 'get',
    params
  })
}

export function saveRoleRights(data) {
  return request({
    url: '/sys/role/saveRoleRights',
    method: 'post',
    data: data2FormData(data)
  })
}

export function saveRoleUser(data) {
  return request({
    url: '/sys/role/saveRoleUser',
    method: 'post',
    data: data2FormData(data)
  })
}

export function findUserDataRange(userId) {
  return request({
    url: '/sys/regUser/findUserDataRange/' + userId,
    method: 'post',
    data: { userId }
  })
}

export function changeDataRange(data) {
  return request({
    url: '/sys/regUser/changeDataRange',
    method: 'post',
    data: data2FormData(data)
  })
}

/*
********************
********* 标签模版管理
********************
**/

// 标签模板列表
export function queryRfidList(params) {
  return request({
    url: '/sys/rfid/listRfidForm',
    method: 'get',
    params
  })
}

// 保存标签模板
export function saveRfid(data) {
  return request({
    url: '/sys/rfid/saveRfidForm',
    method: 'post',
    data: data2FormData(data)
  })
}

// 设为默认标签
export function setRfidDefault(params) {
  return request({
    url: '/sys/rfid/setDefault/' + params.uuid,
    method: 'get',
    params
  })
}

/*
*******************************
********* 分类管理（or 资产类别管理）
*******************************
**/

// 资产类型列表
export function queryAssetKindList(params) {
  return request({
    url: '/sys/assetKind/listAssetKind',
    method: 'get',
    params
  })
}

// 根据uuid查询资产类型
export function getAssetKind(id) {
  return request({
    url: '/sys/assetKind/getAssetKind/' + id,
    method: 'get'
  })
}

// 检查编号是否被使用
export function checkAssetKindByAssetKindIdExist(data) {
  return request({
    url: '/sys/assetKind/checkAssetKindByAssetKindIdExist',
    method: 'post',
    data: data2FormData(data)
  })
}

// 删除资产类型
export function deleteAssetKind(params) {
  return request({
    url: '/sys/assetKind/deleteAssetKind/' + params.uuid,
    method: 'get'
    // params
  })
}

// 启用禁用分类
export function updateAssetKindStatus(params) {
  return request({
    url: '/sys/assetKind/updateAssetKindStatus/' + params.uuid,
    method: 'get'
    // params
  })
}

// 保存资产类型
export function saveAssetKind(data) {
  return request({
    url: '/sys/assetKind/saveAssetKind',
    method: 'post',
    data: data2FormData(data)
  })
}

/*
*********************
********* 规格标准管理
*********************
**/

// 根据分类编号查询规格标准列表
export function getStandardTypeList(params) {
  return request({
    url: '/sys/standard/listStandardType',
    method: 'get',
    params
  })
}

// 根据uuid查询规格标准
export function getStandardType(id) {
  return request({
    url: '/sys/standard/getStandardType/' + id,
    method: 'get'
  })
}

// 保存规格标准
export function saveStandardType(data) {
  return request({
    url: '/sys/standard/SaveStandardType',
    method: 'post',
    data: data2FormData(data)
  })
}
