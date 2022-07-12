
<template>
  <div></div>
</template>
<script>
import notification from 'ant-design-vue/es/notification'
export default {
  data () {
    return {
      keys: {},
    }
  },
  methods: {
    removeDataFromKeys (key) {
      delete this.keys[key]
    }
  },
  mounted () {
    // let _url, perace
    const removeKey = this.removeDataFromKeys

    this.$store.state.webSocket.socket.onmessage = (mes) => {
      try {
        const data = JSON.parse(mes.data)
        // console.log(data)
        if (data.id && data.name === 'order_report') this.keys[data.id] = data
        // console.log(this.keys)

        if (data.file_name && data.url) {
          console.log(data.url)
          this.keys[data.file_name] = { url: data.url, percent: 100 }
          this.$store.dispatch('buttonLoadingFunction', false) // remove from store
        }

        for (const key in this.keys) {
          const { percent, url } = this.keys[key]
          notification.open({
            key: key,
            duration: 0,
            message: 'Proggress',
            description: function (h) {
              return h('div', [
                h(
                  'a-progress',
                  {
                    attrs: {
                      percent: percent,
                      status: 'active',
                      type: 'line'
                    }
                  },
                  ['link name']
                ),
                percent === 100
                  ? h('a-button',
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
                            `${ url }`)
                          elm.setAttribute('download', '')
                          elm.click()
                          // eslint-disable-next-line no-undef
                          removeKey(key)
                          notification.close(key)
                        }
                      },
                    }, ['Скачать ']
                  )
                : ''
              ])
            },
            onClose: () => {
              removeKey(key)
            }
          })
        }

        // if (data.name === 'order_report') {
        //   perace = data.percent === (99 || 98) ? 100 : data.percent
        //   // eslint-disable-next-line no-constant-condition
        //   notification.open({
        //     key: this.notificationKey,
        //     duration: 0,
        //     message: 'Proggress',
        //     description: function (h) {
        //       return h('div', [
        //         h(
        //           'a-progress',
        //           {
        //             attrs: {
        //               percent: perace,
        //               status: 'active',
        //               type: 'line'
        //             }
        //           },
        //           ['link name']
        //         ),
        //         // eslint-disable-next-line no-constant-condition
        //         perace === 100 ? h('a-button',
        //           {
        //             props: {
        //               type: 'primary',
        //               id: 'websocket-reload-btn'
        //               // size: 'small',
        //             },
        //             on: {
        //               click: () => {
        //                 // console.log('element clicked', _url)
        //                 const elm = document.createElement('a')
        //                 elm.setAttribute(
        //                   'href',
        //                   `${ _url }`)
        //                 elm.setAttribute('download', '')
        //                 elm.click()
        //                 // eslint-disable-next-line no-undef
        //                 // notification.close(key)
        //               }
        //             },
        //           }, ['Скачать '],
        //           [
        //             h(
        //               'a',
        //               {
        //                 attrs: {
        //                   href: data.url,
        //                   download: 'download',
        //                   filName: ''
        //                 }
        //               }
        //             )
        //           ]
        //         ) : ''
        //       ])
        //     },
        //     onClose: (e) => e
        //   })
        // }
      } catch (e) {}
    }
  }
}
</script>
