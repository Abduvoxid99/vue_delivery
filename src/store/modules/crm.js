import request from '@/utils/request'
// const customUrl = '/v1/crm/update-branches'
const crm = {
    state: {
        contacts: {}
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    getCrmBranches ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'crm/branches',
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
    },
    getCrmOrderPayment ({ commit }, orderId) {
        return new Promise((resolve, reject) => {
        request({
            url: `crm/order-payment/${orderId}`,
            method: 'get'
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getCrmMenus ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'crm/menu',
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
    },
    updateCrmBranch ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'crm/update-branches',
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
    },
    updateCrmMenu ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko/update-menu',
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
  export default crm
