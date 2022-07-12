import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const branchReports = {
    state: {
      branchTimeReports: [],
      branchReports: [],
      pagination: {}
    },
    getters: {
      paginationBranchReports: state => state.pagination,
      branchReports: state => state.branchReports,
      branchTimeReports: state => state.branchTimeReports
    },
    mutations: {
      GET_BRANCH_REPORTS: (state, branchReports) => {
          state.branchReports = branchReports
      },
      GET_BRANCH_TIME_REPORTS: (state, branchTimeReports) => {
          state.branchTimeReports = branchTimeReports
      },
      GET_BRANCH_REPORTS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getBranchReports ({ commit }, date) {
        const page = { current: 1, pageSize: 100, total: null }
        return new Promise((resolve, reject) => {
        request({
            url: '/reports/branches',
            headers: headers,
            params: date
            // params: { start_date: date[0], end_date: date[1] }
        })
          .then(result => {
          console.log(result)
          const pagination = { ...page }
          pagination.total = parseInt(result.length)
          commit('GET_BRANCH_REPORTS_PAGINATION', pagination)
          commit('GET_BRANCH_REPORTS', result.reports)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
      BranchTimeReportExcelDowlonds ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: '/excel/branch_order_time_report',
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
      getOldOrderExcels ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: '/excel/order_report_old',
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
      getBranchExcelReport ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: '/excel/dashboard_order_report',
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
      getBranchExcelComparisonReport ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: `/excel/dashboard_comparison_report/${payload.id}`,
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
      getBranchTimeReports ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: '/reports/branch_order_time_report',
            headers: headers,
            params
        })
          .then(result => {
          commit('GET_BRANCH_TIME_REPORTS', result.reports)
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default branchReports
