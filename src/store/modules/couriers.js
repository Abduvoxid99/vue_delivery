import request from '@/utils/request'

const couriers = {
    state: {
      couriers: [],
      pagination: {},
      courieritem: null
    },
    getters: {
      paginationCourier: state => state.pagination,
      couriers: state => state.couriers,
      // couriersitemid: state => state.courieritem
    },
    mutations: {
      GET_COURIERS: (state, couriers) => {
          state.couriers = couriers
      },
      GET_COURIERS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      },
      GET_COURIER_ITEM: (state, payload) => {
        state.courieritem = payload
      }
    },
    actions: {
      getCouriersList ({ commit }, params) {
        return new Promise((resolve, reject) => {
          request({
            url: '/couriers',
            method: 'get',
            params: params
          })
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              reject(error)
            })
        })
      },
      getCouriersListNews ({ commit }, params) {
        return new Promise((resolve, reject) => {
          request({
            url: '/reports/courier_order_report',
            method: 'get',
            params: params
          })
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              reject(error)
            })
        })
      },
      getCouriers ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null, search: '' }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/couriers',
            params: { page: page.current, limit: page.pageSize, search: page.search }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_COURIERS_PAGINATION', pagination)
          commit('GET_COURIERS', result.couriers)
          resolve(result.couriers)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
      getCourierId ({ commit }, payload) {
        return new Promise((resolve, reject) => {
        request({
          url: `/couriers/${payload}`,
          method: 'get',
        })
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })
    },
      courierUpdate ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: `/couriers/${payload.courier_id}`,
            method: 'put',
            data: payload.form
          })
            .then(res => {
              resolve(res)
            })
            .catch(error => {
              console.log(error)
              reject(error)
            })
        })
      },
      getCourier (_, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: `/courier-balance`,
            method: 'get',
            params: { page: payload.page, limit: payload.limit, search: payload.search }
          }).then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
        })
      },
      getCourierArchive (_, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: `/couriers-archive`,
            method: 'get',
            params: payload
          }).then(res => {
            console.log('archive', res)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
        })
      },
      updateCourierBalance (_, { id, balance, action }) {
        const url = `/courier-balance/${id}/${action}-balance`
        return new Promise((resolve, reject) => {
          request({
            url: url,
            method: 'post',
            data: {
              balance
            }
          }).then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
        })
      },
      getCourierTransactions (_, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: '/courier-transaction',
            method: 'get',
            params: payload
          }).then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
        })
      },
      postSms (_, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: '/sms/send-sms',
            method: 'post',
            data: payload
          }).then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
        })
      },
    }
}
  export default couriers
