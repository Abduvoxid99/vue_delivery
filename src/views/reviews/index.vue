<template>
  <div>
    <a-card v-action:get :title="$t('review.title')" style="width: 100%">
      <div style="display: flex" slot="extra">
<!--        <a-button style="margin-right: 10px" type="default" v-action:add @click="$router.push('/content/user-reviews/list')">{{ $t('review.title') }}</a-button>-->
        <a-button type="primary" v-action:add @click="$router.push('/content/reviews/new')">{{ $t('add') }}</a-button>
        <a-button style="margin-left: 5px;" @click="$store.dispatch('updateTelegramBase', { option: 'reviews' })" v-action:add type="default" icon="sync">{{ $t('refresh_telegram') }}</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="reviews"
        :loading="loadCustomer"
        :rowKey="item => item.id"
        :pagination="pagination"
        @change="getPagination"
        bordered
      >
      <span slot="message.ru" slot-scope="text">{{ text.message.ru ? text.message.ru : text.message.uz }}</span>
      <span slot="type" slot-scope="text"><a-icon theme="filled" :style="{fontSize: '21px', color: text.type=='like' ? 'green' :'red'}" :type="text.type=='like' ? 'like' : 'dislike'" /></span>
        <template slot="active" slot-scope="text">
          <a-tag v-if="text.active" color="#108ee9">{{ $t('active') }}</a-tag>
          <a-tag v-else color="#f00">{{ $t('inactive') }}</a-tag>
        </template>
        <template slot="action" slot-scope="item">
          <!-- <a-tooltip>
            <template slot="title">{{ $t('info') }}</template>
            <a-button style="margin: 0 2px" type="primary" @click="viewCustomer(item)" icon="eye" ghost></a-button>
          </a-tooltip> -->
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button v-action:update style="margin: 0 2px" id="buttonUpdate" type="primary" @click="$router.push(`/content/reviews/${item.id}`)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteReview(item)"
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
    </a-card>
  </div>
</template>
<script>
export default {

  data () {
    return {
      visible: false,
      loading: false,
      loadCustomer: true,
      reviews: [],
      slug: null,
      columns: [
        {
          title: this.$t('message.title'),
          scopedSlots: { customRender: 'message.ru' },
          key: 'message.ru',
          width: '40%'
        },
        {
          title: this.$t('message.type'),
          scopedSlots: { customRender: 'type' },
          key: 'type',
        },
        {
          title: this.$t('status'),
          key: 'active',
          align: 'center',
          scopedSlots: { customRender: 'active' },
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' },
        },
      ],
    pagination: {
          current: 1
       },
    }
  },
  methods: {
    search (e) {
        this.getreviews({ ...this.$route.query, search: e })
    },
    getPagination (e) {
          this.$router.replace({ query: { ...this.$route.query, page: e, limit: 10 } })
          this.getreviews({ ...this.$route.query, search: this.searchValue })
          this.pagination.current = e.current
    },
    deleteReview (item) {
        console.log(item)
        this.$store.dispatch('deleteReview', item.id).then(res => {
            console.log(res)
            this.reviews = this.reviews.filter(el => el.id !== item.id)
        })
    },
    getreviews (params) {
        this.loadCustomer = true
        this.$store.dispatch('getReviews', params).then(res => {
            console.log(res)
            this.reviews = res.reviews
                this.pagination = { ...this.pagination, count: res.count }
                document.body.scrollTop = 0
                document.documentElement.scrollTop = 0
        }).finally(() => {
            this.loadCustomer = false
        })
    }
  },
  created () {
    this.getreviews({ page: 1, limit: 10, ...this.$route.query })
  },
}
</script>
