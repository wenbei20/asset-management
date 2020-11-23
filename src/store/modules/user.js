import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter, sysContentRouters } from '@/router'
import store from '@/store'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    merchantName: '',
    userChname: '',
    roles: [],
    type: '',
    reguserId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_MERCHART_NAME: (state, merchantName) => {
    state.merchantName = merchantName
  },
  SET_USERCHNAME: (state, userChname) => {
    state.userChname = userChname
  },
  SET_REGUSERID: (state, reguserId) => {
    state.reguserId = reguserId
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    console.log('arguments', arguments)
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), power: password }).then(async response => {
        console.log(response)
        if (response.code === 0) {
          commit('SET_TOKEN', response.data.token)
          commit('SET_MERCHART_NAME', response.data.merchantName)
          commit('SET_USERCHNAME', response.data.userChname)
          commit('SET_REGUSERID', response.data.uuid)
          setToken(response.data.token)

          // const addrouter = await dispatch('permission/getSettingRoutes')

          // router.addRoutes(addrouter)

          const addrouter = await store.dispatch('permission/getSettingRoutes')
          router.options.routes = router.options.routes.concat(addrouter)
          router.addRoutes(addrouter)
          console.log('router', router)

          // getPermission().then(res=>{
          //     console.log('getPermission', res)
          // })
          // fetchList({page:1,userName:username.trim()}).then(res=>{
          //   if(res.code === 0){
          //       console.log('res', res)
          //     if(res.data.items && res.data.items.length > 0){
          //       let name = res.data.items[0].userChname
          //       commit('SET_NAME', name)
          //     }
          //   }
          // })
          resolve()
        } else {
          console.log('response.msg', response.msg)
          reject({ msg: response.msg })
        }
      }).catch(err => {
        console.log(err)
        reject({ msg: '登录失败，请稍后再试' })
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // const { data } = response
        if (response.code !== 0) {
          reject('验证失败，请重新登陆')
        }
        const roles = response.roles
        if (Array.isArray(roles) && roles.length > 0) {
          name = roles[0]
        }
        // const { roles, name, avatar, introduction } = response

        if (!roles || roles.length <= 0) {
          reject('获取用户信息失败')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken() // must remove  token  first
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

