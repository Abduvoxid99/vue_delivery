<template>
  <div>
    <a-card v-action:get :title="$t('clients')" style="width: 100%">
      <a-button type="primary" slot="extra" v-action:add @click="addCustomer">{{ $t('add') }}</a-button>
      <a-row :gutter="[2,2]">
        <a-col :span="5" style="margin-right: 6px">
          <a-range-picker
            @change="onDateChange"
            :placeholder="['От даты', 'До даты']"
          />
        </a-col>
        <a-col :span="3">
          <a-input-number
            :min="0"
            v-model="params.startCount"
            placeholder="От кол.во"
            v-debounce="onBlur"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="3" style="margin-right: 6px">
          <a-input-number
            :min="0"
            v-model="params.endCount"
            placeholder="До кол.во"
            v-debounce="onBlur"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="3">
          <a-input-number
            :min="0"
            v-model="params.startAverage"
            placeholder="От суммы"
            v-debounce="onBlur"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="3" style="margin-right: 6px">
          <a-input-number
            :min="0"
            v-model="params.endAverage"
            placeholder="До суммы"
            v-debounce="onBlur"
            style="width: 100%"
          />
        </a-col>
        <a-col :span="4" style="margin-right: 6px">
          <a-input v-debounce="search" :placeholder="$t('search')" />
        </a-col>
        <a-col :span="2">
          <a-button @click="downloadExcel">
            <a-icon :type="buttonLoading ? 'loading' : 'download'" style="color: blue; font-size: 1.1rem;"></a-icon
          ></a-button>
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
        :pagination="paginationCustomer"
        @change="changePagination"
        bordered
      >
        <template slot="status" slot-scope="is_blocked">
          <a-tag v-if="!is_blocked" color="#108ee9">{{ $t('active') }}</a-tag>
          <a-tag v-else color="#f00">{{ $t('inactive') }}</a-tag>
        </template>
        <template slot="action" slot-scope="item">
          <a-tooltip>
            <template slot="title">{{ $t('info') }}</template>
            <a-button style="margin: 0 2px" type="primary" @click="viewCustomer(item)" icon="eye" ghost></a-button>
          </a-tooltip>
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button
              v-action:update
              style="margin: 0 2px"
              id="buttonUpdate"
              type="primary"
              @click="editCustomer(item)"
              icon="edit"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="removeCustomer(item)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button v-action:delete style="margin: 0 2px" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <!-- MODALS -->
    <customer-create ref="customerCreate" :params="params"></customer-create>
    <customer-create ref="customerEdit" :params="params" :edit="true"></customer-create>
    <customer-view ref="customerView"></customer-view>
  </div>
</template>
<script>
import CustomerCreate from './CustomerCreate'
import CustomerView from './PreviewCustomer'
import { mapActions, mapGetters } from 'vuex'
import { notification } from 'ant-design-vue'
export default {
  components: {
    'customer-create': CustomerCreate,
    'customer-view': CustomerView
  },
  data () {
    return {
      visible: false,
      buttonLoading: false,
      slug: null,
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
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' }
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
        startCount: null,
        endCount: null,
        startAverage: null,
        endAverage: null
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
    viewCustomer (item) {
      this.getCustomerById(item.id).then(res => {
        this.$refs.customerView.item.name = item.name
        this.$refs.customerView.item.phone = item.phone
        this.$refs.customerView.item.created_at = item.created_at
        this.$refs.customerView.item.average_sum = res.average_sum
        this.$refs.customerView.item.registration_source = item.registration_source
        this.$refs.customerView.show()
      })
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store
        .dispatch('ExcelClientReports')
        .then(res => {
          console.log(res)
          notification.success({
            message: this.$t('Отчет по клиента Excel файл готов')
          })
          // const elm = document.createElement('a')
          // elm.setAttribute('href', `${res.url}`)
          // elm.setAttribute('download', 'opratro')
          // elm.click()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.buttonLoading = false
        })
    },
    editCustomer (item) {
      this.$refs.customerEdit.id = item.id
      this.$refs.customerEdit.form.name = item.name
      this.$refs.customerEdit.form.phone = item.phone
      this.$refs.customerEdit.form.customer_type_id = item.customer_type_id
      this.$refs.customerEdit.show()
    },
    changePagination (e) {
      console.log('eeeeeeee===> ', e)
      this.params.pagination = e
      this.getAllCustomers(this.params)
    },
    search (value) {
      console.log(value)
      this.params.search = value
      this.getAllCustomers(this.params)
    },
    removeCustomer (item) {
      this.customerDelete(item.id).then(res => {
        this.getAllCustomers(this.params)
      })
      console.log(item)
    },
    addCustomer () {
      this.$refs.customerCreate.show()
    }
  },
  computed: {
    ...mapGetters(['allCustomers', 'loadCustomer', 'paginationCustomer'])
  },
  created () {
    this.getAllCustomers(this.params)
  }
}
</script>
