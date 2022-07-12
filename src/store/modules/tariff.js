import request from '@/utils/request'
import notification from 'ant-design-vue/lib/notification'
export default {
  state: {
    data: [],
    pagination: {},
    loading: false,
    fareBranch: [],
    delivery_price: 0,
    delivery_distance: 0,
    loadingPrice: false
  },
  getters: {
    tariffs: state => state.data,
    load_tariff: state => state.loading,
    tariffPagination: state => state.pagination,
    fareBranch: state => state.fareBranch,
    deliveryPrice: state => state.delivery_price,
    deliveryDistance: state => state.delivery_distance,
    loadingPrice: state => state.loadingPrice
  },
  mutations: {
    GET_TARIFF: (state, payload) => { state.data = payload },
    GET_LOAD_TARIFF: (state, payload) => { state.loading = payload },
    GET_PAGINATION_TARIFF: (state, payload) => { state.pagination = payload },
    GET_FARE_BRANCHES: (state, payload) => { state.fareBranch = payload },
    CHANGE_DELIVERY_PRICE: (state, payload) => {
      state.delivery_price = payload.price
      state.delivery_distance = payload.distance
    },
    CHANGE_DELIVERY_LOAD_PRICE: (state, payload) => { state.loadingPrice = payload }
  },
  actions: {
    getAllTariff ({ commit }, params) {
      commit('GET_LOAD_TARIFF', true)
      return new Promise((resolve, reject) => {
        const { pagination } = params
        request({
          url: '/fares',
          params: {
            page: pagination.current,
            limit: pagination.pageSize
          }
        })
          .then(result => {
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            const page = { ...pagination }
            page.total = parseInt(result.count)
            commit('GET_PAGINATION_TARIFF', page)
            commit('GET_TARIFF', result.fares)
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
            commit('GET_LOAD_TARIFF', false)
          })
      })
    },
    saveTariff ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: '/fares',
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
    calcultePrice ({ commit }, data) {
      commit('CHANGE_DELIVERY_LOAD_PRICE', true)
      return new Promise((resolve, reject) => {
        if (data.branch_id) {
          request({
            url: '/fares/compute-price',
            method: 'PATCH',
            data: data
          })
            .then(result => {
              console.log('price =>', result)
              commit('CHANGE_DELIVERY_PRICE', result)
              resolve(result)
            })
            .catch(error => {
              commit('CHANGE_DELIVERY_PRICE', {
                price: 0,
                distance: 0
              })
              notification.error({
                message: 'Ошибка сети или сервер не работает',
                description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
                duration: 5
              })
              reject(error)
            })
            .finally(() => {
              commit('CHANGE_DELIVERY_LOAD_PRICE', false)
            })
        }
      })
    },
    updateTariff ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/fares/${payload.id}`,
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
    deleteTariff ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/fares/${payload}`,
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
    },
    assignBranchTariff ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/fare/add-branches`,
          method: 'put',
          data: payload
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
    getBranchNoFare ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/fare/no-fare-branches',
          method: 'get'
        })
          .then(result => {
            // eslint-disable-next-line
            commit('GET_FARE_BRANCHES', result.branches ? result.branches : [])
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getFareList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/fares',
          method: 'get',
          params
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
