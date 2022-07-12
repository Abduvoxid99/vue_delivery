<template>
  <a-card :title="$t('Уведомление пост')">
    <a-button slot="extra" type="primary" @click="$router.push(`/content/notification/create`)">
      {{ $t('add') }}
    </a-button>
    <div style="display: flex; justify-content: space-between">
      <span>{{ $t('totalCount') }}: {{ count.toString() }}</span>
    </div>
    <a-table
      bordered
      style="margin-top: 16px"
      :columns="columns"
      :loading="loading"
      :data-source="items"
      :pagination="{total: +count, pageSize: this.limit}"
      :row-key="(record) => record.id"
      @change="onTableChange"
    >
      <template slot="receiver_type" slot-scope="item">
        {{ item.receiver_type === 'courier' ? 'Курьер' :
        item.receiver_type === 'client' ? 'Клиент' :
          item.receiver_type === 'branch_user' ? 'Кассир' :
            item.receiver_type }}
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'NotificationList',
  data () {
    return {
      items: [],
      count: 0,
      page: 1,
      limit: 10,
      loading: false,
      columns: [
        {
          key: 'content',
          width: 400,
          title: this.$t('content'),
          dataIndex: 'content',
        },
        {
          key: 'title',
          // width: 150,
          title: this.$t('text'),
          dataIndex: 'title',
        },
        {
          key: 'receiver_type',
          // width: 150,
          title: this.$t('Тип приемника'),
          // dataIndex: 'receiver_type',
          scopedSlots: { customRender: 'receiver_type' },
        },
        {
          key: 'time',
          title: this.$t('createdAt'),
          // scopedSlots: { customRender: 'time' },
          dataIndex: 'time'
        },
      ]
    }
  },
  methods: {
    moment,
    ...mapActions(['getNotifications']),
    getItems () {
      this.loading = true
      this.getNotifications({ page: this.page, limit: this.limit })
        .then(res => {
          this.count = res.count ?? 0
          this.items = res?.notifications
        })
        .catch(err => console.log(err))
        .finally(() => { this.loading = false })
    },
  },
  created () {
    this.getItems()
  }
}
</script>
<style scoped>
.truncate {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
