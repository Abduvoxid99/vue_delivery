import request from '@/utils/request'

const customUrl = 'review'
const auth = {
  state: {
    contacts: {}
  },
  getters: {},
  mutations: {},
  actions: {
    getReviews ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl,
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
    getUserReview ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/user_reviews',
          method: 'get',
          params: {
            page: payload.pagination.current,
            limit: payload.pagination.pageSize,
            ...payload.params
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
    getNewUserReview ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/reports/branch_reviews',
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
    getCustomReview ({ commit }, params) {
      console.log(params)
      // const { page } = params

      return new Promise((resolve, reject) => {
        request({
          url: '/reports/custom_reviews',
          method: 'get',
         params: {
           branch_id: params.branch_id,
           courier_id: params.courier_id,
           end_date: params.end_date,
           start_date: params.start_date,
           page: params.page ? params.page : 1,
           limit: params.limit ? params.limit : 1000
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
    getReportReviews ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/reports/reviews',
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
    getOperatorReview ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/reports/operator_reviews',
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
    getReview ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + id,
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
    postReview ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl,
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
    updateReview ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + data.id,
          method: 'put',
          data: data
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteReview ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + id,
          method: 'delete'
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
export default auth
