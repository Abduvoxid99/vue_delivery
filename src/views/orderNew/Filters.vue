<template>
  <div>
    <a-divider>Фильтры</a-divider>
    <a-row style="margin: 10px 0">
      <a-col style="padding-right: 10px" :span="8">
        <a-spin :spinning="loadCustomer">
          <a-auto-complete
            style="width: 100%"
            :data-source="customers"
            placeholder="Телефонный номер"
            @select="selectCustomer"
            @search="searchCustomer"
          />
        </a-spin>
      </a-col>
      <a-col :span="8" style="padding: 0 10px">
        <a-select
          mode="multiple"
          :filter-option="$filterOption"
          v-model="Branches"
          style="width: 100%"
          placeholder="Филиалы"
        >
          <a-select-option v-for="branch in branches" :key="branch.id">
            {{ branch.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="8" style="padding-left: 10px">
        <a-spin :spinning="loadCourier">
          <a-auto-complete
            style="width: 100%"
            :data-source="couriers"
            :placeholder="$t('courier')"
            @select="selectCourier"
            @search="searchCourier"
          />
        </a-spin>
      </a-col>
    </a-row>
    <a-row style="margin: 10px 0">
      <a-col style="padding-right: 10px" :span="8">
        <a-spin :spinning="loadCustomer">
          <a-input :placeholder="$t('orderId')" type="number" @input="searchOrder" :value="params.external_order_id"/>
        </a-spin>
      </a-col>
      <a-col :span="8" style="padding: 0 10px">
        <a-range-picker
          :locale="locale"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
          :placeholder="[$t('start_time'), $t('end_time')]"
          v-model="datePicker"
        />
<!--        <a-range-picker v-model="datePicker" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" :placeholder="[$t('start_time'), $t('end_time')]" style="width: 100%"></a-range-picker>-->
      </a-col>
      <a-col :span="4" style="padding-left: 10px">
        <a-select
          mode="multiple"
          v-model="Status"
          style="width: 100%"
          :placeholder="$t('status')"
        >
          <a-select-option v-for="st in status" :key="st.id">
            <a-tag :color="st.color">
              {{ st.name }}
            </a-tag>
          </a-select-option>
        </a-select>
<!--        <a-row>-->
<!--          <a-col :span="12" style="padding-right: 10px">-->
<!--            <a-time-picker v-model="timePicker.start" placeholder="Время начала" valueFormat="HH:mm" format="HH:mm" />-->
<!--          </a-col>-->
<!--          <a-col :span="12" style="padding-left: 10px">-->
<!--            <a-time-picker v-model="timePicker.end" placeholder="Время окончания" valueFormat="HH:mm" format="HH:mm" />-->
<!--          </a-col>-->
<!--        </a-row>-->
      </a-col>
      <a-col :span="4" style="padding-left: 10px">
        <a-select
          allowClear
          v-model="paymentSelect"
          style="width: 100%"
          :placeholder="$t('orderpayment')"
          @change="filterPayment"
        >
          <a-select-option value="cash">Наличные</a-select-option>
          <a-select-option value="payme">Payme</a-select-option>
          <a-select-option value="click">Click</a-select-option>
          <a-select-option value="transfer">Перечисление</a-select-option>
        </a-select>
<!--        <a-row>-->
<!--          <a-col :span="12" style="padding-right: 10px">-->
<!--            <a-time-picker v-model="timePicker.start" placeholder="Время начала" valueFormat="HH:mm" format="HH:mm" />-->
<!--          </a-col>-->
<!--          <a-col :span="12" style="padding-left: 10px">-->
<!--            <a-time-picker v-model="timePicker.end" placeholder="Время окончания" valueFormat="HH:mm" format="HH:mm" />-->
<!--          </a-col>-->
<!--        </a-row>-->
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { AutoComplete } from 'ant-design-vue'
import dateLocale from '@/locales/datepicker.js'
import debounce from 'lodash/debounce'
import moment from 'moment'
export default {
  components: {
    'a-auto-complete': AutoComplete
  },
  watch: {
    Branches (val) {
      if (val.length > 0) this.searchBranch(val)
      else this.searchBranch(undefined)
    },
    Status (val) {
      if (val.length > 0) this.searchStatus(val)
      else this.searchStatus(undefined)
    },
    datePicker (val) {
      console.log(val)
      if (val && val.length) {
        this.$emit('date', val)
        this.getAllOrder(this.params)
      } else {
        this.$emit('date', [
          moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00',
          moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        ])
        this.getAllOrder(this.params)
      }
    },
  },
  props: {
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    this.searchCustomer = debounce(this.searchCustomer, 1000)
    this.searchBranch = debounce(this.searchBranch, 1000)
    this.searchCourier = debounce(this.searchCourier, 1000)
    this.searchOrder = debounce(this.searchOrder, 1000)
    return {
      locale: dateLocale,
      customers: [],
      couriers: [],
      loadCustomer: false,
      loadCourier: false,
      loadOrder: false,
      Branches: this.$route.query.branch_ids ? this.$route.query.branch_ids.split(',') : undefined,
      Status: [],
      paymentSelect: this.$route.query.payment_type ? this.$route.query.payment_type.split(',') : undefined,
      status: [
        {
          id: '986a0d09-7b4d-4ca9-8567-aa1c6d770505',
          name: this.$t('new'),
          color: '#2db7f5'
        },
        {
          id: '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3',
          name: this.$t('branchesAccepted'),
          color: '#001529'
        },
        // {
        //   id: 'c4227d1b-c317-46f8-b1e3-a48c2496206f',
        //   name: this.$t('branchesCancelled'),
        //   color: '#ed2d2d'
        // },
        {
          id: 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd',
          name: this.$t('branchesReady'),
          color: '#51EC7C'
        },
        {
          id: '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0',
          name: this.$t('courierAccepted'),
          color: '#108ee9'
        },
        // {
        //   id: '6ba783a3-1c2e-479c-9626-25526b3d9d36',
        //   name: this.$t('courierCancelled'),
        //   color: '#bf3939'
        // },
        {
          id: '84be5a2f-3a92-4469-8283-220ca34a0de4',
          name: this.$t('courierPickedUp'),
          color: '#13c2c2'
        },
        {
          id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617',
          name: this.$t('operatorAccepted'),
          color: '#42f5d7'
        },
        {
          id: 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1',
          name: this.$t('operatorCancelled'),
          color: '#e36464'
        },
        {
          id: 'e665273d-5415-4243-a329-aee410e39465',
          name: this.$t('finished'),
          color: '#87d068'
        },
        {
          id: 'd39cb255-6cf5-4602-896d-9c559d40cbbe',
          name: this.$t('serverCancelled'),
          color: '#ed2d2d'
        }
      ],
      datePicker: []
    }
  },
  methods: {
    moment,
    ...mapActions(['getAllOrder', 'getAllOrderNotLoader', 'getPhoneCustomers', 'getBranches', 'getCouriers']),
    selectCustomer (e) {
      this.$emit('customer', e)
      this.getAllOrder(this.params)
    },
    searchCustomer (e) {
      if (e !== '') {
        this.loadCustomer = true
        this.getPhoneCustomers({
          limit: 5,
          phone: e
        }).then(res => {
          console.log(res)
          this.customers = res.map(e => {
            return {
              text: e.name + ' ' + e.phone,
              value: e.id
            }
          })
        })
          .catch(err => {
            console.log(err)
            this.customers = []
          })
          .finally(() => {
            this.loadCustomer = false
          })
      } else {
        this.customers = []
        this.$emit('customer', undefined)
        this.getAllOrder(this.params)
      }
      console.log(e)
    },
    searchBranch (val) {
      this.$emit('branches', { name: 'branch_ids', val })
    },
    searchStatus (e) {
      this.$emit('status', e)
      this.getAllOrder(this.params)
    },
    searchOrder (val) {
      const _value = val.target.value
      if (_value.length === 6) {
        // this.$emit('extraOrder', parseInt(_value))
        this.$emit('extraOrder', { name: 'external_order_id', val: parseInt(_value) })
        this.getAllOrder(this.params)
      // } else this.$emit('extraOrder', undefined)
      } else this.$emit('extraOrder', { name: 'external_order_id', val: _value })
    },
    filterPayment (val) {
      this.$emit('payment', { name: 'payment_type', val })
      console.log(val)
    },
    selectCourier (e) {
      this.$emit('courier', e)
      this.getAllOrder(this.params)
    },
    searchCourier (e) {
      if (e !== '') {
        this.loadCourier = true
        this.getCouriers({
          current: 1,
          pageSize: 5,
          search: e
        }).then(res => {
          console.log(res)
          this.couriers = res.map(e => {
            return {
              text: e.first_name + ' ' + e.last_name + ' ' + e.phone,
              value: e.id
            }
          })
        })
          .catch(err => {
            console.log(err)
            this.couriers = []
          })
          .finally(() => {
            this.loadCourier = false
          })
      } else {
        this.couriers = []
        this.$emit('courier', undefined)
        this.getAllOrder(this.params)
      }
      console.log(e)
    },
    getStatusName (statusId) {
      switch (statusId) {
        case '986a0d09-7b4d-4ca9-8567-aa1c6d770505':
          return this.$t('new')
        case '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3':
          return this.$t('branchesAccepted')
        case 'c4227d1b-c317-46f8-b1e3-a48c2496206f':
          return this.$t('branchesCancelled')
        case 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd':
          return this.$t('branchesReady')
        case '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0':
          return this.$t('courierAccepted')
        case '6ba783a3-1c2e-479c-9626-25526b3d9d36':
          return this.$t('courierCancelled')
        case '84be5a2f-3a92-4469-8283-220ca34a0de4':
          return this.$t('courierPickedUp')
        case '79413606-a56f-45ed-97c3-f3f18e645972':
          return this.$t('delivered')
        case 'ccb62ffb-f0e1-472e-bf32-d130bea90617':
          return this.$t('operatorAccepted')
        case 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1':
          return this.$t('operatorCancelled')
        case 'e665273d-5415-4243-a329-aee410e39465':
          return this.$t('finished')
        case 'd39cb255-6cf5-4602-896d-9c559d40cbbe':
          return this.$t('serverCancelled')
        default:
          break
      }
    },
    getStatusColor (status) {
      switch (status) {
        case '986a0d09-7b4d-4ca9-8567-aa1c6d770505':
          return '#2db7f5'
        case '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0':
          return '#108ee9'
        case '84be5a2f-3a92-4469-8283-220ca34a0de4':
          return '#13c2c2'
        case '79413606-a56f-45ed-97c3-f3f18e645972':
          return '#722ed1'
        case '6ba783a3-1c2e-479c-9626-25526b3d9d36':
          return '#bf3939'
        case 'e665273d-5415-4243-a329-aee410e39465':
          return '#87d068'
        case '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3':
          return '#001529'
        case 'c4227d1b-c317-46f8-b1e3-a48c2496206f':
          return '#ed2d2d'
        case 'd39cb255-6cf5-4602-896d-9c559d40cbbe':
          return '#ed2d2d'
        case 'ccb62ffb-f0e1-472e-bf32-d130bea90617':
          return '#42f5d7'
        case 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1':
          return '#e36464'
        case 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd':
          return '#51EC7C'
        default:
          break
      }
    },
  },
  computed: {
    ...mapGetters(['branches'])
  },
  mounted () {
    this.getBranches({
      current: 1,
      pageSize: 100
    })
  }
}
</script>

<style scoped>

</style>
