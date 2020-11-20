import request from '@/utils/request'
import {data2FormData} from '@/utils'

export function getList() {
    return request({
      url: '/home/assetCheckdeStatistics',
      method: 'post'
    })
}