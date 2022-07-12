import request from '@/utils/request'

const transactions = {
    actions: {
    getTransactions ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: '/transaction',
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
    postTransaction ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: '/transaction',
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

    getTransactionById ({ commit }, id) {
        return new Promise((resolve, reject) => {
        request({
            url: '/transaction/' + id,
            method: 'get'
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
  export default transactions
