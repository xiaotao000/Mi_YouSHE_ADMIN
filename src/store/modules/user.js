import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter, constantRoutes, asyncRoutes } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken() || '',
    name: '',
    avatar: '',
    userInfo: {},
    // 按钮权限列表
    buttons: []
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
  SET_USERINFO: (state, res) => {
    state.userInfo = res
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTER: (state, router) => {
    state.routers = router
  },
  // 设置权限按钮列表
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  async getInfo({ commit }) {
    const data = await getInfo()
    commit('SET_USERINFO', data.data)
    const { nickname, avatar } = data.data
    commit('SET_NAME', nickname)
    commit('SET_AVATAR', avatar)
    commit('SET_BUTTONS', data.button)
    router.addRoutes(asyncRoutes)
    filterRoutes(asyncRoutes, data.routes)
    commit('SET_ROUTER', [...constantRoutes, ...asyncRoutes])
  },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}
// 筛选路由
const filterRoutes = (routes, rightsList) => {
  const result = []
  // 循环所有路由
  routes.forEach(route => {
    // 判断当前路由是否需要权限
    if (route.meta && route.meta.rights) {
      // 需要权限 -> 验证当前用户是否满足该路由权限
      if (rightsList.includes(route.meta.rights)) {
        // 判断是否有子级（有子级则继续筛选）
        if (route.children && route.children.length) {
          route.children = filterRoutes(route.children, rightsList)
        }
        result.push(route) // 存在 则添加到数组中
      }
    } else {
      // 不需要权限
      // 判断是否有子级（有子级则继续筛选）
      if (route.children && route.children.length) {
        route.children = filterRoutes(route.children, rightsList)
      }
      result.push(route) // 存在 则添加到数组中
    }
  })
  return result
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

