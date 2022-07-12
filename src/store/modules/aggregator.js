import request from '@/utils/request'
// import moment from 'moment'

const headers = {
  'Content-Type': 'application/json'
}

const shipperID = JSON.parse(localStorage.getItem('shipper_id'))

const aggregator = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getAggregators ({ commit }, { page = 1, limit = 10, name = '' }) {
      // console.log(shipperId)
      return request({
        url: '/aggregator',
        headers: headers,
        params: {
          page,
          limit,
          name,
          shipper_id: shipperID
        }
        // params: { start_date: '2020-08-20 05:00:00', end_date: '2020-08-20 16:00:00' }
        // params: { start_date: date[0], end_date: date[1] }
      })
    },
    deleteAggregator ({ commit }, id) {
      return request({
        url: `/aggregator/${id}`,
        method: 'delete'
      })
    },
    createAggregator ({ commit }, data) {
      return request({
        url: '/aggregator',
        method: 'post',
        data: { ...data, shipper_id: shipperID }
      })
    },
    updateAggregator ({ commit }, data) {
      console.log(data)
      return request({
        url: `/aggregator/${data.id}`,
        method: 'put',
        data: { ...data, shipper_id: shipperID }
      })
    },
  }
}

export default aggregator
