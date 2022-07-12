import request from '@/utils/request'

const branchReportNew = {
  state: {
    TimeReports: [],
    couriers: [],
    pagination: {},
    courieritem: null,
    BranchListItem: [],
    branchReportsList: [],
    paginationDeleveryTime: {}
  },
  getters: {
    paginationDeleveryTime: state => state.paginationDeleveryTime,
    TimeReports: state => state.TimeReports,
    branchReportsList: state => state.branchReportsList,
    BranchListItem: state => state.BranchListItem
  },
  mutations: {
    GET_REPORT_TIME: (state, payload) => {
      state.TimeReports = payload
},
    GET_BRANCH_REPORT_LIST: (state, payload) => {
      state.branchReportsList = payload
    },
    GET_BRANCH_REPORT_DATA: (state, payload) => {
      state.BranchListItem = payload
    },
    GET_REPORT_TIME_PAGINATION: (state, payload) => {
      state.paginationDeleveryTime = payload
    }
  },
  actions: {
    ExcelBranchReports ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/branch_report',
          methods: 'get',
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
    ExcelClientReports ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/customers',
          methods: 'get',
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
    BranchListGetALLReport ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/reports/branch_report',
          method: 'get',
          params: {
            from_date: params.from_date,
            to_date: params.to_date,
            from_time: params.from_time,
            to_time: params.to_time,
            branch_id: params.branch_id,
            sort_by: params.sort_by,
            sort_type: params.sort_type
          }
        })
          .then(result => {
            console.log('reslove =>>', result)
            commit('GET_BRANCH_REPORT_LIST', result.reports)
            resolve(result.reports)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getOrderAllListItem ({ commit }, payload) {
      let { page } = payload
      if (!page) {
        page = { current: 1, pageSize: 50, total: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/order',
          params: payload.branch_id === '' ? {
            page: page.current,
            limit: page.pageSize,
            status_ids: payload.status_ids,
            start_date: payload.start_date,
            aggregator_id: payload.aggregator_id,
            end_date: payload.end_date,
            source: payload.source ? payload.source : '',
          } : {
            page: page.current,
            limit: page.pageSize,
            status_ids: payload.status_ids,
            branch_ids: payload.branch_id,
            start_date: payload.start_date,
            aggregator_id: payload.aggregator_id,
            end_date: payload.end_date,
            source: payload.source ? payload.source : '',
            range_time_from: payload.range_time_from,
            range_time_to: payload.range_time_to,
          }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_COURIERS_PAGINATION', pagination)
            commit('GET_BRANCH_REPORT_DATA', result.orders)
            resolve(result.couriers)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getReportTime ({ commit }, payload) {
      console.log(payload)
      return new Promise((resolve, reject) => {
        const { page } = payload
        request({
          url: `/order`,
          method: 'get',
          params: {
            page: page.current,
            limit: page.pageSize,
            branch_ids: payload.branch_ids,
            start_date: payload.start_date + ' 05:00:00',
            end_date: payload.end_date + ' 05:00:00',
            range_time_from: payload.range_time_from,
            range_time_to: payload.range_time_to,
            status_ids: 'e665273d-5415-4243-a329-aee410e39465',
          }
        })
          .then(res => {
            const pagination = { ...page }
            console.log(res)
            resolve(res)
            pagination.total = parseInt(res.count)
            commit('GET_REPORT_TIME', res.orders)
            commit('GET_REPORT_TIME_PAGINATION', pagination)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })
    },
    // courierUpdate ({ commit }, payload) {
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: `/couriers/${payload.courier_id}`,
    //       method: 'put',
    //       data: payload.form
    //     })
    //       .then(res => {
    //         console.log(res)
    //         resolve()
    //       })
    //       .catch(error => {
    //         console.log(error)
    //         // eslint-disable-next-line prefer-promise-reject-errors
    //         reject()
    //       })
    //   })
    // },
  }
}
export default branchReportNew
