<template>
  <a-card v-action:get style="width: 100%">
    <a-button slot="extra" :disabled="!Boolean(phoneNumbers.length)" @click="visible = true" type="primary"
      >Отправить сообщение</a-button
    >
    <a-table
      :columns="columns"
      :rowKey="(record) => record.id"
      :dataSource="couriers"
      :pagination="getPagination"
      :loading="loading"
      :row-selection="{ onChange: onSelectChanges }"
      @change="handleTableChange"
    >
      <template slot="status" slot-scope="text, row">
        <a-tag @click="changer(row, false)" v-if="text.is_active" color="#108ee9">
          {{ $t('active') }}
        </a-tag>
        <a-tag @click="changer(row, true)" v-else color="#f50">
          {{ $t('blocked') }}
        </a-tag>
      </template>
      <template slot="courier_type" slot-scope="text">
        <span style="color: blue">{{ text.name }}</span>
      </template>
    </a-table>
    <a-modal v-model="visible" title="Отправить сообщение" on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="(handleCancel) => (visible = false)">
          {{ $t('cancel') }}
        </a-button>
        <a-button key="submit" type="primary" :loading="buttonLoading" @click="sendMessage">
          {{ $t('send') }}
        </a-button>
      </template>
      <a-textarea
        v-model="form.text"
        placeholder="Напишите ваше сообщение здесь"
        :auto-size="{ minRows: 4, maxRows: 10 }"
      />
    </a-modal>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['postSms'],
  data () {
    return {
      data: [],
      searchText: null,
      loading: false,
      visible: false,
      buttonLoading: false,
      isFetchingCourier: null,
      tagColors: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'],
      phoneNumbers: [],
      form: {
        'phone_numbers': [],
        'text': ''
      },
      columns: [
        {
          title: this.$t('firstName'),
          dataIndex: 'first_name',
        },
        {
          title: this.$t('lastName'),
          dataIndex: 'last_name',
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone',
        },
        {
          title: this.$t('createdAt'),
          dataIndex: 'created_at',
        },
        {
          title: this.$t('courier_type'),
          dataIndex: 'courier_type',
          scopedSlots: { customRender: 'courier_type' },
        },
        {
          title: this.$t('status'),
          // dataIndex: 'is_active',
          scopedSlots: { customRender: 'status' },
        },
        // {
        //   title: this.$t('workHours'),
        //   dataIndex: 'created_at'
        // },
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   width: '20%',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      selectedCourier: { first_name: '', last_name: '', phone: '', id: '' },
      previewVisible: false,
      updateVisible: false,
      filterParams: {},
      isShipperId: '',
    }
  },
  computed: {
    ...mapGetters(['couriers', 'paginationCourier']),
    getPagination () {
      return this.paginationCourier
    },
  },
  created () {
    this.isShipperId = localStorage.getItem('shipper_id').replace('"', '').replace('"', '')
  },
  mounted () {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 500)
    this.getCouriers()
  },
  beforeDestroy () {},
  methods: {
    ...mapActions(['getCouriers', 'getCourierArchive']),
    onSelectChanges (phoneNumbers, item) {
      console.log('selectedRowKeys changed: ', item)
      this.phoneNumbers = item
    },
    sendMessage () {
      const form = this.phoneNumbers.filter(el => el.phone).map(el => el.phone)
      console.log(form)
      this.postSms({ ...this.form, phone_numbers: form }, this)
    },
    callback (key) {
      this.$router.push({ name: this.$route.name, query: { keys: key } })
    },
    changer (row, val) {
      this.loading = true
      console.log('hello', row)
      delete row.branches
      const dataForm = {
        form: { ...row, is_active: val },
        courier_id: row.id,
      }
      this.$store
        .dispatch('courierUpdate', dataForm)
        .then((res) => {
          this.$message.success(this.$t('courierStatusChanged'))
          this.getCouriers()
        })
        .catch(() => {
          this.$message.error(this.$t('courierStatusNotChanged'))
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleTableChange (pagination) {
      this.getCouriers(pagination)
        .then((res) => console.log(res))
        .catch((err) => this.requestFailed(err))
    },
    search (e) {
      this.searchText = e
      this.getCouriers({ current: 1, pageSize: 10, total: null, search: e })
    },
  },
}
</script>
