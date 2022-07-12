<template>
  <div>
    <a-card v-action:get style="width: 100%">
      <a-button :disabled="!Boolean(phoneNumbers.length)" @click="visible = true" type="primary" slot="extra">Отправить сообщение</a-button>
      <a-row :gutter="[2,2]">
        <a-col :span="5" style="margin-right: 6px">
          <a-range-picker
            @change="onDateChange"
            :placeholder="['От даты', 'До даты']"
          />
        </a-col>
        <a-col :span="3" style="margin-right: 6px">
          <a-input-number
            v-model="params.startCount"
            placeholder="От кол.во"
            @blur="onBlur"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="3" style="margin-right: 6px">
          <a-input-number
            v-model="params.endCount"
            placeholder="До кол.во"
            @blur="onBlur"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="3" style="margin-right: 6px">
          <a-input-number
            v-model="params.startAverage"
            placeholder="От суммы"
            @blur="onBlur"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="3" style="margin-right: 6px">
          <a-input-number
            v-model="params.endAverage"
            placeholder="До суммы"
            @blur="onBlur"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="4" style="margin-right: 6px">
          <a-input v-debounce="search" :placeholder="$t('search')" />
        </a-col>
      </a-row>
      <a-row style="margin: 10px 0">
        <a-col :span="14">
          <h1>Общее количество клиентов: {{ params.pagination.total }}</h1>
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="allCustomers"
        :loading="loadCustomer"
        :rowKey="item => item.id"
        :row-selection="{ onChange: onSelectChanges }"
        :pagination="paginationCustomer"
        @change="changePagination"
        bordered
      >
        <template slot="status" slot-scope="is_blocked">
          <a-tag v-if="!is_blocked" color="#108ee9">{{ $t('active') }}</a-tag>
          <a-tag v-else color="#f00">{{ $t('inactive') }}</a-tag>
        </template>
      </a-table>
    </a-card>
     <a-modal v-model="visible" title="Отправить сообщение" on-ok="handleOk">
        <template slot="footer">
          <a-button key="back" @click="handleCancel => visible = false">
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
  </div>
</template>
<script>
// import CustomerView from './PreviewCustomer'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    // 'customer-view': CustomerView
  },
  props: ['postSms'],
  data () {
    return {
      visible: false,
      buttonLoading: false,
      slug: null,
      phoneNumbers: [],
      toall: false,
      form: {
          'phone_numbers': [],
          'text': '',
          'user_type': 'customer'
      },
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone'
        },
        {
          title: this.$t('createdAt'),
          dataIndex: 'created_at'
        },
        {
          title: this.$t('status'),
          dataIndex: 'is_blocked',
          align: 'center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('total_orders_count'),
          dataIndex: 'orders_amount',
          align: 'center',
          width: '12%'
        },
        {
          title: this.$t('average_sum'),
          dataIndex: 'average_price',
          align: 'center',
        }
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 50,
          total: null
        },
        created: [],
        search: '',
        startCount: '',
        endCount: '',
        startAverage: '',
        endAverage: ''
      }
    }
  },
  methods: {
    ...mapActions(['getAllCustomers', 'customerDelete', 'getCustomerById']),
    onDateChange (date, dateString) {
      this.params.created = dateString
      this.getAllCustomers(this.params)
    },
    onBlur () {
      this.getAllCustomers(this.params)
    },
    changePagination (e) {
      this.params.pagination = e
      this.getAllCustomers(this.params)
    },
    search (value) {
      // console.log(value)
      this.params.search = value
      this.getAllCustomers(this.params)
    },
    sendMessage () {
      const form = this.phoneNumbers.filter(el => el.phone).map(el => el.phone)
      // console.log('2223', { ...this.form, phone_numbers: form, to_all: this.toall }, this)
      this.postSms({ ...this.form, phone_numbers: form, to_all: this.toall }, this)
    },
    onSelectChanges (phoneNumbers, item) {
      console.log('selectedRowKeys changed: ', item)
      if (item.length === 50) {
        this.toall = true
        this.phoneNumbers = [1, 2]
        console.log(this.toall)
        // console.log('2222')
        // this.getAllCustomers({ ...this.params, pagination: { pageSize: 1000, current: 1 } }).then(res => {
        //   console.log('3333', res)
        //   // this.phoneNumbers = res
        //   this.phoneNumbers = [1, 2]
        // })
      } else {
        this.phoneNumbers = item
      }
    },
  },
  computed: {
    ...mapGetters(['allCustomers', 'loadCustomer', 'paginationCustomer'])
  },
  mounted () {
    this.getAllCustomers(this.params)
  }
}
</script>
