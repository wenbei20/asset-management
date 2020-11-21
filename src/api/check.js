import request from '@/utils/request'
import {data2FormData} from '@/utils'

export function getTaskList(data) {
    return request({
      url: '/sys/adb/listCheck',
      method: 'post',
      data: data2FormData(data)
    })
}

export function taskDownload(params) {
    return request({
      url: '/sys/adb/taskDownload',
      method: 'get',
      params
    })
  }

  export function taskUploadList() {
    return request({
      url: '/sys/adb/taskUploadList',
      method: 'get'
    })
  }

  export function taskUpload(params) {
    return request({
      url: '/sys/adb/taskUpload',
      method: 'get',
      params
    })
  }

  export function getStatus() {
    return request({
      url: '/sys/adb/getStatus',
      method: 'get'
    })
  }

  export function listBackFile(data) {
    return request({
      url: '/sys/adb/listBackFile',
      method: 'post',
      data: data2FormData(data)
    })
  }

  export function dataImport(data) {
    return request({
      url: '/sys/adb/dataImport',
      method: 'post',
      data: data2FormData(data)
    })
  }