<template>
    <a-card>
      <p class="warnDate" v-if="isWarnPaymentActive">Осталось {{ 10 - warnDate }} дней до отключения системы, пожалуйста произведите оплату.</p>
      <a-tabs :activeKey="tabActiveKey" @change="handleTabChange">
        <div slot="tabBarExtraContent">
          <router-link v-action:get :to="{ name: 'Tracking' }">
            <a-button style="float: right; margin-left: 5px;" type="primary link" icon="environment">{{ $t('showOnMap') }}</a-button>
          </router-link>
          <router-link v-action:get :to="{ name: 'Order' }">
            <a-button v-action:add style="float: right; margin-left: 5px;" type="primary link" icon="plus">{{ $t('createOrder') }}</a-button>
          </router-link>
<!--          <router-link v-action:get :to="{ name: 'OrderCreateNew' }">-->
<!--            <a-button v-action:add style="float: right; margin-left: 5px;" type="primary link" icon="plus">{{ $t('createOrder') }}</a-button>-->
<!--          </router-link>-->
<!--          <router-link v-action:get :to="{ name: 'Order' }">-->
<!--            <a-button v-action:add style="float: right; margin-left: 5px;" type="primary link" icon="plus"></a-button>-->
<!--          </router-link>-->
        </div>
        <a-tab-pane :force-render="true" v-for="tab in tabList" :key="tab.key">
          <span slot="tab">
<!--            <a-icon type="apple" />-->
            <a-badge
              :count="tab.count"
              :overflow-count="9999"
              :offset="[10,0]"
              :number-style="{
                backgroundColor: '#1890FF',
                color: '#fff',
                boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px',
              }"
            >
              {{ tab.tab }}
            </a-badge>
          </span>
        </a-tab-pane>
      </a-tabs>
      <order-table ref="orderTable" />
    </a-card>
<!--  </page-header-wrapper>-->
</template>

