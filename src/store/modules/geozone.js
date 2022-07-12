import request from '@/utils/request'
export default {
  state: {
    data: null,
    loading: false,
    pagination: {},
    freeGeozoneData: null,
    freeGeozoneLoading: false,
    freeGeozonePagination: {}
  },
  getters: {
    allGeozone: state => state.data,
    geozoneLoad: state => state.loading,
    geozonePagination: state => state.pagination,
    allFreeGeozone: state => state.freeGeozoneData,
    freeGeozoneLoad: state => state.freeGeozoneLoading,
    freeGeozonePagination: state => state.freeGeozonePagination
  },
  mutations: {
    SET_GEOZONE: (state, payload) => {
      state.data = payload
    },
    SET_GEOZONE_LOAD: (state, payload) => {
      state.loading = payload
    },
    SET_GEOZONE_PAGINATION: (state, payload) => {
      state.pagination = payload
    },
    SET_FREE_GEOZONE: (state, payload) => {
      state.freeGeozoneData = payload
    },
    SET_FREE_GEOZONE_LOAD: (state, payload) => {
      state.freeGeozoneLoading = payload
    },
    SET_FREE_GEOZONE_PAGINATION: (state, payload) => {
      state.freeGeozonePagination = payload
    }
  },
  actions: {
    getGeozoneList ({ commit }, params) {
      commit('SET_GEOZONE_LOAD', true)
      const { pagination } = params
      return new Promise((resolve, reject) => {
        request({
          url: '/geozones',
          params: {
            page: pagination.current,
            limit: pagination.pageSize
          }
        })
          .then(result => {
            console.log(result)
            pagination.total = parseInt(result.count)
            console.log(pagination)
            commit('SET_GEOZONE_PAGINATION', pagination)
            commit('SET_GEOZONE', result.geozones)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('SET_GEOZONE_LOAD', false)
          })
      })
    },
    postGeozone ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/geozones`,
          data: payload,
          method: 'post',
        })
          .then(result => {
            if (result) {
              resolve(result.id)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateGeozone ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/geozones/${payload.id}`,
          data: payload.data,
          method: 'put',
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteGeozone ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/geozones/${id}`,
          method: 'delete',
        })
          .then(result => {
            if (result) {
              resolve(result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getGeozoneById ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/geozones/${id}`,
          method: 'get'
        })
          .then(result => {
            if (result) {
              resolve(result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
// ============================================================

    getFreeGeozoneList ({ commit }, params) {
      commit('SET_FREE_GEOZONE_LOAD', true)
      const { pagination } = params
      return new Promise((resolve, reject) => {
        request({
          url: '/free_geozones',
          params: {
            page: pagination.current,
            limit: pagination.pageSize
          }
        })
          .then(result => {
            console.log(result)
            pagination.total = parseInt(result.count)
            console.log(pagination)
            commit('SET_FREE_GEOZONE_PAGINATION', pagination)
            commit('SET_FREE_GEOZONE', result.geozones)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('SET_FREE_GEOZONE_LOAD', false)
          })
      })
    },
    postFreeGeozone ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/free_geozones`,
          data: payload,
          method: 'post',
        })
          .then(result => {
            if (result) {
              resolve(result.id)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateFreeGeozone ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/free_geozones/${payload.id}`,
          data: payload.data,
          method: 'put',
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteFreeGeozone ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/free_geozones/${id}`,
          method: 'delete',
        })
          .then(result => {
            if (result) {
              resolve(result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getFreeGeozoneById ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/free_geozones/${id}`,
          method: 'get'
        })
          .then(result => {
            if (result) {
              resolve(result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}
