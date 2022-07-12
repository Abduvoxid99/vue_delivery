<template>
  <pro-layout
    title="Delever"
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    defaultCollapsed="true"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :logo="logoRender"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <template v-slot:rightContentRender>
      <right-content :top-menu="settings.layout === 'topmenu'" :theme="settings.theme" />
    </template>
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <router-view />
  </pro-layout>
</template>

<script>
import { SettingDrawer } from '@ant-design-vue/pro-layout'
import { i18nRender } from '@/locales'
import { mapState, mapActions } from 'vuex'
import { SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import LogoSvg from '../assets/logo_blue_white.svg?inline'
import moment from 'moment'

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter
  },
  data () {
    return {
      menus: [],
      collapsed: true,
      intervalNew: null,
      settings: {
        layout: 'sidemenu', // 'sidemenu', 'topmenu'
        contentWidth: false,
        theme: 'dark',
        primaryColor: '#1890ff',
        fixedHeader: true,
        fixSiderbar: true,
        colorWeak: false,
        hideHintAlert: false,
        hideCopyButton: false
      },
      page: { current: 1, pageSize: 10, total: null },
      query: {},
      isMobile: false,
      path: null
    }
  },
  computed: {
    ...mapState({
      mainMenu: state => state.permission.addRouters
    })
  },
  created () {
    this.connectSocket()
    const routes = this.mainMenu.find(item => item.path === '/')
    this.path = routes.redirect
    this.menus = (routes && routes.children) || []
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },
  mounted () {
    // this.intervalNew = setInterval(() => {
    //   if (!window.localStorage.getItem('token')) {
    //     clearInterval(this.intervalNew)
    //   } else {
    //     this.getOrderByCountNotifStatuses({
    //       ids: '986a0d09-7b4d-4ca9-8567-aa1c6d770505',
    //       start: moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00',
    //       end: moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
    //     })
    //   }
    // }, 5000)
    // console.log()
    // const userAgent = navigator.userAgent
    // if (userAgent.indexOf('Edge') > -1) {
    //   this.$nextTick(() => {
    //     this.collapsed = true
    //     setTimeout(() => {
    //       this.collapsed = true
    //     }, 16)
    //   })
    // }
  },
  methods: {
    ...mapActions(['connectSocket']),
    moment,
    i18nRender,
    ...mapActions(['getOrderByCountNotifStatuses']),
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.settings.contentWidth = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
    },
    handleSettingChange ({ type, value }) {
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value === 'Fixed'
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = false
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = true
          }
          break
      }
    },
    logoRender () {
      return <LogoSvg />
    }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
