import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json',
}

export default {
  state: {
    pagination: {},
    BranchList: [],
    orderStatus: {},
    reporCourierList: [],
    loading: false
  },
  getters: {
    OrderStatus: state => state.orderStatus,
    FilyalBranchlist: state => state.BranchList,
    // searchingCustomers: state => state.searchingCustomers,
    // allCustomers: (state) => state.customers,
    // loadingSearchingCustomers: state => state.loadingSearchingCustomers,
    // loadCustomer: (state) => state.loadCustomer,
    paginationCourierReportsMian: (state) => state.pagination,
    reporCourierList: (state) => state.reporCourierList
    // orderCustomer: (state) => state.orderCustomer,
    // customerMapHistory: (state) => state.mapHistory
  },
  mutations: {
    GET_CUSTOMER_REPORT (state, payload) {
      state.reporCourierList = payload
    },
    GET_LOAD_CUSTOMER (state, payload) {
      state.loadCustomer = payload
    },
    GET_ORDER_CUSTOMER (state, payload) {
      state.orderCustomer = payload
    },
    GET_BRANCH_LIST (state, payload) {
      state.BranchList = payload
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
    }
  },
  actions: {
    CourierTabsReportExcelDowlonds ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/courier_order_report',
          method: 'get',
          params: payload
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getCourierOrderReport ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/reports/courier_order_report',
          headers: headers,
          params: {
            to_date: params.to_date ?? '',
            from_date: params.from_date ?? '',
            from_time: params.from_time ?? '',
            to_time: params.to_time ?? '',
            sort_by: params.sort_by ?? '',
            sort_type: params.sort_type ?? '',
            courier_id: params.courier_id ?? ''
          }
        })
          .then(res => {
            console.log('rewwwwww=>>>', res)
            resolve(res)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
      })
    },
    CourierReportExcelDowlonds ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/courier_report',
          method: 'get',
          params: payload
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => [
            reject(err)
          ])
      })
    },
    getRepeorCuriertMainList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        // axios
        request({
          url: '/reports/courier_report',
          headers: headers,
          params: {
            page: payload.page.page,
            limit: payload.page.pageSiz,
            to_date: payload.to_date,
            from_date: payload.from_date,
            from_time: payload.from_time === '' ? '' : payload.from_time,
            to_time: payload.to_time === '' ? '' : payload.to_time,
            sort_by: payload.sort_by === '' ? '' : payload.sort_by,
            sort_type: payload.sort_type === '' ? '' : payload.sort_type,
            branch_id: payload.branch_id === '' ? '' : payload.branch_id

          }
        })
          .then(res => {
            // const pagination = payload.page
            resolve(res)
            // console.log('===>>', res)
            // pagination.totle = res.count
            // commit('GET_REPORT_PAGINATION', pagination)
            // commit('GET_REPORT_PAGINATION', pagination)
            // console.log(res.reports.map(el => el.id))
            commit('GET_CUSTOMER_REPORT', res.reports.map((el, index) => ({ ...el, index })))
            // commit('GET_TABLE_LOADING', false)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
          .finally(() => {
            // commit('GET_LOAD_CUSTOMER_COURIER', false)
          })
      })
    },
    BranchListGet ({ commit }, params = { limit: 50, page: 1 }) {
      return new Promise((resolve, reject) => {
        // axios
        request({
          url: '/branches',
          headers: headers,
          params
        })
          .then(res => {
            // console.log('resp order=>.>>>', res.branches)
            commit('GET_BRANCH_LIST', res.branches)
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
    // getPhoneCustomer ({ commit }, payolod) {
    //   commit('GET_LOAD_SEARCHING_CUSTOMER', true)
    //   commit('GET_SEARCHING_CUSTOMER', payolod)
    // },
    // customerCreate ({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: '/customers',
    //       method: 'POST',
    //       data: payload
    //     }).then(res => {
    //       resolve(res)
    //       // console.log(res)
    //     })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    // getCustomerList ({ commit }, params) {
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: '/customers',
    //       params: params
    //     }).then(res => {
    //       resolve(res)
    //     })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
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
