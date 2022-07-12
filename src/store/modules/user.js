import storage from 'store'
import { login } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import request from '@/utils/request'
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    permissions: []
  },
  getters: {
    userPermissions: state => state.permissions
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_PERMISSIONS: (state, payload) => {
      state.permissions = payload
    }
  },
  actions: {
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          // console.log(response)
          const token = response.access_token
          storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
          storage.set('roleID', response.user_role.id)
          storage.set('user_id', response.id)
          storage.set('shipper_id', response.user_role.shipper_id)
          commit('SET_TOKEN', token)
          window.localStorage.setItem('username', response.name)
          window.localStorage.setItem('token', token)
          resolve(response)
          // setTimeout(function () { resolve() }, 1000)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetInfo ({ commit }, payload) {
      // console.log(payload)
      return new Promise((resolve, reject) => {
        var result = {}
        var roleObj = {}
        result = {
          'id': '4291d7da9005377ec9aec4a71ea837f',
          'name': 'Dell',
          'username': 'admin',
          'password': '',
          'avatar': '/avatar2.jpg',
          'status': 1,
          'telephone': '',
          'lastLoginIp': '27.154.74.117',
          'lastLoginTime': 1534837621348,
          'creatorId': 'admin',
          'createTime': 1497160610259,
          'merchantCode': 'TLif2btpzg079h15bk',
          'deleted': 0,
          'roleId': 'admin',
          'role': {
            'id': 'admin',
            'status': 1,
            'creatorId': 'system',
            'createTime': 1497160610259,
            'deleted': 0,
            'permissions': []
          }
        }
        roleObj = {
          'id': 'admin',
          'status': 1,
          'creatorId': 'system',
          'createTime': 1497160610259,
          'deleted': 0,
          'permissions': []
        }
        // if (storage.get('user_role_id') === '96d52342-e4b6-4c15-93f9-39a3949cee91') {
        //   console.log('admin role')
        //   roleObj = {
        //     'id': 'admin',
        //     'status': 1,
        //     'creatorId': 'system',
        //     'createTime': 1497160610259,
        //     'deleted': 0,
        //     'permissions': [
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'dashboard',
        //       'permissionName': '仪表盘',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     }, {
        //       'roleId': 'admin',
        //       'permissionId': 'orders',
        //       'permissionName': '异常页面权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     }, {
        //       'roleId': 'admin',
        //       'permissionId': 'catalog',
        //       'permissionName': '结果权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     }, {
        //       'roleId': 'admin',
        //       'permissionId': 'categories',
        //       'permissionName': '详细页权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     }, {
        //       'roleId': 'admin',
        //       'permissionId': 'products',
        //       'permissionName': '表格权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"import","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'import',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     }, {
        //       'roleId': 'admin',
        //       'permissionId': 'branches',
        //       'permissionName': '表单权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     }, {
        //       'roleId': 'admin',
        //       'permissionId': 'couriers',
        //       'permissionName': '订单管理',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     }, {
        //       'roleId': 'admin',
        //       'permissionId': 'settings',
        //       'permissionName': '权限管理',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     }]
        //   }
        // }
        //
        // if (storage.get('user_role_id') === 'd63059f7-ad9b-4bcd-8d88-1a386c9d9468') {
        //   // console.log('shipper role')
        //   roleObj = {
        //     'id': 'admin',
        //     'status': 1,
        //     'creatorId': 'system',
        //     'createTime': 1497160610259,
        //     'deleted': 0,
        //     'permissions': [
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'dashboard',
        //       'permissionName': '仪表盘',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [
        //         {
        //           'action': 'add',
        //           'defaultCheck': false
        //         },
        //         {
        //           'action': 'query',
        //           'defaultCheck': false
        //         },
        //         {
        //           'action': 'get',
        //           'defaultCheck': false
        //         },
        //         {
        //           'action': 'update',
        //           'defaultCheck': false
        //         },
        //         {
        //           'action': 'delete',
        //           'defaultCheck': false
        //         }
        //       ],
        //       'actionList': null,
        //       'dataAccess': null
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'operator-report',
        //       'permissionName': '异常页面权限'
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'shipper-report',
        //       'permissionName': '异常页面权限'
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'branch-report',
        //       'permissionName': '异常页面权限'
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'system-users',
        //       'permissionName': '异常页面权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     },
        //       {
        //         'roleId': 'admin',
        //         'permissionId': 'roles',
        //         'permissionName': '异常页面权限',
        //         'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //         'actionEntitySet': [{
        //           'action': 'add',
        //           'defaultCheck': false
        //         }, {
        //           'action': 'query',
        //           'defaultCheck': false
        //         }, {
        //           'action': 'get',
        //           'defaultCheck': false
        //         }, {
        //           'action': 'update',
        //           'defaultCheck': false
        //         }, {
        //           'action': 'delete',
        //           'defaultCheck': false
        //         }],
        //         'actionList': null,
        //         'dataAccess': null
        //       },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'orders',
        //       'permissionName': '异常页面权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       },
        //         {
        //         'action': 'get',
        //         'defaultCheck': false
        //       },
        //         {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'catalog',
        //       'permissionName': '结果权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'categories',
        //       'permissionName': '详细页权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'products',
        //       'permissionName': '表格权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"import","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'import',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'branches',
        //       'permissionName': '表单权限',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'couriers',
        //       'permissionName': '订单管理',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'reports',
        //       'permissionName': '订单管理',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"query","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'query',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     },
        //       {
        //       'roleId': 'admin',
        //       'permissionId': 'settings',
        //       'permissionName': '权限管理',
        //       'actions': '[{"action":"add","defaultCheck":false},{"action":"get","defaultCheck":false},{"action":"update","defaultCheck":false},{"action":"delete","defaultCheck":false}]',
        //       'actionEntitySet': [{
        //         'action': 'add',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'get',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'update',
        //         'defaultCheck': false
        //       }, {
        //         'action': 'delete',
        //         'defaultCheck': false
        //       }],
        //       'actionList': null,
        //       'dataAccess': null
        //     }]
        //   }
        // }
        if (payload) {
          roleObj.permissions = payload.map(access => {
            return {
              permissionId: access.key,
              permissionName: access.name,
              actions: access.actions.map(e => {
                return {
                  action: e.key,
                  defaultCheck: false
                }
              }),
              actionEntitySet: access.actions.map(e => {
                return {
                  action: e.key,
                  defaultCheck: false
                }
              })
            }
          })
        }
        result.role = roleObj
        if (result.role && result.role.permissions.length > 0) {
          const role = result.role
          role.permissions = result.role.permissions
          role.permissions.map(per => {
            if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
              const action = per.actionEntitySet.map(action => { return action.action })
              per.actionList = action
            }
          })
          role.permissionList = role.permissions.map(permission => { return permission.permissionId })
          commit('SET_ROLES', result.role)
          commit('SET_INFO', result)
        }
        // debugger
        commit('SET_NAME', { name: result.name, welcome: welcome() })
        commit('SET_AVATAR', result.avatar)
        resolve(result)
    })
  },
    getUserPermission ({ commit }) {
      return new Promise((resolve, reject) => {
        const roleId = JSON.parse(localStorage.getItem('roleID'))
        console.log('ROLE', roleId)
        request({
          url: `/user-roles/${roleId}/permissions`
        })
          .then(result => {
            resolve(result)
            commit('SET_PERMISSIONS', result.permissions)
            // console.log('Completed')
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    Logout ({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      storage.remove(ACCESS_TOKEN)
      window.localStorage.removeItem('username')
      window.localStorage.removeItem('roleID')
      window.localStorage.removeItem('permissions')
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('crm')
    }

  }
}

export default user
