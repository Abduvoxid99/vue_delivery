import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { i18nRender } from '@/locales/index'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import Notification from '../../views/GlobalNotificationSocket/NotificationSocket'

const token = storage.get(ACCESS_TOKEN)

const webSocket = {
  state: {
    socket: null
  },
  getters: {
    socket: state => state.socket
  },
  mutations: {
    SET_SOCKET: (state, payload) => {
      state.socket = payload
    }
  },
  actions: {
    connectSocket ({ commit, disptach }) {
      var ws = new WebSocket(`${process.env.VUE_APP_SOCKET_URL}?token=` + token)
      commit('SET_SOCKET', ws)

      ws.onopen = function () {
        console.log('Connected to websocket')
        notification.info({
          message: i18nRender('connected.to.websocket')
        })
        // subscribe to some channels
        ws.send(JSON.stringify({
            //  .... some message the I must send when I connect ....
        }))
      }

      ws.onmessage = function (e) {

        // try {
        //   console.log('MESSAGE: ', JSON.parse(e.data))
        // } catch (e) {}
      }

      ws.onclose = function (e) {
        console.log(`Socket is closed.`, e.reason)
        // notification.warning({
        //   message: `Socket is closed!`,
        //   description: 'You shuold refresh the page. To do this, please click the refresh button'
        // })
        // const key = `open${Date.now()}`
        notification.open({
          duration: 0,
          message: i18nRender('websocket.is.closed'),
          description: i18nRender('socket.close.message'),
          btn: h => {
            return h(
              'a-button',
              {
                props: {
                  type: 'primary',
                  id: 'websocket-reload-btn'
                  // size: 'small',
                },
                on: {
                  click: () => window.location.reload(),
                },
              },
              i18nRender('refresh'),
            )
          },
          closeIcon: '',
          onClose: () => {
            window.location.reload()
          },
          // key,
        })
      }

      ws.onerror = function (err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket')
        notification.error({
          message: i18nRender('socket.encountered.error'),
          description: err.message
        })
        ws.close()
      }
    },
  }
}
export default webSocket
