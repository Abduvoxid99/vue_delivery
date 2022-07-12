import request from '@/utils/request'
// import notification from 'ant-design-vue/es/notification'
import { notification } from 'ant-design-vue'
const CourierTypes = {
  state: {
    courierTypeLIst: [],
    pagination: {},
    courieritem: null,
  },
  getters: {
    paginationCourierType: state => state.pagination,
    courierTypeLIst: state => state.courierTypeLIst,
    // couriersitemid: state => state.courieritem
  },
  mutations: {
    GET_COURIER_TYPE_LIST: (state, couriers) => {
      state.courierTypeLIst = couriers
    },
    GET_COURIER_TYPE_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    },
    GET_COURIER_ITEM: (state, payload) => {
      state.courieritem = payload
    }
  },
  actions: {
    getCourierTypesList: function ({ commit }, params) {
      let { page } = params
      if (!page) {
        page = { current: 1, pageSize: 10, total: null, search: '' }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/courier_type',
          method: 'get',
          params: {
            page: params.page.page,
            limit: params.page.limit,
            search: params.search === '' ? '' : params.search
          }
        })
          .then(result => {
            page.total = parseInt(result.count)
            commit('GET_COURIER_TYPE_LIST', result.courier_type)
            commit('GET_COURIER_TYPE_PAGINATION', page)
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    createCourierTypes ({ commit }, payload) {
      let { page } = payload
      if (!page) {
        page = { current: 1, pageSize: 10, total: null, search: '' }
      }
      return new Promise((resolve, reject) => {
        delete payload.this
        request({
          url: '/courier_type',
          method: 'post',
          data: payload
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getCourierTypeIdItem ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/courier_type/${id}`,
          method: 'get',
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })
    },
    updateCourireType ({ commit }, payload) {
      const { id, data } = payload
      delete data.id
      return new Promise((resolve, reject) => {
        request({
          url: `/courier_type/${id}`,
          method: 'put',
          data: data
        })
          .then(res => {
            resolve(res)
            notification.success({
              message: this.$t('courierTypeupdate'),
            })
          })
          .catch(err => {
            reject(err)
            console.log(err)
            notification.error({
              message: this.$t('courierTypeupdateerror'),
            })
          })
      })
    },
    RemoveTypeId ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/courier_type/${id}`,
          method: 'DELETE',
        })
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(error)
          })
      })
    },
  }
}
export default CourierTypes
