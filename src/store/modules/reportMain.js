import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

export default {
  state: {
    pagination: {},
    orderStatus: {},
    reporList: [],
    ordersCurer: [],
    buttonLoading: false
  },
  getters: {
    OrderStatus: state => state.orderStatus,
    ordersCurer: state => state.ordersCurer,
    buttonLoading: state => state.buttonLoading,
    // searchingCustomers: state => state.searchingCustomers,
    // allCustomers: (state) => state.customers,
    // loadingSearchingCustomers: state => state.loadingSearchingCustomers,
    // loadCustomer: (state) => state.loadCustomer,
    paginationReportsMianCourier: state => state.pagination,
    reporList: (state) => state.reporList
    // orderCustomer: (state) => state.orderCustomer,
    // customerMapHistory: (state) => state.mapHistory
  },
  mutations: {
    GET_ALL_REPORTS (state, payload) {
      state.reporList = payload
    },
    GET_LOAD_CUSTOMER (state, payload) {
      state.loadCustomer = payload
    },
    GET_ORDER_CUSTOMER (state, payload) {
      state.orderCustomer = payload
    },
    GET_SEARCHING_CUSTOMER (state, payload) {
      state.searchingCustomers = payload
    },
    GET_LOAD_SEARCHING_CUSTOMER (state, payload) {
      state.loadingSearchingCustomers = payload
    },
    GET_REPORT_PAGINATION (state, payload) {
      state.pagination = payload
    },
    GET_CUSTOMER_ADDRESS_HISTORY (state, payload) {
      state.mapHistory = payload
    },
    GET_ORDER_STATUS (state, payload) {
      state.orderStatus = payload
    },
    GET_DATA_CUSTOMER (state, payload) {
      state.ordersCurer = payload
    },
    BUTTON_LOADING: (state, payload) => {
      state.buttonLoading = payload
    }
  },
  actions: {
    ExcelMainReports ({ commmit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/main_order_report',
          method: 'GET',
          params: {
            from_date: payload.from_date,
            to_date: payload.to_date,
            from_time: payload.from_time,
            to_time: payload.to_time,
            operator_id: payload.operator_id,
            sort_by: payload.sort_by,
            sort_type: payload.sort_type
          }
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getRepeortMainList ({ commit }, payload) {
      // let { page } = payload
      // if (!page) {
      //   page = { page: 1, limit: 50, totle: null }
      // }
      console.log('1111', payload)
      return new Promise((resolve, reject) => {
        commit('GET_LOAD_CUSTOMER', true)
        // axios
        request({
          url: '/reports/order_report',
          headers: headers,
          params: {
            page: payload.page.page,
            limit: payload.page.limit,
            from_date: payload.from_date,
            to_date: payload.to_date,
            from_time: payload.from_time === '' ? '' : payload.from_time,
            to_time: payload.to_time === '' ? '' : payload.to_time,
            sort_by: payload.sort_by === '' ? '' : payload.sort_by,
            sort_type: payload.sort_type === '' ? '' : payload.sort_type

          }
        })
          .then(res => {
            const pagination = payload.page
            resolve(res)
            console.log(res)
            console.log('res.count==>>', res.count)
            pagination.totle = res.count
            // commit('GET_REPORT_PAGINATION', pagination)
            // commit('GET_REPORT_PAGINATION', pagination)
            commit('GET_ALL_REPORTS', res.reports)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
          .finally(() => {
            commit('GET_LOAD_CUSTOMER', false)
          })
      })
    },
    getOrderAllList ({ commit, state }, payload) {
      let { pagination } = payload
      if (!pagination) {
        pagination = { current: 1, pageSize: 50, total: null }
      }
      commit('GET_LOAD_SEARCHING_CUSTOMER', true)
      return new Promise((resolve, reject) => {
        // axios
        request({
          url: '/order',
          headers: headers,
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
            start_date: payload.start_date,
            end_date: payload.end_date,
            aggregator_id: payload.aggregator_id,
            status_ids: payload.status_ids,
            delivery_type: payload.delivery_type ? payload.delivery_type : '',
            is_reissued: payload.is_reissued ? payload.is_reissued : ''
          }
        })
          .then(res => {
            const paginations = { ...pagination }
            paginations.total = parseInt(res.count)
            console.log('resp order=>.>>>', res.customers)
            commit('GET_REPORT_PAGINATION', paginations)
            // delete res.customers[0].name
            commit('GET_DATA_CUSTOMER', res.orders)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_LOAD_SEARCHING_CUSTOMER', false)
          })
      })
    },
    getOrderReports ({ _ }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/reports/order_report_with_time`,
          method: 'GET',
          params
        }).then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getOrderReportsExcel ({ commit }, params) {
      return request({
        url: '/excel/interval_order_report',
        method: 'GET',
        params
      })
    },
    getOrderReportsWithDelayedExcel ({ commit }, params) {
      return request({
        url: '/excel/order_report_with_delayed',
        method: 'GET',
        params
      })
    },
    getOrderBranchReport ({ commit }, params) {
      return request({
        url: '/reports/dashboard_branch_report',
        method: 'GET',
        params
      })
    },
    getOrderBranchComparisonReport ({ commit }, params) {
      return request({
        url: '/reports/dashboard_branch_comparison_report',
        method: 'GET',
        params
      })
    },
    getOrderCourierReport ({ commit }, params) {
      return request({
        url: '/reports/dashboard_courier_report',
        method: 'GET',
        params
      })
    },
    getCourierReportExcel ({ commit }, params) {
      return request({
        url: '/excel/courier_review_report',
        method: 'GET',
        params
      })
    },
    getCourierReview ({ commit }, params) {
      return request({
        url: '/reports/courier_reviews',
        method: 'GET',
        params
      })
    },
    // getDowlondsXLSX ({ commit }, payolod) {
    //   commit('GET_LOAD_SEARCHING_CUSTOMER', true)
    //   commit('GET_SEARCHING_CUSTOMER', payolod)
    // },
    getDowlondsXLSX ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/order_report',
          method: 'get',
          params: payload
        }).then(res => {
          resolve(res)
          // console.log(res)
        })
          .catch(error => {
            reject(error)
          })
      })
    },
    getAggregatorXLSX ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/aggregator_order_report',
          method: 'get',
          params: payload
        }).then(res => {
          resolve(res)
          // console.log(res)
        })
          .catch(error => {
            reject(error)
          })
      })
    },
    getAggregatorReport ({ _ }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/reports/aggregator_order_report`,
          method: 'GET',
          params
        }).then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    buttonLoadingFunction ({ commit }, params) {
    commit('BUTTON_LOADING', params)
    }
    // customerDelete ({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: `/customers/${payload}`,
    //       method: 'DELETE'
    //     }).then(res => {
    //       resolve(res)
    //       console.log(res)
    //     })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    // customerUpdate ({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: `/customers/${payload.id}`,
    //       method: 'PUT',
    //       data: payload.data
    //     }).then(res => {
    //       resolve(res)
    //       console.log(res)
    //     })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    // getCustomerById ({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: `/order`,
    //       method: 'GET',
    //       params: {
    //         customer_id: payload
    //       }
    //     }).then(res => {
    //       commit('GET_ORDER_CUSTOMER', res)
    //       resolve(res)
    //       console.log(res)
    //     })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    // getCustomerByPhone ({ commit }, phone) {
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: `/customers`,
    //       method: 'GET',
    //       params: {
    //         search: phone
    //       }
    //     }).then(res => {
    //       resolve(res.customers[0])
    //     })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    // getCustomerAddressHistory ({ commit }, phone) {
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: `/customer-addresses/${phone}`,
    //       method: 'GET',
    //     }).then(res => {
    //       commit('GET_CUSTOMER_ADDRESS_HISTORY', res.addresses)
    //       resolve(res)
    //       console.log(res)
    //     })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // }
  },
  OrderStatus ({ commit }, payolad) {
    commit('GET_ORDER_STATUS', payolad)
  }
}
