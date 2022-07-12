<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '400px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-tabs>
          <a-tab-pane :tab="$t('new.notification')" key="1">
            <a-list>
              <a-list-item>
                <a-list-item-meta :title="$t('new.order')" >
                  <router-link slot="avatar" to="/orders">
                    <a-avatar style="background-color: white" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                  </router-link>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge :count="(orders_notif_count && orders_notif_count.length) ? orders_notif_count[0].count : 0">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HeaderNotice',
  data () {
    return {
      loading: false,
      visible: false
    }
  },
  computed: {
    ...mapGetters(['new', 'new_pagination', 'orders_notif_count']),
    getTotal () {
      return this.new_pagination.total
    }
  },
  methods: {
    fetchNotice () {
      this.visible = !this.visible
      setTimeout(() => {
        this.visible = false
      }, 5000)
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
