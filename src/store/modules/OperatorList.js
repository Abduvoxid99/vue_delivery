import request from '@/utils/request'
const OperatorList = {
  state: {
    OpratorListNames: [],
    OperatorListAll: [],
    OperatorItemListReport: [],
    OpratorPaginaton: {}
  },
  getters: {
    OpratorPaginaton: state => state.OpratorPaginaton,
    OperatorItemListReport: state => state.OperatorItemListReport,
    OpratorListNames: state => state.OpratorListNames,
    OperatorListAll: state => state.OperatorListAll
  },
  mutations: {
    GET_OPRATOR_LIST_NAME: (state, payload) => {
      state.OpratorListNames = payload
    },
    GET_OPRATOR_LIST_ALL: (state, payload) => {
      state.OperatorListAll = payload
    },
    GET_OPERATOR_ITEM_ORDER_LIST: (state, payload) => {
      state.OperatorItemListReport = payload
    },
    OPERATOR_PAGINAtION: (state, payload) => {
     state.OpratorPaginaton = payload
}
  },
  actions: {
    OpratorListName ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/shipper-users',
          methods: 'get',
          params: {
            page: 1,
            limit: 1000
          }
        })
          .then(res => {
            commit('GET_OPRATOR_LIST_NAME', res.shipper_users)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    GetAllOpratorListName ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/reports/order_report',
          methods: 'get',
          params: {
            from_date: payload.from_date,
            to_date: payload.to_date,
            from_time: payload.from_time,
            to_time: payload.to_time,
            operator_id: payload.operator_id ? payload.operator_id : JSON.parse(localStorage.getItem('user_id')),
            sort_by: payload.sort_by,
            sort_type: payload.sort_type
          }
        })
          .then(res => {
            resolve(res)
            commit('GET_OPRATOR_LIST_ALL', res.reports)
          })
          .catch(error => {
            reject(error)
            console.log(error)
          })
      })
    },
    ReportOperatorExcel ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: 'excel/main_order_report',
          methods: 'get',
          params: {
            from_date: payload.from_date,
            to_date: payload.to_date,
            from_time: payload.from_time,
            to_time: payload.to_time,
            operator_id: payload.operator_id ? payload.operator_id : JSON.parse(localStorage.getItem('user_id')),
            sort_by: payload.sort_by,
            sort_type: payload.sort_type
          }
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getOperatorItemTable ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const pagination = { ...payload.page }
        request({
          url: '/order',
          methods: 'get',
          params: {
            status_ids: payload.status_ids,
            customer_id: payload.customer_id,
            start_date: payload.start_date,
            end_date: payload.end_date,
            page: pagination.current,
            limit: pagination.pageSize,
            operator_id: payload.operator_id,
            delivery_type: payload.delivery_type,
            aggregator_id: payload.aggregator_id,
            is_reissued: payload.is_reissued
          }
        }).then(res => {
          pagination.total = parseInt(res.count)
          resolve(res)
          commit('GET_OPERATOR_ITEM_ORDER_LIST', res.orders)
          console.log(pagination)
          commit('OPERATOR_PAGINAtION', pagination)
        }).catch(error => {
          reject(error)
        })
      })
    }
      }
}
export default OperatorList
