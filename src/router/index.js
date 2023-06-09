import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]
export const asyncRoutes = [
  {
    path: '/article',
    component: Layout,
    alwaysShow: true, // 始终显示一级菜单 【哪怕只有一个二级】
    meta: { title: '文章管理', icon: 'el-icon-folder' },
    children: [
      // 文章发布
      { path: '/release', component: () => import('@/views/article/release'), meta: { title: '文章发布', rights: 'article' }},
      // 文章管理
      { path: '/manage', component: () => import('@/views/article/manage'), meta: { title: '文章列表', rights: 'manage' }}
    ]
  },
  {
    path: '/user',
    component: Layout,
    alwaysShow: true, // 始终显示一级菜单 【哪怕只有一个二级】
    meta: { title: '用户管理', icon: 'el-icon-user' },
    children: [
      // 用户管理
      { path: '/userManage', component: () => import('@/views/user/userManage'), meta: { title: '用户列表', rights: 'userManage' }},
      { path: '/personalData', component: () => import('@/views/user/personalData'), meta: { title: '个人资料', rights: 'personalData' }}
    ]
  },
  {
    path: '/rotation',
    component: Layout,
    alwaysShow: true, // 始终显示一级菜单 【哪怕只有一个二级】
    meta: { title: '轮播图管理', icon: 'el-icon-picture-outline' },
    children: [
      // 用户管理
      { path: '/rotation/chart', component: () => import('@/views/rotation'), meta: { title: '轮播列表', rights: 'userManage' }}
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
