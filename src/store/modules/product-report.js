import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const productReports = {
  state: {
    productReports: [],
    loadProductReport: false,
    pagination: {}
  },
  getters: {
    paginationProductReports: state => state.pagination,
    productReports: state => state.productReports,
    loadProductReport: state => state.loadProductReport
  },
  mutations: {
    GET_PRODUCT_REPORTS: (state, payload) => {
      state.productReports = payload
    },
    GET_PRODUCT_LOAD: (state, payload) => {
      state.loadProductReport = payload
    },
    GET_PRODUCT_REPORTS_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    }
  },
  actions: {
    ExcelPraductReports ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/products',
          method: 'get',
          headers: headers,
          params: {
            start_date: payload.start_date,
            end_date: payload.end_date,
            branch_id: payload.branch_id
          }
        }).then(res => {
          resolve(res)
        })
          .catch(err => {
            reject(err)
          })
      })
    },
    getProductReports ({ commit }, payload) {
      // const { date } = payload
      const page = { current: 1, pageSize: 50, total: null }
      return new Promise((resolve, reject) => {
        commit('GET_PRODUCT_LOAD', true)
        request({
          url: '/reports/products',
          headers: headers,
          params: {
            start_date: payload.start_date,
            end_date: payload.end_date,
            branch_id: payload.branch_id,
            shipper_user_id: payload.shipper_user_id
          }
          //
          // params: { start_date: '2020-08-20 05:00:00', end_date: '2020-08-20 16:00:00' }
          // params: { start_date: date[0], end_date: date[1] }
        })
          .then(result => {
            console.log(result)
            const pagination = { ...page }
            pagination.total = parseInt(result.reports.length)
            commit('GET_PRODUCT_REPORTS_PAGINATION', pagination)
            commit('GET_PRODUCT_REPORTS', result.reports)
            console.log(pagination)
            resolve(result.reports)
          })
          .catch(error => {
            reject(error)
          }).finally(() => {
          commit('GET_PRODUCT_LOAD', false)
        })
      })
    }
  }
}
export default productReports
