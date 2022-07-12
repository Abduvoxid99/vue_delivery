import request from '@/utils/request'
// import moment from 'moment'

const headers = {
  'Content-Type': 'application/json'
}

// const shipperID = JSON.parse(localStorage.getItem('shipper_id'))

const cancelingReasons = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getCancelingReasons ({ commit }, { page = 1, limit = 10 }) {
      const shipperID = JSON.parse(localStorage.getItem('shipper_id'))

      return request({
        url: '/canceling_reason',
        headers: headers,
        params: {
          page,
          limit,
          shipper_id: shipperID
        }
      })
    },
    deleteCancelingReason ({ commit }, id) {
      return request({
        url: `/canceling_reason/${id}`,
        method: 'delete'
      })
    },
    createCancelingReason ({ commit }, data) {
      return request({
        url: '/canceling_reason',
        method: 'post',
        data
      })
    },
    updateCancelingReason ({ commit }, data) {
      console.log(data)
      return request({
        url: `/canceling_reason/${data.id}`,
        method: 'put',
        data: {
          text: data.text
        }
      })
    },
  }
}

export default cancelingReasons
