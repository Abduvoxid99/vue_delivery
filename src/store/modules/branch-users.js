import request from '@/utils/request'

const brancheUsers = {
  state: {
    branch_users: [],
    pagination: {},
    branchUserLoad: false
  },
  getters: {
    paginationBranchUser: state => state.pagination,
    allBranchUser: state => state.branch_users,
    loadBranchUser: state => state.branchUserLoad,
  },
  mutations: {
    GET_BRANCH_USER: (state, payload) => {
      state.branch_users = payload
    },
    GET_BRANCH_USER_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    },
    GET_BRANCH_USER_LOAD: (state, payload) => {
      state.branchUserLoad = payload
    },
  },
  actions: {
    getBranchUsers ({ commit }, page) {
      const { pagination } = page
      commit('GET_BRANCH_USER_LOAD', true)
      return new Promise((resolve, reject) => {
        request({
          url: '/branch-users',
          method: 'get',
          params: { page: pagination.current, limit: pagination.pageSize, branch_id: page.branch_id, search: page.search }
        })
          .then(result => {
            console.log(result)
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_BRANCH_USER_PAGINATION', pagination)
            commit('GET_BRANCH_USER', result.branch_users)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_BRANCH_USER_LOAD', false)
          })
      })
    },
    postBranchUsers ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/branch-users',
          method: 'post',
          data: payload
        })
          .then(result => {
            console.log(result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateBranchUsers ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/branch-users/${payload.id}`,
          method: 'put',
          data: payload.data
        })
          .then(result => {
            console.log(result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteBranchUsers ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `/branch-users/${payload}`,
          method: 'delete'
        })
          .then(result => {
            console.log(result)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}
export default brancheUsers
