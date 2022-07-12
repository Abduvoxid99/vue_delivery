import request from '@/utils/request'
import notification from 'ant-design-vue/es/notification'
import moment from 'moment'

const orders = {
  state: {
    todayOrdertimeList: [],
    orders: [],
    selected_order: {},
    courier_accepted: [],
    courier_cancelled: [],
    courier_picked_up: [],
    delivered: [],
    finished: [],
    new: [],
    operator_accepted: [],
    operator_cancelled: [],
    branches_accepted: [],
    branches_cancelled: [],
    branches_ready: [],
    load_branch_ready: false,
    operator_accepted_pagination: {},
    courier_accepted_pagination: {},
    courier_cancelled_pagination: {},
    courier_picked_up_pagination: {},
    delivered_pagination: {},
    finished_pagination: {},
    new_pagination: {},
    branches_accepted_pagination: {},
    branches_cancelled_pagination: {},
    branches_ready_pagination: {},
    pagination: {},
    loading: false,
    ordersearch: [],
    orderclinetnemas: []
  },
  getters: {
    todayOrdertimeList: state => state.todayOrdertimeList,
    selected_order: state => state.selected_order,
    paginationOrder: state => state.pagination,
    orders: state => state.orders,
    courier_accepted: state => state.courier_accepted,
    courier_cancelled: state => state.courier_cancelled,
    courier_picked_up: state => state.courier_picked_up,
    delivered: state => state.delivered,
    finished: state => state.finished,
    new: state => state.new,
    operator_accepted: state => state.operator_accepted,
    operator_cancelled: state => state.operator_cancelled,
    branches_accepted: state => state.branches_accepted,
    branches_cancelled: state => state.branches_cancelled,
    branches_ready: state => state.branches_ready,
    operator_accepted_pagination: state => state.operator_accepted_pagination,
    courier_accepted_pagination: state => state.courier_accepted_pagination,
    courier_cancelled_pagination: state => state.courier_cancelled_pagination,
    courier_picked_up_pagination: state => state.courier_picked_up_pagination,
    delivered_pagination: state => state.delivered_pagination,
    finished_pagination: state => state.finished_pagination,
    new_pagination: state => state.new_pagination,
    branches_accepted_pagination: state => state.branches_accepted_pagination,
    branches_cancelled_pagination: state => state.branches_cancelled_pagination,
    branches_ready_pagination: state => state.branches_ready_pagination,
    orderLoad: state => state.loading,
    load_branch_ready: state => state.load_branch_ready,
    get_one_order: state => state.ordersearch,
    get_sms_payment_list: stata => stata.orderclinetnemas
  },
  mutations: {
    GET_SELECTED_ORDER: (state, selected) => {
      state.selected_order = selected
    },
    ORDER_LOADING: (state, payload) => {
      state.loading = payload
    },
    GET_ORDERS: (state, orders) => {
      state.orders = orders
    },
    GET_ORDERS_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    },
    GET_NEW_ORDERS: (state, newOrders) => {
      state.new = newOrders
    },
    GET_NEW_ORDERS_PAGINATION: (state, pagination) => {
      state.new_pagination = pagination
    },
    GET_OPERATOR_ACCEPTED: (state, newOrders) => {
      state.operator_accepted = newOrders
    },
    GET_OPERATOR_ACCEPTED_PAGINATION: (state, pagination) => {
      state.operator_accepted_pagination = pagination
    },
    GET_OPERATOR_CANCELLED: (state, newOrders) => {
      state.operator_accepted = newOrders
    },
    GET_OPERATOR_CANCELLED_PAGINATION: (state, pagination) => {
      state.operator_cancelled_pagination = pagination
    },
    GET_BRANCHES_ACCEPTED: (state, newOrders) => {
      state.branches_accepted = newOrders
    },
    GET_BRANCHES_ACCEPTED_PAGINATION: (state, pagination) => {
      state.branches_accepted_pagination = pagination
    },
    GET_BRANCHES_CANCELLED: (state, status) => {
      state.branches_cancelled = status
    },
    GET_BRANCHES_CANCELLED_PAGINATION: (state, pagination) => {
      state.branches_cancelled_pagination = pagination
    },
    GET_BRANCHES_READY: (state, status) => {
      state.branches_ready = status
    },
    GET_BRANCHES_READY_LOADING: (state, payload) => {
      state.load_branch_ready = payload
    },
    GET_BRANCHES_READY_PAGINATION: (state, pagination) => {
      state.branches_ready_pagination = pagination
    },
    GET_COURIER_ACCEPTED: (state, status) => {
      state.courier_accepted = status
    },
    GET_COURIER_ACCEPTED_PAGINATION: (state, pagination) => {
      state.courier_accepted_pagination = pagination
    },
    GET_COURIER_CANCELLED: (state, status) => {
      state.courier_cancelled = status
    },
    GET_COURIER_CANCELLED_PAGINATION: (state, pagination) => {
      state.courier_cancelled_pagination = pagination
    },
    GET_COURIER_PICKED_UP: (state, status) => {
      state.courier_picked_up = status
    },
    GET_COURIER_PICKED_UP_PAGINATION: (state, pagination) => {
      state.courier_picked_up_pagination = pagination
    },
    GET_DELIVERED: (state, status) => {
      state.delivered = status
    },
    GET_DELIVERED_PAGINATION: (state, pagination) => {
      state.delivered_pagination = pagination
    },
    GET_FINISHED: (state, status) => {
      state.finished = status
    },
    GET_FINISHED_PAGINATION: (state, pagination) => {
      state.finished_pagination = pagination
    },
    GET_ONE_ORDER: (state, payload) => {
      state.ordersearch = payload
    },
    GET_SMS_PAYMENT_LIST: (state, payload) => {
      state.orderclinetnemas = payload
    }
  },
  actions: {
    updateOrderPaymentType ({ _ }, { id, ...payload }) {
      // eslint-disable-next-line promise/param-names
      return new Promise((result, reject) => {
        request({ url: `/order/${id}/change-payment-type`, method: 'patch', data: payload }).then(res => {
         if (res) {
           notification.success({
             message: 'Тип платежа успешно обновлен'
           })
         }
          result(res)
        })
          .catch(err => {
            console.log(err)
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(err)
            notification.error({
              message: 'error'
            })
          })
      })
    },
    setSmsPamentSend ({ commit }, paylod) {
      console.log(paylod)
      // eslint-disable-next-line promise/param-names
      return new Promise((result, reject) => {
        request({ url: `/sms-payment/send-sms`, method: 'POST', data: paylod }).then(res => {
         if (res) {
           notification.success({
             message: 'Смс успешно отправлено'
           })
         }
          result(res)
        })
          .catch(err => {
            console.log(err)
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(err)
            notification.error({
              message: 'error'
            })
          })
      })
    },
    getOrderList ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: `/sms-payment/`,
          method: 'GET',
          params: { shipper_id: `${JSON.parse(localStorage.getItem('shipper_id'))}`, page: 1, limit: 1000 }
        })
          .then(res => {
            resolve()
            console.log(res.smspayments)
            commit('GET_SMS_PAYMENT_LIST', res.smspayments)
            resolve(res)
            console.log(res)
          })
          .catch(err => {
            // eslint-disable-next-line prefer-promise-reject-errors
            notification.error({
              message: this.$t('smssuccessfull'),
              duration: 5
            })
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
            console.log(err)
          })
      })
    },
    setSmsPayment ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({ url: `/sms-payment/send-sms`, method: 'POST', data: payload })
          .then(res => {
            resolve()
            console.log(res)
          })
          .catch(err => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
            console.log(err)
          })
      })
    },
    getOneOrder ({ commit }, id) {
      console.log(id)
      // eslint-disable-next-line promise/param-names
      return new Promise((resolve, reject) => {
        request({
          url: `/order`,
          params: {
            external_order_id: id
          }
        })
          .then(res => {
            resolve(res)
            commit('GET_ONE_ORDER', res)
            if (res.orders && res.orders.length) {
              notification.success({
                message: 'Заказ  найден'
              })
            }
          })
          .catch(err => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(err)
            console.log(err)
          })
      })
    },
    getSelected ({ commit }, id) {
      request({
        url: `/order/${id}`
      })
        .then(result => {
          console.log('dell')
          console.log(result)
          commit('GET_SELECTED_ORDER', result)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getOrder ({ commit }, id) {
      return request({
        url: `/order/${id}`,
        method: 'GET'
      })
    },
    getNew ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = '986a0d09-7b4d-4ca9-8567-aa1c6d770505'
      return request('/order', {
        params: {
          status_ids: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_NEW_ORDERS_PAGINATION', pagination)
          commit('GET_NEW_ORDERS', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getOperatorAccepted ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = 'ccb62ffb-f0e1-472e-bf32-d130bea90617'
      return request('/order', {
        params: {
          status_id: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          console.log(pagination, 'pagi in vuex')
          commit('GET_OPERATOR_ACCEPTED_PAGINATION', pagination)
          commit('GET_OPERATOR_ACCEPTED', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getOperatorCancelled ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1'
      return request('/order', {
        params: {
          status_id: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_OPERATOR_CANCELLED_PAGINATION', pagination)
          commit('GET_OPERATOR_CANCELLED', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getBranchesAccepted ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3'
      return request('/order', {
        params: {
          status_id: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_BRANCHES_ACCEPTED_PAGINATION', pagination)
          commit('GET_BRANCHES_ACCEPTED', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getBranchesCancelled ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = 'c4227d1b-c317-46f8-b1e3-a48c2496206f'
      return request('/order', {
        params: {
          status_id: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_BRANCHES_ACCEPTED_PAGINATION', pagination)
          commit('GET_BRANCHES_ACCEPTED', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getBranchesReady ({ commit }, page) {
      commit('GET_BRANCHES_READY_LOADING', true)
      return new Promise((resolve) => {
        // eslint-disable-next-line camelcase
        const status_id = 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd'
        request('/order',
          {
            params: {
              status_id: status_id,
              page: page.pagination.current,
              limit: page.pagination.pageSize,
              customer_phone: page.phone,
              branch_ids: page.searchingBranches
            }
          })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_BRANCHES_READY_PAGINATION', pagination)
            commit('GET_BRANCHES_READY', result.orders)
            resolve()
          })
          .catch(error => {
            console.log(error)
          })
          .finally(() => {
            commit('GET_BRANCHES_READY_LOADING', false)
          })
      })
    },
    getCourierAccepted ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'
      return request('/order', {
        params: {
          status_id: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_COURIER_ACCEPTED_PAGINATION', pagination)
          commit('GET_COURIER_ACCEPTED', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCourierCancelled ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = '6ba783a3-1c2e-479c-9626-25526b3d9d36'
      return request('/order', {
        params: {
          status_id: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_COURIER_CANCELLED_PAGINATION', pagination)
          commit('GET_COURIER_CANCELLED', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCourierPickedUp ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = '84be5a2f-3a92-4469-8283-220ca34a0de4'
      return request('/order', {
        params: {
          status_id: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_COURIER_PICKED_UP_PAGINATION', pagination)
          commit('GET_COURIER_PICKED_UP', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getDelivered ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = '79413606-a56f-45ed-97c3-f3f18e645972'
      return request('/order', {
        params: {
          status_id: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_DELIVERED_PAGINATION', pagination)
          commit('GET_DELIVERED', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getFinished ({ commit }, page) {
      // eslint-disable-next-line camelcase
      const status_id = 'e665273d-5415-4243-a329-aee410e39465'
      return request('/order', {
        params: {
          status_id: status_id,
          page: page.current,
          limit: page.pageSize,
          customer_phone: page.phone,
          branch_ids: page.searchingBranches
        }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_FINISHED_PAGINATION', pagination)
          commit('GET_FINISHED', result.orders)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getAll ({ commit }, page) {
      return new Promise((resolve, reject) => {
        commit('ORDER_LOADING', true)
        request('/order', {
          params: {
            page: page.current,
            limit: page.pageSize,
            customer_phone: page.phone,
            branch_ids: page.searchingBranches,
            start_date: page.start,
            end_date: page.end
          }
        })
          .then(result => {
            resolve()
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_ORDERS_PAGINATION', pagination)
            commit('GET_ORDERS', result.orders)
            commit('ORDER_LOADING', false)
          })
          .catch(() => {
          })
      })
    },
    getDailyOrders ({ commit }, data) {
      return request('/order', {
        params: {
          page: data?.page || 1,
          limit: data?.limit || 1023,
          start_date: moment().format('YYYY-MM-DD') + ' 05:00:00',
          end_date: moment().add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00'
        }
      })
    },
    getAllOrders ({ _ }, params) {
      return request('/order', {
        params
      })
    },
    getOrdersLocations ({ _ }, params) {
      return request('/order-locations', {
        params
      })
    },
    getUserLogs ({ _ }, params) {
      return request('/user_logs', {
        params
      })
    },
    postUserLogs ({ _ }, paylod) {
      console.log('USER-LOGS-DATA', paylod)
      return request({
        url: '/user_logs',
        method: 'POST',
        data: paylod
      })
    },
  }
}
export default orders
