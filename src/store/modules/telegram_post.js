import request from '@/utils/request'
import notification from 'ant-design-vue/lib/notification'
const post = {
  state: {
    allPosts: [],
    pagination: {},
    postLoad: false,
  },
  getters: {
    paginationPosts: state => state.pagination,
    allPosts: state => state.allPosts,
    postLoad: state => state.postLoad,
  },
  mutations: {
    GET_POSTS: (state, payload) => {
      state.allPosts = payload
    },
    GET_POSTS_PAGINATION: (state, payload) => {
      state.pagination = payload
    },
    GET_POSTS_LOAD: (state, payload) => {
      state.postLoad = payload
    },
  },
  actions: {
    updateTelegramBase ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: '/telegram/refresh-db',
          method: 'post',
          data: data
        })
          .then(result => {
            resolve(result)
            notification.success({
              message: 'Telegram Bot успешно обновлен',
              description: '\n' + result.Message,
              duration: 5
            })
            console.log(result)
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            console.log('final')
          })
      })
    },
    updateTelegramImage ({ commit }, image) {
      return request({
        url: '/menu-image',
        method: 'put',
        data: { image }
      })
    },
    PostBot ({ commit }, data) {
      // const token = '1425186108:AAHKRlmlKXph5AIFgGsHtJ251VcOsW_Rvro'
      // const url = `https://api.telegram.org/bot${ token }/sendPhoto`
      // const data = {
      //   chat_id: '547156675',
      //   caption: payload.content,
      //   photo: payload.image,
      //   reply_markup: {
      //     inline_keyboard: [
      //       payload.buttons
      //     ]
      //   },
      //   parse_mode: 'HTML',
      // }
      return new Promise((resolve, reject) => {
        request({
          url: '/telegram',
          method: 'post',
          data: data
        })
          .then(result => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            console.log('final')
          })
      })
    },
    getPosts ({ commit }, page) {
      const { pagination } = page
      commit('GET_POSTS_LOAD', true)
      return new Promise((resolve, reject) => {
        request({
          url: '/telegram',
          params: { page: pagination.current, limit: pagination.pageSize, search: page.search, content_type: page.content_type },
        })
          .then(result => {
            console.log(result, page)
            // eslint-disable-next-line no-use-before-define
            const pagination = { ...pagination }
            pagination.total = parseInt(result.count)
            commit('GET_POSTS_PAGINATION', pagination)
            commit('GET_POSTS', result.telegram_posts)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('GET_POSTS_LOAD', false)
          })
      })
    },
  }
}
export default post
