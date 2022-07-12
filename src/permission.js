import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: true }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult', 'shipper'] // no redirect whitelist
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      store
        .dispatch('getUserPermission')
        .then(res => {
          if (store.getters.roles.length === 0) {
            store
              .dispatch('GetInfo', store.getters.userPermissions)
              .then(res => {
                // console.log(res)
                // const roles = res.result && res.result.role
                const roles = res.role
                store.dispatch('GenerateRoutes', { roles }).then(() => {
                  router.addRoutes(store.getters.addRouters)
                  const redirect = decodeURIComponent(from.query.redirect || to.path)
                  if (to.path === redirect) {
                    next({ ...to, replace: true })
                  } else {
                    next({ path: redirect })
                  }
                })
              })
              .catch(() => {
                notification.error({
                  message: 'Error',
                  description: 'Доступ пользователей не получен, проверьте свою сеть или обновите страницу'
                })
                store.dispatch('Logout').then(() => {
                  next({ path: loginRoutePath, query: { redirect: to.fullPath } })
                })
              })
          } else {
            next()
          }
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'Доступ пользователей не получен, проверьте свою сеть или обновите страницу'
          })
          store.dispatch('Logout').then(() => {
            next({ path: loginRoutePath, query: { redirect: to.fullPath } })
          })
        })
    }
  } else {
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
