<template>
  <div>
    <a-card title="Telegram Пост" style="width: 100%">
      <Form></Form>
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
          title: this.$t('name'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'title' },
          width: 180
        },
        {
          title: this.$t('description'),
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' },
          width: 180
        },
        {
          title: this.$t('start_promo'),
          dataIndex: 'start_time',
          scopedSlots: { customRender: 'start_time' },
          width: 120
        },
        {
          title: this.$t('end_promo'),
          dataIndex: 'end_time',
          scopedSlots: { customRender: 'end_time' },
          width: 120
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
