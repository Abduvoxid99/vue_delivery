<template>
  <a-card :title="$t('aggregator')">
    <a-button slot="extra" type="primary" @click="createItem">
      {{ $t('add') }}
    </a-button>
    <div style="display: flex; justify-content: space-between">
      <span>{{ $t('total.count.aggregators') }}: {{ count }}</span>
      <a-col :span="8">
        <a-input-search
          v-model="name"
          @search="getitems"
          :placeholder="$t('search')"
        />
      </a-col>
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

    <aggregator-create ref="itemCreate" @finished="onFinished" />
    <aggregator-create ref="itemEdit" :edit="true" @finished="onFinished" />
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import AggregatorCreate from './AggregatorCreate.vue'

export default {
  name: 'AggregatorList',
  components: {
    'aggregator-create': AggregatorCreate
  },
  data () {
    return {
      items: [],
      count: 0,
      page: 1,
      limit: 10,
      name: '',
      loading: false,
      columns: [
        {
          key: 'name',
          // width: 50,
          title: this.$t('firstName'),
          dataIndex: 'name',
        },
        {
          key: 'phone',
          // width: 50,
          title: this.$t('phone'),
          dataIndex: 'phone_number',
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
    ...mapActions(['getAggregators', 'deleteAggregator']),
    onTableChange (pagination) {
      console.log(pagination)
      this.page = pagination.current
      this.getitems()
    },
    getitems () {
      this.loading = true
      this.getAggregators({ page: this.page, limit: this.limit, name: this.name })
        .then(res => {
          this.count = res.count
          this.items = res.aggregators
        })
        .catch(err => console.log(err))
        .finally(() => { this.loading = false })
    },
    // viewItem (item) {},
    editItem (item) {
      this.$refs.itemEdit.id = item.id
      this.$refs.itemEdit.form.name = item.name
      this.$refs.itemEdit.form.phone_number = item.phone_number
      this.$refs.itemEdit.show()
    },
    createItem () {
      this.$refs.itemCreate.show()
    },
    deleteItem (item) {
      this.deleteAggregator(item.id)
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
