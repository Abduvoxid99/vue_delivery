import request from '@/utils/request'
import notification from 'ant-design-vue/lib/notification'
export default {
  state: {
    banners: [],
    pagination: {},
    loading: false
  },
  getters: {
    banner: state => state.banners,
    load_banner: state => state.loading,
    bannerPagination: state => state.pagination
  },
  mutations: {
    GET_BANNER: (state, payload) => { state.banners = payload },
    GET_LOAD_BANNER: (state, payload) => { state.loading = payload },
    GET_PAGINATION_BANNER: (state, payload) => { state.pagination = payload },
  },
  actions: {
    getAllBanner ({ commit }, page) {
      commit('GET_LOAD_BANNER', true)
      return new Promise((resolve, reject) => {
        const { pagination } = page
        request({
          url: '/banner',
          params: { page: pagination.current, limit: pagination.pageSize, search: page.search },
          // params: {
          //   shipper_id: JSON.parse(localStorage.getItem('shipper_id'))
          // },
        })
          .then(result => {
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            const page = { ...pagination }
            page.total = parseInt(result.count)
            commit('GET_PAGINATION_BANNER', page)
            commit('GET_BANNER', result.banners)
            resolve()
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
          .finally(() => {
            commit('GET_LOAD_BANNER', false)
          })
      })
    },
    saveBanner ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: '/banner',
          method: 'POST',
          data: data
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    updateBanner ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/banner/${payload.id}`,
          method: 'PUT',
          data: payload.data
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    deleteBanner ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/banner/${payload}`,
          method: 'delete'
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    }
  }
}
