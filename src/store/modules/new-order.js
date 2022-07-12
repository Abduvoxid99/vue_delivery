import request from '@/utils/request'
import notification from 'ant-design-vue/lib/notification'
export default {
  state: {
    orders: [],
    orders_count: [],
    orders_notif_count: [],
    pagination: {},
    loading: false
  },
  getters: {
    order: state => state.orders,
    orders_count: state => state.orders_count,
    orders_notif_count: state => state.orders_notif_count,
    load_order: state => state.loading,
    orderPagination: state => state.pagination
  },
  mutations: {
    GET_ORDER: (state, payload) => {
      state.orders = payload
    },
    GET_ORDER_COUNT: (state, payload) => { state.orders_count = payload },
    GET_ORDER_NOTIF_COUNT: (state, payload) => { state.orders_notif_count = payload },
    GET_LOAD_ORDER: (state, payload) => { state.loading = payload },
    GET_PAGINATION_ORDER: (state, payload) => { state.pagination = payload },
  },
  actions: {
    getAllOrder ({ commit }, params) {
      commit('GET_LOAD_ORDER', true)
      console.log('->9', params.external_order_id)

      return new Promise((resolve, reject) => {
        const { pagination } = params
        console.log('params =>.>>>>', params)
        request({
          url: '/order',
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
            status_ids: params.status_ids ? params.status_ids : (params.status_id === 'all' ? undefined : params.status_id),
            sort_by: params.sort_by,
            external_order_id: params.external_order_id,
            payment_type: params.payment_type,
            customer_id: params.customer_id,
            courier_id: params.courier_id,
            branch_ids: params.branch_ids,
            start_date: params.start_date,
            end_date: params.end_date
          },
        })
          .then(result => {
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            console.log(result)
            const page = { ...pagination }
            page.total = parseInt(result.count)
            commit('GET_PAGINATION_ORDER', page)
            commit('GET_ORDER', result.orders)
            resolve()
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
          .finally(() => {
            commit('GET_LOAD_ORDER', false)
          })
      })
    },
    getAllOrderNotLoader ({ commit }, params) {
      console.log('-> getAllOrder', params.external_order_id)
      return new Promise((resolve, reject) => {
        const { pagination } = params
        request({
          url: '/order',
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
            external_order_id: params.external_order_id,
            status_ids: params.status_ids ? params.status_ids : (params.status_id === 'all' ? undefined : params.status_id),
            sort_by: params.sort_by,
            customer_id: params.customer_id,
            payment_type: params.payment_type,
            courier_id: params.courier_id,
            branch_ids: params.branch_ids,
            start_date: params.start_date,
            end_date: params.end_date
          },
        })
          .then(result => {
            // console.log(result, page)
            // eslint-disable-next-line no-use-before-define
            const page = { ...pagination }
            page.total = parseInt(result.count)
            commit('GET_PAGINATION_ORDER', page)
            commit('GET_ORDER', result.orders)
            resolve()
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    getOrderByCountStatuses ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/orders-count-by-statuses',
          params: {
            status_ids: payload.ids,
            start_date: payload.start,
            end_date: payload.end
          }
        })
          .then(result => {
            commit('GET_ORDER_COUNT', result.orders_count)
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    getOrderById ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/order/${id}`
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    getOrderByCountNotifStatuses ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/orders-count-by-statuses',
          params: {
            status_ids: payload.ids,
            start_date: payload.start,
            end_date: payload.end
          }
        })
          .then(result => {
            commit('GET_ORDER_NOTIF_COUNT', result.orders_count)
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    changeStatusOrder ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/order/${payload.id}/change-status`,
          method: 'PATCH',
          data: payload.data
        })
          .then(result => {
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            resolve()
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    changePaymentTypeOrder ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/order/${payload.id}/change-payment-type`,
          method: 'PATCH',
          data: payload.data
        })
          .then(result => {
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    removeCourierOrder ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/order/${id}/remove-courier`,
          method: 'PATCH'
        })
          .then(result => {
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            resolve()
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    crmSend ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/crm/send_order/${id}`,
          method: 'get'
        })
          .then(result => {
            resolve()
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    saveNewOrder ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/ondemand-order',
          method: 'POST',
          data: payload
        })
          .then(result => {
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    updateNewOrder ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/order/${payload.id}`,
          method: 'PUT',
          data: payload.data
        })
          .then(result => {
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    NewOrderChangeAdd ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/ondemand-order`,
          method: 'post',
          data: payload
        })
          .then(result => {
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    },
    refreshBotDb ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: '/telegram/refresh-db',
          method: 'POST',
          data: data
        })
          .then(result => {
            console.log(result)
            // console.log(result, pagination)
            // eslint-disable-next-line no-use-before-define
            resolve(result)
          })
          .catch(error => {
            notification.error({
              message: 'Ошибка сети или сервер не работает',
              description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
              duration: 5
            })
            reject(error)
          })
      })
    }
  }
}
