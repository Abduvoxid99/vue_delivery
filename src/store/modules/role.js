import request from '@/utils/request'

const roles = {
  state: {
    allRoles: [],
    pagination: {},
    rolesLoad: false,
    allActionList: [],
    role_permissions: []
  },
  getters: {
    paginationRole: state => state.pagination,
    allRoles: state => state.allRoles,
    loadRole: state => state.rolesLoad,
    allActions: state => state.allActionList,
    rolePermissions: state => state.role_permissions
  },
  mutations: {
    GET_ROLES: (state, payload) => {
      state.allRoles = payload
    },
    GET_ROLE_PERMISSION: (state, payload) => {
      state.rolePermissions = payload
    },
    GET_ROLES_PAGINATION: (state, payload) => {
      state.pagination = payload
    },
    GET_ROLES_LOAD: (state, payload) => {
      state.rolesLoad = payload
    },
    GET_ALL_ACTIONS (state, payload) {
      state.allActionList = payload
    }
  },
  actions: {
    getRoles ({ commit }, page) {
      commit('GET_ROLES_LOAD', true)
      return new Promise((resolve, reject) => {
        request({
          url: '/user-roles',
          params: { page: page.current, limit: page.pageSize, search: page.search }
        })
          .then(result => {
            console.log(result, page)
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_ROLES_PAGINATION', pagination)
            commit('GET_ROLES', result.user_roles)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_ROLES_LOAD', false)
          })
      })
    },
    getAllActionList ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/permissions',
          params: {
            user_type_id: '2a1efd4a-d527-4cc2-adfa-a7546021f0f6',
            limit: 1000,
            page: 1
          }
        })
          .then(result => {
            const payload = result.permissions
            console.log(payload)
            var actions = []
            for (var i = 0; i < payload.length; i++) {
              for (var j = 0; j < payload[i].actions.length; j++) {
                // console.log({
                //   name: payload[i].name + '/' + payload[i].actions[j].name,
                //   key: payload[i].actions[j].key,
                //   id: payload[i].actions[j].id,
                //   permession_id: payload[i].id
                // })
                actions.push({
                  title: payload[i].name + '/' + payload[i].actions[j].name,
                  value: payload[i].actions[j].key,
                  key: payload[i].actions[j].id,
                  permession_id: payload[i].id,
                  permession_name: payload[i].name
                })
              }
            }
            commit('GET_ALL_ACTIONS', actions)
            console.log(actions)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    postRole ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `/user-roles`,
          data: data,
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
    postPermission ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `/user-roles/${data.path}/permissions`,
          method: 'post',
          data: data.data
        })
          .then(result => {
            resolve()
            console.log('Completed')
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getRolePermissionById ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `/user-roles/${id}/permissions`
        })
          .then(result => {
            resolve(result)
            commit('GET_ROLE_PERMISSION', result.permissions)
            // console.log('Completed')
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateRole ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `/user-roles/${data.path}`,
          data: data.data,
          method: 'put',
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
    deleteRole ({ commit }, path) {
      return new Promise((resolve, reject) => {
        request({
          url: `/user-roles/${path}`,
          method: 'delete',
        })
          .then(result => {
            if (result) {
              console.log('Deleted')
              resolve()
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}
export default roles
