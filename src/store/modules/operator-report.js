import request from '@/utils/request'
// import moment from 'moment'

const headers = {
  'Content-Type': 'application/json'
}

const operatorReports = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    ReporTabOnetOperatorExcel ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/operators',
          method: 'get',
          params: payload
        }).then(res => {
          resolve(res)
        })
          .catch(err => {
            reject(err)
          })
      })
    },
    getOperatorReports ({ commit }, payload) {
      return request({
        url: '/reports/operators',
        headers: headers,
        params: {
          start_date: payload[0],
          end_date: payload[1]
        }
        // params: { start_date: '2020-08-20 05:00:00', end_date: '2020-08-20 16:00:00' }
        // params: { start_date: date[0], end_date: date[1] }
      })
    }
  }
}

export default operatorReports
