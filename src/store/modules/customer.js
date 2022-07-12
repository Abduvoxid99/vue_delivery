import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

export default {
  state: {
    customersType: [],
    customers: [],
    loadCustomer: false,
    orderCustomer: [],
    pagination: {},
    searchingCustomers: [],
    mapHistory: [],
    mapCustomerAddresses: [],
    loadingSearchingCustomers: false,
    customerComments: []
  },
  getters: {
    ClientType: state => state.customersType,
    searchingCustomers: state => state.searchingCustomers,
    allCustomers: (state) => state.customers,
    loadingSearchingCustomers: state => state.loadingSearchingCustomers,
    loadCustomer: (state) => state.loadCustomer,
    paginationCustomer: (state) => state.pagination,
    orderCustomer: (state) => state.orderCustomer,
    customerMapHistory: (state) => state.mapHistory,
    customerMapAddresses: (state) => state.mapCustomerAddresses,
    customerComments: (state) => state.customerComments
  },
  mutations: {
    GET_ALL_CUSTOMERS (state, payload) {
      state.customers = payload
    },
    GET_LOAD_CUSTOMER (state, payload) {
      state.loadCustomer = payload
    },
    GET_CUSTOMER_TYPE_LIST (state, payload) {
      state.customersType = payload
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
    GET_CUSTOMER_PAGINATION (state, payload) {
      state.pagination = payload
    },
    GET_CUSTOMER_ADDRESS_HISTORY (state, payload) {
      state.mapHistory = payload
    },
    GET_CUSTOMER_CUSTOM_ADDRESS_HISTORY (state, payload) {
      state.mapCustomerAddresses = payload
    },
    GET_CUSTOMER_COMMENTS (state, payload) {
      state.customerComments = payload
    }
  },
  actions: {
     getAllCustomers ({ commit }, payload) {
      // e.preventDefault()
      return new Promise((resolve, reject) => {
        console.log('payload', payload)
        const { pagination, search, created, startCount, endCount, startAverage, endAverage } = payload
        commit('GET_LOAD_CUSTOMER', true)
        // axios
        request({
            url: '/customers',
            headers: headers,
            params: {
                page: pagination.current,
                limit: pagination.pageSize,
                search: search,
                start_date: created[0],
                end_date: created[1],
                start_count: startCount,
                end_count: endCount,
                start_average: startAverage,
                end_average: endAverage
                // end_count: parseInt(endCount) || '',
                // start_average: parseInt(startAverage) || '',
                // end_average: parseInt(endAverage) || ''
            }
        })
          .then(res => {
            resolve(res.customers)
            console.log(res)
            pagination.total = parseInt(res.count)
            commit('GET_CUSTOMER_PAGINATION', pagination)
            commit('GET_ALL_CUSTOMERS', res.customers)
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
    getAllCustomersType ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('GET_LOAD_CUSTOMER', true)
        // axios
        request({
          url: '/customer_type',
          method: 'get',
          headers: headers,
          params: {
            page: payload.current,
            limit: payload.pageSize,
            name: payload.name ? payload.name : ''
          }
        })
          .then(res => {
            resolve()
            console.log(res)
            commit('GET_CUSTOMER_TYPE_LIST', res.customer_types)
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
    getPhoneCustomers ({ commit }, payload) {
      commit('GET_LOAD_SEARCHING_CUSTOMER', true)
      return new Promise((resolve, reject) => {
        const { limit, phone } = payload
        // axios
        request({
            url: '/search-customers',
            headers: headers,
            params: {
                limit: limit,
                phone: phone
            }
        })
          .then(res => {
            console.log('resp name=>.>>>', res.customers)
            commit('GET_SEARCHING_CUSTOMER', res.customers)
            resolve(res.customers)
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_LOAD_SEARCHING_CUSTOMER', false)
          })
      })
    },
    getPhoneCustomer ({ commit }, payolod) {
      commit('GET_LOAD_SEARCHING_CUSTOMER', true)
      commit('GET_SEARCHING_CUSTOMER', payolod)
    },
    customerCreate ({ commit }, payload) {
        return new Promise((resolve, reject) => {
            request({
                url: '/customers',
                method: 'POST',
                data: {
                  name: payload.name,
                  phone: payload.phone,
                  customer_type_id: payload.customer_type_id ? payload.customer_type_id : null
                }
            }).then(res => {
                resolve(res)
                // console.log(res)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    getCustomerList ({ commit }, params) {
        return new Promise((resolve, reject) => {
            request({
                url: '/customers',
                params: params
            }).then(res => {
                resolve(res)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    customerDelete ({ commit }, payload) {
        return new Promise((resolve, reject) => {
            request({
                url: `/customers/${payload}`,
                method: 'DELETE'
            }).then(res => {
                resolve(res)
                console.log(res)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    customerUpdate ({ commit }, payload) {
        return new Promise((resolve, reject) => {
            request({
                url: `/customers/${payload.id}`,
                method: 'PUT',
                data: payload.data
            }).then(res => {
                resolve(res)
                console.log(res)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    getCustomerById ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
            url: `/orders-with-average-price/${payload}`,
            method: 'GET',
            params: {
              limit: 20,
            }
        }).then(res => {
          console.log(res)
          commit('GET_ORDER_CUSTOMER', res)
          resolve(res)
        })
        .catch(error => {
            reject(error)
        })
    })
    },
    getCustomerByPhone ({ commit }, phone) {
      return new Promise((resolve, reject) => {
        request({
            url: `/customers`,
            method: 'GET',
            params: {
              search: phone
            }
        }).then(res => {
            resolve(res.customers[0])
        })
        .catch(error => {
            reject(error)
        })
    })
    },
    getCustomerAddressHistory ({ commit }, phone) {
      return new Promise((resolve, reject) => {
        request({
            url: `/customer-addresses/${phone}`,
            method: 'GET',
        }).then(res => {
          commit('GET_CUSTOMER_ADDRESS_HISTORY', res.addresses)
          commit('GET_CUSTOMER_CUSTOM_ADDRESS_HISTORY', res.customer_addresses)
            resolve(res)
            console.log(res)
        })
        .catch(error => {
            reject(error)
        })
    })
    },
    getCustomerComments ({ commit }, id) {
      if (!id) {
        commit('GET_CUSTOMER_COMMENTS', [])
        return
      }
      return new Promise((resolve, reject) => {
        request({
            url: '/customer-comment',
            method: 'GET',
            params: {
              customer_id: id
            }
        }).then(res => {
          commit('GET_CUSTOMER_COMMENTS', res.comments)
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
    }
  }
}
