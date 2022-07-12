import request from '@/utils/request'

const jowi = {
    actions: {
    getDispatchers ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'jowi/dispatchers',
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
    getJowiMenu ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: `jowi/menu`,
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
    getUpdateJowiMenu ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'jowi/update-menu',
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
    getJowiCredentials ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: 'jowi-credentials',
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
    postJowiCredentials ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: 'jowi-credentials',
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
    updateJowiCredentials ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: 'jowi-credentials',
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
    }
  }
}
  export default jowi
