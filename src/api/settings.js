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

// 用户管理

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
//  商户管理
export function getlistMerchant(params) {
  return request({
    url: '/sys/merchant/listMerchant',
    method: 'get',
    params
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

