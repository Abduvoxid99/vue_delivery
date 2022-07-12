import request from '@/utils/request'

const iiko = {
    actions: {
    getIikoBranches ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko/branches',
            method: 'get',
            params: {
              limit: 100,
              page: 1,
              search: ''
            }
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
    getIikoMenu ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko/menu',
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
    getIikoTerminal ({ commit }, branchid) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko/terminals/' + branchid,
            method: 'get',
            params: { limit: 100 }
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    updateIikoTerminal ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko/update-terminals',
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
    updateIikoBranch ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: 'iiko/update-branches',
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
    postIikoCredentials ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko-credentials',
            method: 'post',
            data
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getIikoCredentials ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko-credentials',
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
    updateIikoCredentials ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko-credentials',
            method: 'put',
            data
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getUpdateBranches ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'iiko/update-branches',
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
    getUpdateMenu ({ commit }, params) {
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
  export default iiko
