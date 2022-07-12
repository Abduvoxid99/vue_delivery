<template>
  <div>
    <a-card :title="$t('banners.list')" style="width: 100%">
      <a-button type="primary" slot="extra" @click="addItem">{{ $t('add') }}</a-button>
      <a-row style="margin: 10px 0">
        <a-col :span="16"></a-col>
        <a-col :span="8">
          <a-input v-debounce="search" :placeholder="$t('search')" />
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="banner"
        :loading="load_banner"
        :rowKey="item => item.id"
        :pagination="bannerPagination"
        @change="changePagination"
        bordered
      >
<!--        <template slot="popular" slot-scope="is_popular">-->
<!--          <a-tag v-if="is_popular" color="green">{{ $t('popular') }}</a-tag>-->
<!--          <a-tag v-else color="red">{{ $t('popular.no') }}</a-tag>-->
<!--        </template>-->
        <template slot="status" slot-scope="active">
          <a-tag v-if="active" color="blue">{{ $t('active') }}</a-tag>
          <a-tag v-else color="red">{{ $t('inactive') }}</a-tag>
        </template>
        <template slot="image" slot-scope="item">
          <div class="imagePreview">
            <img :src="item" :alt="item.name">
          </div>
        </template>
        <template slot="action" slot-scope="item">
<!--          <a-popconfirm-->
<!--            placement="topRight"-->
<!--            slot="extra"-->
<!--            :title="item.active ? $t('blockMsg') : $t('unblockMsg')"-->
<!--            @confirm="lockItem(item)"-->
<!--            :okText="$t('yes')"-->
<!--            :cancelText="$t('no')"-->
<!--          >-->
<!--            <a-tooltip>-->
<!--              <template slot="title">{{ $t('block') }}</template>-->
<!--              <a-button-->
<!--                style="margin: 0 2px"-->
<!--                ghost-->
<!--                :type="item.active ? 'danger': 'primary'"-->
<!--                :icon="item.active ? 'lock': 'unlock'"-->
<!--              ></a-button>-->
<!--            </a-tooltip>-->
<!--          </a-popconfirm>-->
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button style="margin: 0 2px" id="buttonUpdate" type="primary" @click="editItem(item)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="removeItem(item)"
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
    <item-create ref="createItem" :editable="false" :params="params"/>
    <item-create ref="editItem" :editable="true" :params="params"/>
  </div>
</template>
<script>
import create from './BannerCreateWithUpdate'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'item-create': create
  },
  data () {
    return {
      visible: false,
      loading: false,
      columns: [
        {
          title: this.$t('name_uz'),
          dataIndex: 'title.uz',
        },
        {
          title: this.$t('name_ru'),
          dataIndex: 'title.ru',
        },
        // {
        //   title: this.$t('popular'),
        //   dataIndex: 'is_popular',
        //   scopedSlots: { customRender: 'popular' },
        // },
        // {
        //   title: this.$t('status'),
        //   dataIndex: 'status',
        //   scopedSlots: { customRender: 'status' },
        // },
        {
          title: this.$t('image'),
          dataIndex: 'image',
          align: 'center',
          scopedSlots: { customRender: 'image' },
        },
        {
          title: this.$t('status'),
          dataIndex: 'active',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
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
    ...mapActions(['getAllBanner', 'deleteBanner', 'updateBanner']),
    editItem (item) {
      console.log(item)
      this.$refs.editItem.show(item)
    },
    changePagination (e) {
      this.params.pagination = e
      this.getAllBanner(this.params)
    },
    search (value) {
      console.log('VALUE ==>', value)
      this.params.search = value
      this.getAllBanner(this.params)
    },
    removeItem (item) {
      console.log(item)
      this.deleteBanner(item.id).then(res => {
        this.getAllBanner(this.params)
      })
    },
    lockItem (item) {
      const id = item.id
      const status = !item.active
      const a = {
        title: item.title,
        position: item.position,
        image: item.image.split('/')[4],
        active: status
      }
      const payload = {
        id: id,
        data: a
      }
      this.updateBanner(payload).then(res => {
        this.getAllBanner(this.params)
      })
      console.log(item)
    },
    addItem () {
      this.$refs.createItem.show()
    },
  },
  computed: {
    ...mapGetters(['banner', 'load_banner', 'bannerPagination']),
  },
  mounted () {
    this.getAllBanner(this.params)
  },
}
</script>
<style>
.ant-table-row:hover {
  cursor: pointer;
}
.imagePreview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
}
</style>
