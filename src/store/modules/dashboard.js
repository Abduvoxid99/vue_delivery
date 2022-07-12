import request from '@/utils/request'
export default {
  state: {
    monthly: [],
    yearly: []
  },
  getters: {
    monthlyStats: (state) => state.monthly,
    yearlyStats: (state) => state.yearly
  },
  mutations: {
    GET_MONTHLY (state, payload) {
      state.monthly = payload
    },
    GET_YEARLY (state, payload) {
      state.yearly = payload
    }
  },
  actions: {
    getStats ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const { month, year } = payload
        request({
          url: '/reports/dashboard',
          params: {
            month: month,
            year: year
          }
        })
          .then(res => {
            console.log('chartjs data =>>', res)
            resolve(res)
            commit('GET_MONTHLY', res.monthly_orders_reports)
            commit('GET_YEARLY', res.yearly_orders_reports)
          })
          .catch(error => {
            reject(error)
            this.$message.error(error.message)
          })
      })
    }
  }
}
