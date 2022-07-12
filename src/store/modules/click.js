import request from '@/utils/request'
export default {
  state: {
    data: null,
    loading: false,
  },
  getters: {
    allClick: state => state.data,
    clickLoad: state => state.loading,
  },
  mutations: {
    GET_CLICK: (state, payload) => {
      state.data = payload
    },
    GET_CLICK_LOAD: (state, payload) => {
      state.loading = payload
    },
  },
  actions: {
    getClick ({ commit }, page) {
      commit('GET_CLICK_LOAD', true)
      return new Promise((resolve, reject) => {
        request({
          url: '/click-info',
          params: {
            page: page.page,
            limit: page.limit
          }
        })
          .then(result => {
            console.log(result, page)
            commit('GET_CLICK', result)
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_CLICK_LOAD', false)
          })
      })
    },
    postClick ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `/click-info`,
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
    updateClick ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `/click-info/${data.branch_id}`,
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
    deleteClick ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/click-info/${id}`,
          method: 'delete',
        })
          .then(result => {
            if (result) {
              commit('GET_CLICK', null)
              console.log('Deleted')
              resolve(result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getClickById ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/click-info/${id}`,
          method: 'get',
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
