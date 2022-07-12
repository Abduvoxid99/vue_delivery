import request from '@/utils/request'
export default {
  state: {
    data: null,
    loading: false,
  },
  getters: {
    allGuide: state => state.data,
    guideLoad: state => state.loading,
  },
  mutations: {
    GET_GUIDE: (state, payload) => {
      state.data = payload
    },
    GET_GUIDE_LOAD: (state, payload) => {
      state.loading = payload
    },
  },
  actions: {
    getGuide ({ commit }, page) {
      commit('GET_GUIDE_LOAD', true)
      return new Promise((resolve, reject) => {
        request({
          url: '/guides',
        })
          .then(result => {
            console.log(result, page)
            commit('GET_GUIDE', result.guides)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_GUIDE_LOAD', false)
          })
      })
    },
    getInstruction ({ commit }, page) {
      return new Promise((resolve, reject) => {
        request({
          url: `/guides/${page.guid}/instruction/${page.insid}`,
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}
