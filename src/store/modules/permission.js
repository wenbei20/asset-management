import { getPermission } from '@/api/user'
// import systemUser from '@/views/systemSettings/systemUser'
// import commercialUser from '@/views/systemSettings/commercialUser'
// import userManage from '@/views/systemSettings/userManage'
// import userPower from '@/views/systemSettings/power/user'
// import sysUserPower from '@/views/systemSettings/power/systemUser'
// import comUserPower from '@/views/systemSettings/power/commercial'

import Layout from '@/layout/index.vue'

const state = {
  addRoutes: []
}

const mutations = {
  SET_ADDROAUTES: (state, routes) => {
    state.addRoutes = routes
  }
}

const actions = {
  getSettingRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getPermission().then(res => {
        if (res.code === 0) {
          let handledRoutes = []
          handledRoutes = HandleReturnRoutes(res.data)
          handledRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ADDROAUTES', handledRoutes)
          resolve(handledRoutes)
        }
      }).catch(err => {
        console.log('err', err)
        reject([])
      })
    })
  }
}

function HandleReturnRoutes(arr) {
  arr.forEach(item => {
    if (item.component === 'Layout') {
      item.component = Layout
    } else if (item.component) {
      const tempName = item.path
      //eslint -disable-next-line
      //   item.component = () => import(`@/views${temp}`)
      switch (tempName) {
        case 'systemUser' :
          item.component = () => import('@/views/systemSettings/systemUser')
          break
        case 'commercialUser':
          item.component = () => import('@/views/systemSettings/commercialUser')
          break
        case 'userManage':
          item.component = () => import('@/views/systemSettings/userManage')
          break
        case 'userPower':
          item.component = () => import('@/views/systemSettings/power/user')
          break
        case 'sysUserPower':
          item.component = () => import('@/views/systemSettings/power/systemUser')
          break
        case 'comUserPower':
          item.component = () => import('@/views/systemSettings/power/commercial')
          break
      }
    }

    if (item.children) {
      HandleReturnRoutes(item.children)
    }
  })
  return arr
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
