import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/my/admin/userinfo',
    method: 'get',
    params: { token }
  })
}

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

// 获取用户列表
export function userList(params) {
  return request({
    url: '/api/admin/getUser',
    method: 'get',
    params
  })
}

// 禁用用户
export function disableUser(params) {
  return request({
    url: `/api/admin/removeUser/${params}`,
    method: 'DELETE'
  })
}

// 搜索用户
export function getSearch(params) {
  return request({
    url: '/my/admin/user/search',
    method: 'get',
    params
  })
}

// 修改用户
export function setData(data) {
  return request({
    url: '/my/admin/update/user',
    method: 'post',
    data
  })
}
