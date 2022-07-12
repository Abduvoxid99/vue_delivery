import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const systemUsers = {
    state: {
      systemUsers: [],
      pagination: {}
    },
    getters: {
      paginationSystemUsers: state => state.pagination,
      systemUsers: state => state.systemUsers
    },
    mutations: {
      GET_SYSTEM_USERS: (state, systemUsers) => {
          state.systemUsers = systemUsers
      },
      GET_SYSTEM_USERS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getSystemUsers ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null, search: '' }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/shipper-users',
            headers: headers,
            params: { page: page.current, limit: page.pageSize, search: page.search }
        })
          .then(result => {
            console.log(result)
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_SYSTEM_USERS_PAGINATION', pagination)
          commit('GET_SYSTEM_USERS', result.shipper_users)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
      getSystemUsersList ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: '/shipper-users',
            method: 'get',
            params: {
              page: 1,
              limit: 1000
            }
          })
            .then(result => {
              resolve(result.shipper_users)
            })
            .catch(error => {
              reject(error)
            })
        })
      },
  }
}
  export default systemUsers
