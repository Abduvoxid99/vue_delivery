import request from '@/utils/request'
const clientReport = {
  state: {
    ClientRectList: [],
    clientOrderListItem: [],
    ClientPaginaton: {},
    ClientPaginationRepeort: {}

  },
  getters: {
    ClientPaginationRepeort: state => state.ClientPaginationRepeort,
    ClientPaginaton: state => state.ClientPaginaton,
    ClientRectList: state => state.ClientRectList,
    clientOrderListItem: state => state.clientOrderListItem
  },
  mutations: {
    GET_CLIENT_ALL_LIST: (state, payload) => {
      state.ClientRectList = payload
    },
    GET_CLIENT_ORDER_LIST: (state, payload) => {
      state.clientOrderListItem = payload
    },
    PAGINATIONCLIENTITEM: (state, payload) => {
      state.ClientPaginaton = payload
    },
    GET_PAGINATIN_CLIENT_REPORT: (state, payload) => {
      state.ClientPaginationRepeort = payload
    }
  },
  actions: {
    ClierntsReportExcel ({ commit }, payload) {
      delete payload.page
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/client_order_report',
          method: 'get',
          params: payload
        }).then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    ClientsOrderReportExcel ({ commit }, payload) {
      delete payload.page
      return new Promise((resolve, reject) => {
        request({
          url: '/excel/order_report',
          method: 'get',
          params: payload
        }).then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getClientReportAllList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const { page } = payload
        request({
          url: '/reports/client_order_report',
          methods: 'get',
          params: {
            page: page.current,
            limit: page.pageSize,
            from_date: payload.from_date,
            to_date: payload.to_date,
            from_time: payload.from_time,
            to_time: payload.to_time,
            sort_by: payload.sort_by,
            sort_type: payload.sort_type,
            customer_type_id: payload.customer_type_id,
            registration_source: payload.registration_source,
            search: payload.search
          }
        }).then(res => {
          page.total = parseInt(res.count)
          commit('GET_PAGINATIN_CLIENT_REPORT', page)
          resolve(res)
          console.log(res)
          commit('GET_CLIENT_ALL_LIST', res.reports)
        })
          .catch(error => {
            reject(error)
          })
      })
    },
    getClientItemTable ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const pagination = payload.page
        request({
          url: '/order',
          methods: 'get',
          params: {
            status_ids: payload.status_ids,
            customer_id: payload.customer_id,
            start_date: payload.start_date,
            end_date: payload.end_date,
            page: pagination.current,
            limit: pagination.pageSize
          }
        }).then(res => {
          resolve(res)
          pagination.total = parseInt(res.count)
          commit('GET_CLIENT_ORDER_LIST', res.orders)
          commit('PAGINATIONCLIENTITEM', pagination)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default clientReport
