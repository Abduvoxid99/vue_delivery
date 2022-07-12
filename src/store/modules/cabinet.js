import request from '@/utils/request'
export default {
  state: {

  },
  getters: {

  },
  mutations: {

  },
  actions: {
    changePassword ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/shipper-users/change-password',
          method: 'patch',
          data: payload
        }).then(res => {
          resolve()
          console.log(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    changeUser ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/shipper-users/${payload.id}`,
          method: 'put',
          data: payload.data
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getUser ({ commit }) {
      const id = JSON.parse(localStorage.getItem('user_id'))
      return new Promise((resolve, reject) => {
        request({
          url: `/shipper-users/${id}`,
          method: 'get'
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getShipper ({ commit }) {
      const id = JSON.parse(localStorage.getItem('shipper_id'))
      return new Promise((resolve, reject) => {
        request({
          url: `/shippers/${id}`,
          method: 'get'
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    updateShipper ({ commit }, data) {
      // const id = JSON.parse(localStorage.getItem('shipper_id'))
      return new Promise((resolve, reject) => {
        request({
          url: `/shippers`,
          method: 'put',
          data: data
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getOrderReportsWithDelayed ({ commit }, params) {
      // const id = JSON.parse(localStorage.getItem('shipper_id'))
      return new Promise((resolve, reject) => {
        request({
          url: `/reports/order_report_with_delayed`,
          method: 'get',
          params
        }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getAllShippers ({ commit }, params) {
      return request({
          url: '/shippers',
          method: 'get',
          params
        })
    },
  }
}
