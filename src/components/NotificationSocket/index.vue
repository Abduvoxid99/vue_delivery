<template>
  <div>
    <Notification v-for='notif in notifs'></Notification>
  </div>
</template>

<script>
import Notification from './Notification'
import notification from 'ant-design-vue/lib/notification'
export default {
  components: {
    Notification
  },
  data () {
    return {
      notifs: []
    }
  },
  name: 'index',
  mounted () {
    let _url, perace
    this.$store.state.webSocket.socket.onmessage = (mes) => {
      try {
        const data = JSON.parse(mes.data)
        console.log(data)
        this.notificationKey = data.id
        // console.log(data)
        if (data.file_name && data.url) {
          console.log(data.url)
          _url = data.url
        }
        if (data.name === 'order_report') {
          perace = data.percent === 99 ? 100 : data.percent
          notification.open({
            key: this.notificationKey,
            duration: 0,
            message: 'Proggress',
            description: function (h) {
              return h('div', [
                h(
                  'a-progress',
                  {
                    attrs: {
                      percent: perace,
                      status: 'active',
                      type: 'line'
                    }
                  },
                  ['link name']
                ),
                perace === 100 ? h('a-button',
                  {
                    props: {
                      type: 'primary',
                      id: 'websocket-reload-btn'
                      // size: 'small',
                    },
                    on: {
                      click: () => {
                        // console.log('element clicked', _url)
                        const elm = document.createElement('a')
                        elm.setAttribute(
                          'href',
                          `${ _url }`)
                        elm.setAttribute('download', '')
                        elm.click()
                      }
                    },
                  }, ['ok'],
                  [
                    h(
                      'a',
                      {
                        attrs: {
                          href: data.url,
                          download: 'download'
                        }
                      }
                    )
                  ]
                ) : ''
              ])
            },
          })
        }
      } catch (e) {}
    }
  }
}
</script>
