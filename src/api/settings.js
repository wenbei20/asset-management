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
    url: '/sys/sysUser/saveSysUser',
    method: 'post',
    data: data2FormData(data)
  })
}

export function deleteSysUserList(id) {
  return request({
    url: '/sys/sysUser/deleteSysUser/' + id,
    method: 'get'
  })
}

export function editSysUserList(data, id) {
  return request({
    url: '/sys/sysUser/updateSysUser/' + id,
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
