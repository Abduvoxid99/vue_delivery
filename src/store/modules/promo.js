import request from '@/utils/request'
import storage from 'store'
const promo = {
  state: {
    allPromo: [],
    pagination: {},
    promoLoad: false,
  },
  getters: {
    paginationPromo: state => state.pagination,
    allPromo: state => state.allPromo,
    promoLoad: state => state.promoLoad,
  },
  mutations: {
    GET_PROMO: (state, payload) => {
      state.allPromo = payload
    },
    GET_PROMO_PAGINATION: (state, payload) => {
      state.pagination = payload
    },
    GET_PROMO_LOAD: (state, payload) => {
      state.promoLoad = payload
    },
  },
  actions: {
    getPromo ({ commit }, page) {
      const { pagination } = page
      commit('GET_PROMO_LOAD', true)
      return new Promise((resolve, reject) => {
        request({
          url: '/promo',
          params: { page: pagination.current, limit: pagination.pageSize, search: page.search },
          headers: {
            'Shipper': storage.get('shipper_id')
          }
        })
          .then(result => {
            console.log(result, page)
            // eslint-disable-next-line no-use-before-define
            const pagination = { ...pagination }
            pagination.total = parseInt(result.count)
            commit('GET_PROMO_PAGINATION', pagination)
            commit('GET_PROMO', result.promos)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_PROMO_LOAD', false)
          })
      })
    },
    postPromo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `/promo`,
          data: data,
          method: 'post',
        })
          .then(result => {
            if (result) {
              resolve(result.id)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updatePromo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `/promo/${data.id}`,
          data: data.data,
          method: 'put',
        })
          .then(result => {
            if (result) {
              resolve(result.id)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    lockedPromo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        var _data = {
          title: data.title,
          description: data.description,
          start_time: data.start_time,
          end_time: data.end_time,
          image: data.image.split('/')[4],
          is_active: !data.is_active
        }
        request({
          url: `/promo/${data.id}`,
          data: _data,
          method: 'put',
        })
          .then(result => {
            if (result) {
              resolve(result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deletePromo ({ commit }, path) {
      return new Promise((resolve, reject) => {
        request({
          url: `/promo/${path}`,
          method: 'delete',
        })
          .then(result => {
            if (result) {
              console.log('Deleted')
              resolve()
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}
export default promo
