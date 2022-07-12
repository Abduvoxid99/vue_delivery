import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const shipperReports = {
    state: {
      shipperReports: [],
      statusReports: [],
      pagination: {}
    },
    getters: {
      paginationShipperReports: state => state.pagination,
      shipperReports: state => state.shipperReports,
      statusReports: state => state.statusReports
    },
    mutations: {
      GET_SHIPPER_REPORTS: (state, shipperReports) => {
          state.shipperReports = shipperReports
      },
      GET_STATUS_REPORTS: (state, payload) => {
        state.statusReports = payload
      },
      GET_SHIPPER_REPORTS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getShipperReports ({ commit }, date) {
        const page = { current: 1, pageSize: 100, total: null }
        return new Promise((resolve, reject) => {
        request({
            url: '/reports/shipper',
            headers: headers,
            params: date
            // params: { start_date: date[0], end_date: date[1] }
        })
          .then(result => {
          console.log(result)
          const pagination = { ...page }
          pagination.total = parseInt(result.length)
          commit('GET_SHIPPER_REPORTS_PAGINATION', pagination)
          commit('GET_SHIPPER_REPORTS', result)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
      getStatusReports ({ commit }, date) {
        // const page = { current: 1, pageSize: 100, total: null }
        return new Promise((resolve, reject) => {
          request({
            url: '/reports/status-times',
            headers: headers,
            params: date
            // params: { start_date: date[0], end_date: date[1] }
          })
            .then(result => {
              console.log(result)
              // const pagination = { ...page }
              // pagination.total = parseInt(result.length)
              // commit('GET_SHIPPER_REPORTS_PAGINATION', pagination)
              commit('GET_STATUS_REPORTS', result.report)
              resolve()
            })
            .catch(error => {
              reject(error)
            })
        })
      }
  }
}
  export default shipperReports
