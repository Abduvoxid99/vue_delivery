<template>
  <div>
    <a-card :title="$t('promo_list')" style="width: 100%">
      <div slot="extra">
        <a-button type="primary" @click="addItem">{{ $t('add') }}</a-button>
        <a-button style="margin-left: 5px;" @click="$store.dispatch('updateTelegramBase', { option: 'promos' })" v-action:add type="default" icon="sync">{{ $t('refresh_telegram') }}
        </a-button>
<!--        <a-button type="primary" @click="$store.dispatch('refreshBotDb', { option: 'promo' })">{{ $t('refresh') }}</a-button>-->
      </div>
      <a-row style="margin: 10px 0">
        <a-col :span="16"></a-col>
        <a-col :span="8">
          <a-input v-debounce="search" :placeholder="$t('search')" />
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="allPromo"
        :loading="promoLoad"
        :rowKey="item => item.id"
        :pagination="paginationPromo"
        @change="changePagination"
        bordered
      >
        <template slot="status" slot-scope="is_active">
          <a-tag v-if="is_active" color="green">Active</a-tag>
          <a-tag v-else color="red">Deactive</a-tag>
        </template>
        <template slot="title" slot-scope="title">
          {{ title.uz }}
          {{ title.en }}
          {{ title.ru }}
        </template>
        <template slot="description" slot-scope="description">
          {{ description.uz }}
          {{ description.en }}
          {{ description.ru }}
        </template>
        <template slot="image" slot-scope="item">
          <div class="imagePreview">
            <img :src="item" :alt="item.name">
          </div>
        </template>
        <template slot="start_time" slot-scope="time">
          {{ moment(parseInt(time) * 1000).format('DD-MM-YYYY') }}
        </template>
        <template slot="end_time" slot-scope="time">
          {{ moment(parseInt(time) * 1000).format('DD-MM-YYYY') }}
        </template>
        <template slot="action" slot-scope="item">
<!--          <a-tooltip>-->
<!--            <template slot="title">{{ item.is_active ? $t('blockMsg') : $t('unblockMsg') }}</template>-->
<!--            <a-button style="margin: 0 2px" :type="item.is_active ? 'danger' : 'primary'" @click="lockPromo(item)" ghost :icon="item.is_active ? 'lock' : 'unlock'"></a-button>-->
<!--          </a-tooltip>-->
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button style="margin: 0 2px" type="primary" @click="editItem(item)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="removePromo(item)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button
                style="margin: 0 2px"
                type="danger"
                icon="delete"
              ></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <!-- MODALS -->
    <item-component ref="createItem" :editable="false" :params="params"/>
    <item-component ref="editItem" :editable="true" :slug="slug" :params="params"/>
  </div>
</template>
<script>
import createItem from './PromotionsCreateWithUpdate'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'item-component': createItem
  },
  data () {
    return {
      visible: false,
      loading: false,
      slug: null,
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: this.$t('start_promo'),
          dataIndex: 'start_time',
          scopedSlots: { customRender: 'start_time' }
        },
        {
          title: this.$t('end_promo'),
          dataIndex: 'end_time',
          scopedSlots: { customRender: 'end_time' }
        },
        {
          title: this.$t('photo'),
          dataIndex: 'image',
          scopedSlots: { customRender: 'image' },
          align: 'center'
        },
        {
          title: this.$t('status'),
          dataIndex: 'is_active',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '15%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: null,
        },
        search: '',
      },
    }
  },
  methods: {
    ...mapActions(['getPromo', 'deletePromo', 'lockedPromo']),
    editItem (item) {
      this.$refs.editItem.show(item)
    },
    changePagination (e) {
      this.params.pagination = e
      this.getPromo(this.params)
    },
    search (value) {
      console.log(value)
      this.params.search = value
      this.getPromo(this.params)
    },
    removePromo (item) {
      console.log(item)
      this.deletePromo(item.id).then(res => {
        this.getPromo(this.params)
      })
    },
    lockPromo (data) {
      this.lockedPromo(data).then(res => {
        this.getPromo(this.params)
      })
    },
    addItem () {
      this.$refs.createItem.show()
    },
    moment
  },
  computed: {
    ...mapGetters(['allPromo', 'promoLoad', 'paginationPromo']),
  },
  mounted () {
    this.getPromo(this.params)
  }
}
</script>
<style>
.ant-table-row:hover {
  cursor: pointer;
}
.imagePreview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