<script>
import orderTable from '@/views/orderNew/orderTable'
// import socket from '@/utils/socket'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  components: {
    'order-table': orderTable
  },
  data () {
    return {
      realTimeInterval: null,
      tabList: [
        { key: '7', tab: this.$t('future_order'), count: 0 },
        { key: '1', tab: this.$t('new'), count: 0 },
        { key: '2', tab: this.$t('operatorAccepted'), count: 0 },
        { key: '3', tab: this.$t('zagatovka'), count: 0 },
        { key: '4', tab: this.$t('courierPickedUp'), count: 0 },
        { key: '5', tab: this.$t('finished'), count: 0 },
        { key: '6', tab: this.$t('allOrders'), count: 0 }
      ],
      tabActiveKey: '7',
      warnDate: moment(Date.now()).format('D'),
      isWarnPaymentActive: false,
      isWarnPaymentActiveBranch: false
    }
  },
  computed: {
    ...mapGetters(['orders_count'])
  },
  beforeDestroy () {
    clearInterval(this.realTimeInterval)
  },
  methods: {
    callback (key) {
      console.log(key)
    },
    showTimerPayment () {
      if (moment(Date.now()).format('D') <= '10') {
        this.isWarnPaymentActive = true
      } else {
        this.isWarnPaymentActive = false
      }
    },
    realTime () {
      this.realTimeInterval = setInterval(() => {
        // console.log('real count')
        this.tabList = [
          { key: '7', tab: this.$t('future_order'), count: this.getCount('bf9cc968-367d-4391-93fa-f77eda2a7a99') },
          { key: '1', tab: this.$t('new'), count: this.getCount('986a0d09-7b4d-4ca9-8567-aa1c6d770505') },
          { key: '2', tab: this.$t('operatorAccepted'), count: this.getCount('ccb62ffb-f0e1-472e-bf32-d130bea90617') },
          { key: '3', tab: this.$t('zagatovka'), count: this.getCount('1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3') + this.getCount('b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd') + this.getCount('8781af8e-f74d-4fb6-ae23-fd997f4a2ee0') },
          { key: '4', tab: this.$t('courierPickedUp'), count: this.getCount('84be5a2f-3a92-4469-8283-220ca34a0de4') },
          { key: '5', tab: this.$t('finished'), count: this.getCount('e665273d-5415-4243-a329-aee410e39465') },
          { key: '6', tab: this.$t('allOrders'), count: this.getCount('all') }
        ]
      }, 5000)
    },
    getCount (status) {
      if (this.orders_count && this.orders_count.length) {
        if (status === 'all') return 0
        else {
            for (let i = 0; i < this.orders_count.length; i++) {
              if (status === this.orders_count[i].status_id) {
                return parseInt(this.orders_count[i].count)
              }
            }
            return 0
        }
      } else return 0
    },
    handleTabChange (key) {
      this.tabActiveKey = key
      // this.$refs.orderTable.getStatusData(this.getStatus(key))
      const _order = this.$refs.orderTable
      this.$router.push({
        name: 'MainNewOrders',
        query: {
          external_order_id: this.$route.query.external_order_id ?? '',
          payment_type: this.$route.query.payment_type ?? undefined,
          branch_ids: this.$route.query.branch_ids ?? undefined,
          // customer_id: this.$route.query.customer_id ?? undefined,
          // courier_id: this.$route.query.courier_id ?? undefined,
          status_id: this.getStatus(key),
          start_date: moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00',
          end_date: moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        }
      })
      // if (key === '5')
      // { _order.params.start_date =  moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00',
      //   _order.params.end_date = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
      // }
      if (key === '6') {
        _order.params.start_date = undefined
        _order.params.end_date = undefined
      //   _order.filterDate([], 'all')
      } else {
        _order.params.start_date = this.$route.query.start_date
        _order.params.end_date = this.$route.query.end_date
      //   _order.filterDate([
      //     this.$route.query.start_date,
      //     this.$route.query.end_date
      //   ])
      }
      this.$refs.orderTable.params.pagination = {
        current: 1,
        pageSize: 50,
        total: null
      }

      this.$refs.orderTable.getStatusData(this.getStatus(key))

      // if (key === 'all') {
      //   this.$refs.orderTable.params.start_date = undefined
      //   this.$refs.orderTable.params.end_date = undefined
      // } else {
      //   this.$refs.orderTable.params.start_date = moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00'
      //   this.$refs.orderTable.params.end_date = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
      // }
    },
    getStatus (key) {
      switch (key) {
        case '1':
          return '986a0d09-7b4d-4ca9-8567-aa1c6d770505'
        case '2':
          return 'ccb62ffb-f0e1-472e-bf32-d130bea90617'
        case '3':
          return '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3,b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd,8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'
        // case '4':
        //   return 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd'
        // case '5':
        //   return '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'
        case '4':
          return '84be5a2f-3a92-4469-8283-220ca34a0de4'
        case '5':
          return 'e665273d-5415-4243-a329-aee410e39465'
        case '6':
          return 'all'
        case '7':
          return 'bf9cc968-367d-4391-93fa-f77eda2a7a99'
        default:
          break
      }
    },
    getKey (status) {
      switch (status) {
        case '986a0d09-7b4d-4ca9-8567-aa1c6d770505':
          return '1'
        case 'ccb62ffb-f0e1-472e-bf32-d130bea90617':
          return '2'
        case '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3,b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd,8781af8e-f74d-4fb6-ae23-fd997f4a2ee0':
          return '3'
        // case 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd':
        //   return '4'
        // case '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0':
        //   return '5'
        case '84be5a2f-3a92-4469-8283-220ca34a0de4':
          return '4'
        case 'e665273d-5415-4243-a329-aee410e39465':
          return '5'
        case 'all':
          return '6'
        case 'bf9cc968-367d-4391-93fa-f77eda2a7a99':
          return '7'
        default:
          break
      }
    }
  },
  mounted () {
    const currentUser = {
      shipperId: localStorage.getItem('shipper_id'),
    }
    const shipperID = JSON.parse(currentUser.shipperId)
    if (shipperID && shipperID == '36b00947-ad7a-40eb-b7ca-1c0ea267f2ac') {
      this.isWarnPaymentActiveBranch = true
    } else {
      this.isWarnPaymentActiveBranch = false
    }
    if (this.$route.query.status_id) {
      this.tabActiveKey = this.getKey(this.$route.query.status_id)
    } else this.tabActiveKey = '1'
    this.realTime()
    this.showTimerPayment()
  },
  created () {
    if (!this.$route.query.status_id) {
      this.$router.push({
        name: 'MainNewOrders',
        query: {
          status_id: '986a0d09-7b4d-4ca9-8567-aa1c6d770505'
        }
      })
    }

    // socket.onmessage = (mes) => {
    //   console.log(JSON.parse(mes.data))
    // }
  }
}
</script>

<style scoped>
.warnDate {
  position: absolute;
  left: 50px;
  top: -68px;
  z-index: 99;
  font-weight: 500;
  font-size: 14px;
  color: #d41222;
}
</style>
