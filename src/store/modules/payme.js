import request from '@/utils/request'
export default {
  state: {
    data: null,
    loading: false,
  },
  getters: {
    allPayme: state => state.data,
    paymeLoad: state => state.loading,
  },
  mutations: {
    GET_PAYME: (state, payload) => {
      state.data = payload
    },
    GET_PAYME_LOAD: (state, payload) => {
      state.loading = payload
    },
  },
  actions: {
    getPayme ({ commit }, page) {
      commit('GET_PAYME_LOAD', true)
      return new Promise((resolve, reject) => {
        request({
          url: '/payme-info',
        })
          .then(result => {
            // console.log(result, page)
            commit('GET_PAYME', result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_PAYME_LOAD', false)
          })
      })
    },
    postPayme ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `/payme-info`,
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
    updatePayme ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `/payme-info/${data.branch_id}`,
          data: data,
          method: 'put',
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deletePayme ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/payme-info/${id}`,
          method: 'delete',
        })
          .then(result => {
            if (result) {
              commit('GET_PAYME', null)
              console.log('Deleted')
              resolve(result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getPaymeList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/payme-info`,
          method: 'get',
          params
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
    getPaymeById ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/payme-info/${id}`,
          method: 'get'
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
  }
}
