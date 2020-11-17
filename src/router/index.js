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
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/assetManage',
    component: Layout,
    redirect: '/assetManage/assetInfoManage',
    name: 'AssetManage',
    meta: { title: '资产管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'assetInfoManage',
        name: 'AssetInfoManage',
        component: () => import('@/views/assetManage/assetInfoManage/index'),
        meta: { title: '资产信息管理', icon: 'table' }
      },
      {
        path: 'assetReceiving',
        name: 'AssetReceiving',
        component: () => import('@/views/assetManage/assetReceiving/index'),
        meta: { title: '资产领用', icon: 'table' }
      },
      {
        path: 'assetInfoTrace',
        name: 'AssetInfoTrace',
        component: () => import('@/views/assetManage/assetInfoTrace/index'),
        meta: { title: '资产信息追溯', icon: 'table' }
      }
    ]
  },
  {
    path: '/assetTransferManage',
    component: Layout,
    redirect: '/assetTransferManage/index',
    children: [{
      path: 'assetTransferManage',
      name: 'AssetTransferManage',
      component: () => import('@/views/assetTransferManage/index'),
      meta: { title: '资产调拨管理', icon: 'dashboard' }
    }]
  },
  {
    path: '/assetDisposalManage',
    component: Layout,
    // redirect: '/assetDisposalManage/index',
    meta: { title: '资产处置管理', icon: 'nested' },
    children: [
      {
        path: 'withdrawal',
        name: 'Withdrawal',
        component: () => import('@/views/assetDisposalManage/withdrawal'),
        meta: { title: '退运', icon: 'dashboard' }
      },
      {
        path: 'scrap',
        name: 'Scrap',
        component: () => import('@/views/assetDisposalManage/scrap'),
        meta: { title: '报废', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/assetMaintenanceManage',
    component: Layout,
    redirect: '/assetMaintenanceManage/index',
    children: [{
      path: 'assetMaintenanceManage',
      name: 'AssetMaintenanceManage',
      component: () => import('@/views/assetMaintenanceManage/index'),
      meta: { title: '资产维修管理', icon: 'dashboard' }
    }]
  },
  {
    path: '/assetLoanManage',
    component: Layout,
    redirect: '/assetLoanManage/index',
    children: [{
      path: 'assetLoanManage',
      name: 'AssetLoanManage',
      component: () => import('@/views/assetLoanManage/index'),
      meta: { title: '资产借还管理', icon: 'dashboard' }
    }]
  },
  {
    path: '/assetInventoryManage',
    component: Layout,
    redirect: '/assetInventoryManage/index',
    children: [{
      path: 'assetInventoryManage',
      name: 'AssetInventoryManage',
      component: () => import('@/views/assetInventoryManage/index'),
      meta: { title: '资产盘点管理', icon: 'dashboard' }
    }]
  },
  {
    path: '/statisticalAnalysis',
    component: Layout,
    redirect: '/statisticalAnalysis/index',
    children: [{
      path: 'statisticalAnalysis',
      name: 'StatisticalAnalysis',
      component: () => import('@/views/statisticalAnalysis/index'),
      meta: { title: '统计分析', icon: 'dashboard' }
    }]
  },

  {
    path: '/systemSetting',
    component: Layout,
    meta: { title: '系统设置', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'systemUser',
        name: 'systemUser',
        component: () => import('@/views/systemSettings/systemUser'),
        meta: { title: '系统用户管理', icon: 'table' }
      },
      {
        path: 'commercialUser',
        name: 'commercialUser',
        component: () => import('@/views/systemSettings/commercialUser'),
        meta: { title: '商户管理', icon: 'tree' }
      },
      {
        path: 'userManage',
        name: 'userManage',
        component: () => import('@/views/systemSettings/userManage'),
        meta: { title: '用户管理', icon: 'tree' }
      },
      {
        path: 'departmentManage',
        name: 'DepartmentManage',
        component: () => import('@/views/systemSettings/departmentManage'),
        meta: { title: '部门管理', icon: 'tree' }
      },
      {
        path: 'userPower',
        name: 'userPower',
        component: () => import('@/views/systemSettings/power/user'),
        meta: { title: '注册用户权限配置', icon: 'tree' }
      },
      {
        path: 'sysUserPower',
        name: 'sysUserPower',
        component: () => import('@/views/systemSettings/power/systemUser'),
        meta: { title: '系统用户权限配置', icon: 'tree' }
      },
      {
        path: 'comUserPower',
        name: 'comUserPower',
        component: () => import('@/views/systemSettings/power/commercial'),
        meta: { title: '商户权限配置', icon: 'tree' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
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
