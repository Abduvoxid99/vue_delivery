import request from '@/utils/request'

const shipperBalance = {
    actions: {
    getShipperBalance ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: '/shipper-balance',
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
    postShipperBalance ({ commit }, { data, params }) {
        return new Promise((resolve, reject) => {
        request({
            url: '/shipper-balance',
            method: 'post',
            data,
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

    getShipperBalanceById ({ commit }, id) {
        return new Promise((resolve, reject) => {
        request({
            url: '/shipper-balance/' + id,
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
    updateShipperBalanceById ({ commit }, { id, data, params }) {
        return new Promise((resolve, reject) => {
        request({
            url: '/shipper-balance/' + id,
            method: 'put',
            data,
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
    addBalanceToShipper ({ commit }, { data, id }) {
      return request({
        url: `/shipper-balance/${id}/add-balance`,
        method: 'patch',
        data
      })
    },
    getShipperNoBalance ({ commit }, params) {
      return request({
        url: 'shippers-no-balance',
        method: 'get',
        params
      })
    }
  }
}
  export default shipperBalance
