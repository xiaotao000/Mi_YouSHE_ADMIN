import request from '@/utils/request'

// 获取分类
export function getType() {
  return request({
    url: '/api/home/category',
    method: 'get'
  })
}

// 获取文章列表
export function ArticleList(data) {
  return request({
    url: '/my/admin/article',
    method: 'post',
    data
  })
}

// 根据分类查找文章列表
export function ArticleTypeList(data) {
  return request({
    url: '/my/admin/article/cates',
    method: 'POST',
    data
  })
}

// 搜索
export function searchArticle(params) {
  return request({
    url: 'my/admin/search',
    method: 'GET',
    params
  })
}

// 发布文章
export const reqAddArticle = data => request({ method: 'post', url: '/my/admin/addArticle', data })

// 发布文章的图片
export const uploadImage = data => request({ method: 'post', url: '/my/article/picture', data, headers: { 'Content-Type': 'multipart/form-data' }})

// 删除文章
export function removeArticle(id) {
  return request({
    url: `/my/user/removeArticle/${id}`,
    method: 'DELETE'
  })
}

// 根据id查找文章
export function seArticle(params) {
  return request({
    url: '/api/home/articledDetails',
    method: 'GET',
    params
  })
}

// 修改文章
export const modifyArticle = data => request({ method: 'PUT', url: '/my/user/updateArticle', data })
