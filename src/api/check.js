import request from '@/utils/request'
import {data2FormData} from '@/utils'

export function getTaskList(data) {
    return request({
      url: '/adb/listCheck',
      method: 'post',
      data: data2FormData(data)
    })
}

export function taskDownload(params) {
    return request({
      url: '/adb/taskDownload',
      method: 'get',
      params
    })
  }

  export function taskUploadList() {
    return request({
      url: '/adb/taskUploadList',
      method: 'get'
    })
  }

  export function taskUpload(params) {
    return request({
      url: '/adb/taskUpload',
      method: 'get',
      params
    })
  }

  export function getStatus() {
    return request({
      url: '/adb/getStatus',
      method: 'get'
    })
  }