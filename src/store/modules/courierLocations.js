import request from '@/utils/request'

const courierLocations = {
  state: {
    courierLocations: null,
  },
  getters: {
      courierLocations: state => state.courierLocations
  },
  mutations: {
    GET_COURIER_LOCATIONS: (state, courierLocations) => {
        state.courierLocations = courierLocations
    }
  },
  actions: {
    getCourierLocations ({ commit }, payload) {
      // console.log('payload', payload)
      // console.log('branchId', branchId)
      // if (!branchId) {
      //   return new Promise((resolve, reject) => {
      //     request({
      //       url: '/tracking/couriers-last-location',
      //       params: {
      //         is_online: payload.is_online ?? ''
      //
      //       }
      //     })
      //     .then(result => {
      //       console.log('online curer=>', result)
      //       commit('GET_COURIER_LOCATIONS', result.courier_trackings)
      //       resolve(result)
      //     })
      //     .catch(error => {
      //       reject(error)
      //     })
      //   })
      // }
        return new Promise((resolve, reject) => {
          request({
            url: '/tracking/couriers-last-location',
            params: payload
          })
          .then(result => {
            console.log('change ===>>', result)
            commit('GET_COURIER_LOCATIONS', result.courier_trackings)
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
        })
    }
  }
}
  export default courierLocations
