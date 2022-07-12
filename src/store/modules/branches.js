import request from '@/utils/request'
import notification from 'ant-design-vue/lib/notification'

const branches = {
    state: {
      branches: [],
      nearest: [],
      pagination: {},
      selectedBranch: {},
      allBranches: [],
      branchByLocation: {}
    },
    getters: {
      pagination_branches: state => state.pagination,
      branches: state => state.branches,
      allBranches: state => state.allBranches,
      nearest: state => state.nearest,
      selected_branch: state => state.selectedBranch,
      branchByLocation: state => state.branchByLocation
    },
    mutations: {
      GET_BRANCHES: (state, branches) => {
          state.branches = branches
      },
      GET_NEAREST_BR: (state, nearest) => {
          state.nearest = nearest
      },
      GET_ALL_BRANCHES: (state, allBranches) => {
          state.allBranches = allBranches
      },
      GET_SELECTED_BRANCH: (state, selectedBranch) => {
        state.selectedBranch = selectedBranch
      },
      GET_BRANCHES_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      },
      GET_BRANCHES_BY_LOCATION: (state, payload) => {
        state.branchByLocation = payload
      }
    },
    actions: {
      getBranches ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 1000, total: null }
        }
        return new Promise((resolve, reject) => {
          request({
              url: '/branches',
              method: 'get',
              params: { page: page.current, limit: page.pageSize }
          })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_BRANCHES_PAGINATION', pagination)
            commit('GET_BRANCHES', result.branches)
            commit('GET_SELECTED_BRANCH', {})
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
        })
      },
      getBranchesList ({ commit }, params) {
        return new Promise((resolve, reject) => {
          request({
              url: '/branches',
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
      getAllBranches ({ commit }, page) {
        return new Promise((resolve, reject) => {
          request({
              url: '/branches',
              method: 'get',
              params: { page: 1, limit: 100 }
          })
          .then(result => {
            commit('GET_ALL_BRANCHES', result.branches)
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
        })
    },
      getSelectedBranch ({ commit }, id) {
        return new Promise((resolve, reject) => {
            request({
                url: '/branches/' + id,
                method: 'get'
            })
            .then(result => {
            commit('GET_SELECTED_BRANCH', result)
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
        })
    },
      getBranchByLocation ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: `/nearest-branch?long=${ payload[1] }&lat=${ payload[0] }`,
            method: 'get'
          })
            .then(result => {
              if (result && result.branches.length > 0) {
                const branch = result.branches[0]
                const d = {
                  text: branch.name,
                  phone: branch.phone,
                  value: branch.id,
                  address: branch.address,
                  real_time_orders_amount: branch.real_time_orders_amount
                }
                resolve(result)
                commit('GET_BRANCHES_BY_LOCATION', d)
                commit('GET_NEAREST_BR', result.branches)
              }
            })
            .catch(error => {
              reject(error)
            })
        })
      },
      saveBranch ({ commit }, data) {
        return new Promise((resolve, reject) => {
          request({
            url: '/branches',
            method: 'POST',
            data: data
          })
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              notification.error({
                message: 'Ошибка сети или сервер не работает',
                description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
                duration: 5
              })
              reject(error)
            })
        })
      },
      updateBranch ({ commit }, data) {
        return new Promise((resolve, reject) => {
          request({
            url: `/branches/${data.id}`,
            method: 'PUT',
            data: { ...data }
          })
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              notification.error({
                message: 'Ошибка сети или сервер не работает',
                description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
                duration: 5
              })
              reject(error)
            })
        })
      },
      getBranchById ({ commit }, id) {
        return new Promise((resolve, reject) => {
          request({
            url: `/branches/${id}`
          })
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              notification.error({
                message: 'Ошибка сети или сервер не работает',
                description: 'Пожалуйста, проверьте свою сеть или обновить страницу' + '\n' + error.message,
                duration: 5
              })
              reject(error)
            })
        })
      }
    }
}
  export default branches
