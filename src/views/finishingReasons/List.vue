<template>
  <a-card :title="$t('reasons.of.finishing')">
    <a-button slot="extra" type="primary" @click="createItem">
      {{ $t('add') }}
    </a-button>
    <div style="display: flex; justify-content: space-between">
      <span>{{ $t('totalCount') }}: {{ count.toString() }}</span>
      <!-- <a-col :span="8">
        <a-input-search
          v-model="name"
          @search="getitems"
          :placeholder="$t('search')"
        />
      </a-col> -->
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
      <template slot="created_at" slot-scope="item">
        {{ moment(item).format('YYYY-MM-DD') }}
      </template>
      <template slot="action" slot-scope="item">
        <!-- <a-tooltip>
          <template slot="title">{{ $t('info') }}</template>
          <a-button
            ghost
            icon="eye"
            type="primary"
            style="margin: 0 2px"
            @click="viewItem(item)"
          />
        </a-tooltip> -->
        <a-tooltip>
          <template slot="title">{{ $t('update') }}</template>
          <a-button
            v-action:update
            style="margin: 0 2px"
            id="buttonUpdate"
            type="primary"
            @click="editItem(item)"
            icon="edit"
          />
        </a-tooltip>
        <a-popconfirm
          placement="topRight"
          slot="extra"
          :title="$t('deleteMsg')"
          @confirm="deleteItem(item)"
          :okText="$t('yes')"
          :cancelText="$t('no')"
        >
          <a-tooltip>
            <template slot="title">{{ $t('delete') }}</template>
            <a-button
              v-action:delete
              style="margin: 0 2px"
              type="danger"
              icon="delete"
            ></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </a-table>

    <create ref="itemCreate" @finished="onFinished" />
    <create ref="itemEdit" :edit="true" @finished="onFinished" />
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import Create from './Create.vue'
import moment from 'moment'

export default {
  name: 'FinishingReasonsList',
  components: {
    'create': Create
  },
  data () {
    return {
      items: [],
      count: 0,
      page: 1,
      limit: 50,
      // name: '',
      loading: false,
      columns: [
        {
          key: 'text',
          // width: 50,
          title: this.$t('title.of.reason'),
          dataIndex: 'text',
        },
        {
          key: 'created_at',
          // width: 50,
          title: this.$t('createdAt'),
          scopedSlots: { customRender: 'created_at' },

        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' },
        }
      ]
    }
  },
  // watch: {
  //   name: (newVal, old) => {
  //     console.log(newVal, old)
  //   }
  // },
  methods: {
      moment,
    ...mapActions(['getFinishingReasons', 'deleteFinishingReason']),
    onTableChange (pagination) {
      console.log(pagination)
      this.page = pagination.current
      this.getitems()
    },
    getitems () {
      this.loading = true
      this.getFinishingReasons({ page: this.page, limit: this.limit })
        .then(res => {
          this.count = res.count ?? 0
          this.items = res?.finishing_reasons
        })
        .catch(err => console.log(err))
        .finally(() => { this.loading = false })
    },
    // viewItem (item) {},
    editItem (item) {
      this.$refs.itemEdit.id = item.id
      this.$refs.itemEdit.form.text = item.text
      this.$refs.itemEdit.show()
    },
    createItem () {
      this.$refs.itemCreate.show()
    },
    deleteItem (item) {
      this.deleteFinishingReason(item.id)
        .then(res => {
          console.log(res)
          this.getitems()
        })
    },
    onFinished (val) {
      if (val === 'created' || val === 'updated') {
        this.getitems()
      }
    }
  },
  created () {
    this.getitems()
  }
}
</script>
