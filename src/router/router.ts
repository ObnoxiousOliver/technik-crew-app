import { Permission } from '@/model/permissions'
import { useUser } from '@/stores/user'
import { setStore } from '@/utilities/auth'
import { useBreakpoint } from '@/utilities/breakpoint'
import { getAuth } from 'firebase/auth'
import { createRouter as _createRouter, createWebHistory, RouteComponent, RouteLocationNormalized, RouteMeta, RouteRecordRaw, RouteRecordRedirectOption, RouterOptions } from 'vue-router'

export interface AbstractRoute {
  title?: string,
  name: string,
  pathName?: string,
  path?: string,
  component: RouteComponent,

  requiresAuth?: boolean | null,
  requiresPermission?: Permission | Permission[],

  children?: AbstractRoute[],

  depth?: number,
  backPath?: string | null,
  redirect?: RouteRecordRedirectOption,
  alias?: string | string[],
  meta?: RouteMeta
}

export function compileRoutes (routes: AbstractRoute[]): RouteRecordRaw[] | null {
  return getRoutes(routes)

  function getRoutes (routes: AbstractRoute[], parentPath?: string, parent?: RouteRecordRaw): RouteRecordRaw[] {
    const compiledRoutes: RouteRecordRaw[] = []
    for (const route of routes) {
      const {
        title,
        name,
        pathName,
        path,
        component,
        requiresAuth,
        requiresPermission,
        children,
        depth,
        backPath,
        redirect,
        alias,
        meta
      } = route

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const compiledRoute: any = {
        name,
        path: path ?? ((parentPath ?? '') + ((pathName ?? name).startsWith('/') ? '' : '/') + (pathName ?? name)),
        component,
        meta: {
          title: title ?? parent?.meta?.title ?? undefined,
          requiresPermission: (typeof requiresPermission === 'string' ? [requiresPermission] : requiresPermission) ?? parent?.meta?.requiresPermission ?? undefined,
          depth: depth ?? (parent?.meta?.depth === undefined ? 0 : (parent?.meta?.depth as number) + 1),
          backPath: backPath !== null ? backPath ?? parentPath ?? null : null,
          root: parent?.meta?.root ?? parent?.name ?? name,
          ...meta
        }
      }

      if (requiresAuth === undefined) {
        compiledRoute.meta.requiresAuth = parent?.meta?.requiresAuth ?? null
        compiledRoute.meta.requiresNoAuth = parent?.meta?.requiresNoAuth ?? null
      } else {
        compiledRoute.meta.requiresAuth = requiresAuth === true
        compiledRoute.meta.requiresNoAuth = requiresAuth === false
      }
      if (alias) {
        compiledRoute.alias = alias
      }
      if (redirect) {
        compiledRoute.redirect = redirect
      }

      compiledRoutes.push(compiledRoute)
      if (children) {
        compiledRoutes.push(...getRoutes(children, compiledRoute.path, compiledRoute))
      }
    }

    return compiledRoutes
  }
}

export function createRouter (routes: AbstractRoute[], options: Partial<RouterOptions> = {}) {
  const compiledRoutes = compileRoutes(routes)
  const router = _createRouter({
    history: options.history ?? createWebHistory(process.env.BASE_URL),
    routes: compiledRoutes ?? []
  })

  console.group('[Router]', 'compiled routes')
  console.table(compiledRoutes?.map(route => ({
    name: route.name,
    path: route.path,
    meta: '>>>',
    ...route.meta
  })))
  console.groupEnd()

  router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (getAuth().currentUser) {
        next()
        console.log('[Router]', 'User logged in')
      } else if (localStorage.getItem('last_auth') === 'true') {
        next()
        console.log('[Router]', 'User logged in')
      } else {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
        console.log('[Router]', 'User not logged in')
      }
    } else if (to.matched.some(record => record.meta.requiresNoAuth)) {
      if (getAuth().currentUser) {
        next(from)
        console.log('[Router]', 'User logged in')
      } else if (localStorage.getItem('last_auth') === 'true') {
        next(from)
        console.log('[Router]', 'User logged in')
      } else {
        next()
        console.log('[Router]', 'User not logged in')
      }
    } else {
      next()
    }
  })

  // Check if user has permission to access route
  router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresPermission)) {
      const permission = to.meta.requiresPermission as Permission
      const user = useUser()

      if (!user.user) {
        await setStore()
      }

      if (user.permissions?.is_admin) {
        next()
        console.log('[Router]', 'User is admin')
      } else if (user.permissions?.[permission]) {
        next()
        console.log('[Router]', 'User has permission')
      } else {
        next(from)
        console.log('[Router]', 'User has no permission')
      }
    } else {
      next()
    }
  })

  // Set transition name
  router.beforeEach((to, from) => {
    let rootTranstion = to.meta.root !== from.meta.root

    if (to.meta.noRootTransition || from.meta.noRootTransition) {
      rootTranstion = false
    }

    if (rootTranstion) {
      const fromDepth = routes.findIndex(route => route.name === from.meta.root)
      const toDepth = routes.findIndex(route => route.name === to.meta.root)

      if (['xs', 'sm'].includes(useBreakpoint().value)) {
        if (toDepth >= fromDepth) {
          to.meta.transitionName = 'linear-slide-left'
        } else {
          to.meta.transitionName = 'linear-slide-right'
        }
      } else {
        to.meta.transitionName = 'desktop-root-slide'
      }
    } else {
      const fromDepth = from.meta.depth ?? 0
      const toDepth = to.meta.depth ?? 0
      if (toDepth >= fromDepth) {
        to.meta.transitionName = 'slide-left'
      } else {
        to.meta.transitionName = 'slide-right'
      }
    }
  })

  router.afterEach((to) => {
    if (to.meta.title) {
      document.title = to.meta.title as string
    } else {
      document.title = 'Technik Crew'
    }
  })

  const lastPageOfRoot: {
    [key: string]: RouteLocationNormalized
  } = {}

  router.beforeEach((to, from) => {
    if (to.meta.root === from.meta.root) {
      lastPageOfRoot[to.meta.root as string] = to
    } else {
      lastPageOfRoot[from.meta.root as string] = from
    }
  })

  function back (fallbackPath?: string) {
    const route = router.currentRoute.value
    let metaBackPath = route.meta.backPath as string | null
    if (metaBackPath !== null && route.params) {
      Object.keys(route.params).forEach(key => {
        metaBackPath = (metaBackPath as string).replace(`:${key}`, route.params[key] as string)
      })
    }
    const backPath = fallbackPath ?? metaBackPath ?? '/'

    console.log('[Router]', 'Back to', backPath)
    if (history.state?.back === backPath || metaBackPath === null) {
      router.back()
    } else {
      router.replace(backPath)
    }
  }

  function getLastPageOfRoot (root: string) {
    return lastPageOfRoot[root] ?? { name: root }
  }

  return { router, back, getLastPageOfRoot }
}
