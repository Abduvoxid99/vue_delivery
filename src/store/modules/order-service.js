import request from '@/utils/request'
import notification from 'ant-design-vue/lib/notification'
export default {
  state: {
    customers: [],
  },
  getters: {
    customers: state => state.customers
  },
  mutations: {
  },
  actions: {
    getCustomers ({ commit }, params) {
      commit('GET_LOAD_ORDER', true)
      return new Promise((resolve, reject) => {
        const { pagination } = params
        request({
          url: '/order',
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
            status_ids: params.status_ids ? params.status_ids : (params.status_id === 'all' ? undefined : params.status_id),
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
  }
}
