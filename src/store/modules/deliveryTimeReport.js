import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const deliveryTimeReport = {
  actions: {
    ExcelDeleviryTime ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/time_report',
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
    ExcelForecastDelivery ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/courier_predict_report',
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
    ExcelForecastProduct ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/product_predicted_report',
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
    getDeliveryTimeReports ({ commit }, date) {
      // const page = { current: 1, pageSize: 10, total: null }
      console.log(date)
      return new Promise((resolve, reject) => {
        request({
          url: '/reports/time',
          headers: headers,
          params: { start_date: date.start_date, end_date: date.end_date }
        })
          .then(({ reports }) => {
            // const pagination = { ...page, total: parseInt(reports.length) }
            // commit('GET_SHIPPER_REPORTS_PAGINATION', pagination)
            // commit('GET_SHIPPER_REPORTS', result)
            resolve(reports)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getForecastDeliveryReports ({ commit }, date) {
      // const page = { current: 1, pageSize: 10, total: null }
      console.log('1114', date)
      return new Promise((resolve, reject) => {
        request({
          url: '/reports/courier_predict_report',
          headers: headers,
          params: { date: date.start_date }
        })
          .then(({ reports }) => {
            // const pagination = { ...page, total: parseInt(reports.length) }
            // commit('GET_SHIPPER_REPORTS_PAGINATION', pagination)
            // commit('GET_SHIPPER_REPORTS', result)
            resolve(reports)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getForecastProductReports ({ commit }, date) {
      // const page = { current: 1, pageSize: 10, total: null }
      console.log('1114', date)
      return new Promise((resolve, reject) => {
        request({
          url: '/reports/product_predict_report',
          headers: headers,
          params: { branch_id: date.branch_id, date: date.start_date }
        })
          .then(({ reports }) => {
            // const pagination = { ...page, total: parseInt(reports.length) }
            // commit('GET_SHIPPER_REPORTS_PAGINATION', pagination)
            // commit('GET_SHIPPER_REPORTS', result)
            resolve(reports)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default deliveryTimeReport
