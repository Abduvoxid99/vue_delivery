<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" :src="require('../../assets/logo_blue.png')" class="antd-pro-global-header-index-avatar" />
      <span style="margin-right: 10px">{{ currentUser.name }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="statistics" @click="handleToReports">
          <a-icon type="line-chart" />
          {{ $t('statistics') }}
        </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="setting" />
          {{ $t('personal_settings') }}
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          {{ $t('logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <!-- <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" /> -->
  </span>
<!--  <WebsocketGlobal/>-->
</template>

<script>
import { Modal } from 'ant-design-vue'
import { mapActions, mapGetters } from 'vuex'
// import Socket from '../../store/modules/socket'
// import WebsocketGlobal from '../WebSocketDowlondsOrderReport/WebSocketNotificationGlobal'

export default {
  // watch: {
  //   'WebSocketDowlonds': (value) => {
  //     console.log('value==>>socket', value)
  //   }
  // },
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handleToCenter () {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings () {
      this.$router.push({ path: '/account' })
    },
    handleToReports () {
      this.$router.push({ name: 'PersonalReport' })
      console.log('Custom Report')
    },
    handleLogout (e) {
      Modal.confirm({
        title: 'Уведомление',
        content: 'Вы на самом деле хотите покинуть сайт?',
        onOk: () => {
          this.Logout()
          this.$router.push('/user/login')
        },
        onCancel () {}
      })
    }
  },
  mounted () {
    // console.log('import socket=>.', Socket.actions.connectSocket())
  },
  computed: {
    ...mapGetters(['socket'])
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
