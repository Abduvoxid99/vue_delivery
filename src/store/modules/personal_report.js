import request from '@/utils/request'
export default {
  state: {
    data: {},
    loading: false
  },
  getters: {
    personalReport: state => state.data,
    loadPersonalReport: state => state.loading
  },
  mutations: {
    GET_PERSONAL_REPORTS: (state, shipperReports) => {
      state.data = shipperReports
    },
    GET_LOAD_PERSONAL_REPORTS: (state, payload) => {
      state.loading = payload
    }
  },
  actions: {
    getPersonalReport ({ commit }, payload) {
      commit('GET_LOAD_PERSONAL_REPORTS', true)
      return new Promise((resolve, reject) => {
        request({
          url: `/report/shipper-user/${payload.id}`,
          params: payload.date
          // params: { start_date: date[0], end_date: date[1] }
        })
          .then(result => {
            console.log(result)
            commit('GET_PERSONAL_REPORTS', result.report)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_LOAD_PERSONAL_REPORTS', false)
          })
      })
    }
  }
}
