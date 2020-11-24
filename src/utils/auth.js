import Cookies from 'js-cookie'

const TokenKey = 'X-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setLocalUserInfo(info) {
  localStorage.setItem('userInfo', JSON.stringify(info))
}

export function getLocalUserInfo() {
  let obj = localStorage.getItem('userInfo')
  try {
    obj = JSON.parse(obj)
  } catch {
    obj = {}
  }
  return obj
}

export function removeLocalUserInfo() {
  localStorage.removeItem('userInfo')
}
