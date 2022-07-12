// // import request from '@/utils/request'
//
// const headers = {
//   'Content-Type': 'application/json'
// }
//
// const CourierReport = {
// //   state: {
// //     courierDataItem: [],
// //     courierReports: [],
// //     // loadCourierReport: false,
// //     pagination: {}
// //   },
// //   getters: {
// //     curierDataItem: state => state.courierDataItem,
// //     paginationCourierReports: state => state.pagination,
// //     courierReports: state => state.courierReports,
// //     loadCourierReport: state => state.loadCourierReport
// //   },
// //   mutations: {
// //     GET_COURIER_ITEM_DATA: (state, payload) => {
// //       state.courierDataItem = payload
// //     },
// //     GET_COURIER_REPORTS: (state, payload) => {
// //       state.courierReports = payload
// //     },
// //     GET_COURIER_LOAD: (state, payload) => {
// //       state.loadCourierReport = payload
// //     },
// //     GET_COURIER_REPORTS_PAGINATION: (state, pagination) => {
// //       state.pagination = pagination
// //     }
// //   },
// //   actions: {
// //   //   getCourierReports ({ commit }, payload) {
// //   //     const { date } = payload
// //   //     const page = { current: 1, pageSize: 100, total: null }
// //   //     return new Promise((resolve, reject) => {
// //   //       commit('GET_COURIER_LOAD', true)
// //   //       request({
// //   //         url: '/reports/couriers',
// //   //         headers: headers,
// //   //         params: {
// //   //           start_date: date.start_date,
// //   //           end_date: date.end_date,
// //   //           branch_id: payload.branch_id
// //   //         }
// //   //         // params: { start_date: '2020-08-20 05:00:00', end_date: '2020-08-20 16:00:00' }
// //   //         // params: { start_date: date[0], end_date: date[1] }
// //   //       })
// //   //         .then(result => {
// //   //           console.log(result)
// //   //           const pagination = { ...page }
// //   //           pagination.total = parseInt(result.length)
// //   //           commit('GET_COURIER_REPORTS_PAGINATION', pagination)
// //   //           commit('GET_COURIER_REPORTS', result.reports)
// //   //           resolve()
// //   //         })
// //   //         .catch(error => {
// //   //           reject(error)
// //   //         }).finally(() => {
// //   //         commit('GET_COURIER_LOAD', false)
// //   //       })
// //   //     })
// //   //   }
// //   // },
// //   getCourierReportsItem ({ commit }, payload) {
// //     debugger
// //     let { page } = payload
// //     if (!page) {
// //       page = { current: 1, pageSize: 100, total: null }
// //     }
// //     return new Promise((resolve, reject) => {
// //       commit('GET_COURIER_LOAD', true)
// //       request({
// //         url: '/order',
// //         method: 'get',
// //         headers: headers,
// //         params: {
// //           courier_id: payload.courier_id,
// //           status_ids: payload.status_ids,
// //           delivery_type: payload.delivery_type,
// //           start_date: payload.start_date,
// //           end_date: payload.end_date
// //         }
// //         // params: { start_date: '2020-08-20 05:00:00', end_date: '2020-08-20 16:00:00' }
// //         // params: { start_date: date[0], end_date: date[1] }
// //       })
// //         .then(result => {
// //           console.log(result)
// //           const pagination = { ...page }
// //           pagination.total = parseInt(result.length)
// //           commit('GET_COURIER_REPORTS_PAGINATION', pagination)
// //           commit('GET_COURIER_REPORTS', result.reports)
// //           resolve(result)
// //         })
// //         .catch(error => {
// //           reject(error)
// //         }).finally(() => {
// //         commit('GET_COURIER_LOAD', false)
// //       })
// //     })
// //   }
// // }
// }
// export default CourierReport
