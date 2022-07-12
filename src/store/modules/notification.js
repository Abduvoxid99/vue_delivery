import request from '@/utils/request'

const notification = {
  actions: {
    getNotifications ({ commit }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: '/notifications-history',
          method: 'get',
          params
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
export default notification
