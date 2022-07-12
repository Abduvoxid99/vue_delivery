import request from '@/utils/request'
export default {
  state: {
    file: ''
  },
  getters: {
    getFile: state => state.file
  },
  mutations: {
    SET_IMAGE (state, payload) {
      state.file = payload
    }
  },
  actions: {
    upload ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/upload',
          data: payload,
          method: 'post',
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    uploadVideo ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/upload-video',
          data: payload,
          method: 'post',
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    uploadGif ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/upload-gif',
          data: payload,
          method: 'post',
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    uploadExcel ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/menu/import-from-excel',
          data: payload,
          method: 'post',
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
