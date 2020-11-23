import { getPermission } from '@/api/user'

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
      const tempName = 'views' + item.component + '.vue'
      console.log('tempName', tempName)
      item.component = (resolve) => require([`@/${tempName}`], resolve)
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
