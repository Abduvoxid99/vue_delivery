import request from '@/utils/request'
// import moment from 'moment'

const headers = {
  'Content-Type': 'application/json'
}

// const shipperID = JSON.parse(localStorage.getItem('shipper_id'))

const finishingReasons = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getFinishingReasons ({ commit }, { page = 1, limit = 10 }) {
      const shipperID = JSON.parse(localStorage.getItem('shipper_id'))

      return request({
        url: '/finishing_reason',
        headers: headers,
        params: {
          page,
          limit,
          shipper_id: shipperID
        }
      })
    },
    deleteFinishingReason ({ commit }, id) {
      return request({
        url: `/finishing_reason/${id}`,
        method: 'delete'
      })
    },
    createFinishingReason ({ commit }, data) {
      return request({
        url: '/finishing_reason',
        method: 'post',
        data
      })
    },
    updateFinishingReason ({ commit }, data) {
      console.log(data)
      return request({
        url: `/finishing_reason/${data.id}`,
        method: 'put',
        data: {
          text: data.text
        }
      })
    },
  }
}

export default finishingReasons
