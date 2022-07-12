<template>
  <div :class="wrpCls">
<!--    <h3 class="time">-->
<!--      <a-icon style="font-size: 20px; margin-right: 7px" type="clock-circle" /> {{ time }}-->
<!--    </h3>-->
    <notice-icon style="cursor: pointer"/>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
    <Notification />
  </div>
</template>

<script>
// import storage from 'store'
import AvatarDropdown from './AvatarDropdown'
import Notification from '@/views/GlobalNotificationSocket/NotificationSocket'
// import request from '@/utils/request'
// import SelectLang from '@/components/SelectLang'
import NoticeIcon from '../NoticeIcon'
import moment from 'moment'
export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    Notification,
    // SelectLang,
    NoticeIcon
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {},
      time: null
    }
  },
  created () {
    setInterval(() => {
      this.getTime()
    }, 1000)
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.topMenu && this.isMobile) && this.theme || 'light'}`]: true
      }
    }
  },
  methods: {
    getTime () {
      const today = new Date()
      this.time = moment(today).format('HH:mm:ss || DD-MM-YYYY')
    }
  },
  mounted () {
    const userId = JSON.parse(localStorage.getItem('user_id'))
    // console.log(userId)
    if (userId) {
      this.currentUser = {
        name: localStorage.getItem('username')
      }
      // request({
      //   url: `/shipper-users/${userId}`
      // }).then(res => {
      //   console.log(res)
      //
      //   this.currentUser = {
      //     name: res.name
      //   }
      // }).catch(err => {
      //   console.log(err)
      //   this.currentUser = {
      //     name: 'Admin'
      //   }
      // })
    } else {
      this.currentUser = {
        name: 'Admin'
      }
    }
  }
}
</script>
<style>
  .time{
    /* transform: translateX(-200px); */
    position: absolute;
    left: 42%;
  }
</style>
