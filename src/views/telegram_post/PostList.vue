<template>
  <div>
    <a-card title="Telegram Пост" style="width: 100%">
      <div slot="extra">
        <a-button type="primary" v-action:add @click="$router.push('/content/telegram_post/create')">{{ $t('add') }}</a-button>
      </div>
      <a-row style="margin: 10px 0">
        <a-col :span="16">
          <a-col :span="10">
            <a-select style="width: 100%" @change="handleChange" :placeholder="$t('selectContentType')">
              <a-select-option value="photo">
                {{ $t('photo') }}
              </a-select-option>
              <a-select-option value="video">
                {{ $t('video') }}
              </a-select-option>
              <a-select-option value="gif">
                {{ $t('gif') }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="allPosts"
        :loading="postLoad"
        :rowKey="item => item.id"
        :pagination="paginationPosts"
        @change="changePagination"
        bordered
      >
        <template slot="image" slot-scope="item">
          <div  class="imagePreview">
            <img :src="item" :alt="`no-image`">
          </div>
        </template>
        <template slot="content_type" slot-scope="content_type">
          {{ $t(content_type) }}
        </template>
        <template slot="created_at" slot-scope="time">
          {{ moment(time).format('YYYY-MM-DD') }} <br>
          {{ moment(time).format('hh:mm:ss') }}
        </template>
        <template slot="action" slot-scope="item">
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
  </div>
</template>
<script>
import moment from 'moment'
import Form from './Form'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Form,
  },
  data () {
    return {
      visible: false,
      loading: false,
      slug: null,
      columns: [
        {
          title: this.$t('text'),
          dataIndex: 'message',
        },
        {
          title: this.$t('content'),
          dataIndex: 'file_url',
          scopedSlots: { customRender: 'image' },
          align: 'center'
        },
        {
          title: this.$t('type'),
          dataIndex: 'content_type',
          scopedSlots: { customRender: 'content_type' },
          width: 180
        },
        {
          title: this.$t('createdAt'),
          dataIndex: 'created_at',
          scopedSlots: { customRender: 'created_at' },
          width: 180
        },
        {
          title: this.$t('successSendAmount'),
          dataIndex: 'success_amount',
          width: 160
        },
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   align: 'center',
        //   width: '15%',
        //   scopedSlots: { customRender: 'action' },
        // },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: null,
        },
        content_type: ''
        // search: '',
      },
    }
  },
  methods: {
    ...mapActions(['getPosts', 'deletePromo', 'lockedPromo']),
    editItem (item) {
      this.$refs.editItem.show(item)
    },
    changePagination (e) {
      this.params.pagination = e
      this.getPosts(this.params)
    },
    search (value) {
      console.log(value)
      this.params.search = value
      this.getPosts(this.params)
    },
    removePromo (item) {
      console.log(item)
      this.deletePromo(item.id).then(res => {
        this.getPosts(this.params)
      })
    },
    lockPromo (data) {
      this.lockedPromo(data).then(res => {
        this.getPosts(this.params)
      })
    },
    handleChange (type) {
      this.params.content_type = type
      this.getPosts(this.params)
    },
    moment
  },
  computed: {
    ...mapGetters(['allPosts', 'postLoad', 'paginationPosts']),
  },
  mounted () {
    this.getPosts(this.params)
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
