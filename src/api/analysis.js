import request from '@/utils/request'
import {data2FormData} from '@/utils'

export function listCheckCollect(params) {
    return request({
      url: '/sys/checkcollect/listCheckCollect',
      method: 'get',
      params
    })
}