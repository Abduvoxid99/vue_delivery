<template>
  <div>
    <a-row style="margin-bottom: 15px;">
      <a-col v-if="params.start_date && params.end_date" :span="6">{{ params.start_date.slice(0,10) }} - {{ params.end_date.slice(0,10) }}</a-col>
      <a-col :span="6"></a-col>
      <a-col :span="6"></a-col>
      <a-col :span="6"><a-button @click="isShowFilter = !isShowFilter" style=" width: 100%" icon="filter">{{ !isShowFilter ? 'Oткрыть' : 'Закрыть' }} фильтры</a-button></a-col>
    </a-row>
    <transition name="slide">
      <filters v-if="isShowFilter"
               @customer="customerGet"
               @branches="filterBranch"
               @courier="filterCourier"
               @status="filterStatus"
               @date="filterDate"
               @timepicker="filterTime"
               :params="params"
      />
    </transition>
    <a-table
      :columns="columns"
      :rowKey="record => record.id"
      :data-source="orders"
      :pagination="orderPagination"
      :loading="load_order"
      bordered
      @change="changeTablePagination"
      size="small"
      :scroll="{ x: 1200 }"
    >
      <template slot="timer" slot-scope="item">
        <a-tag style="margin-bottom: 10px" :color="item.timer.color">
          {{ item.timer.time }}
        </a-tag>
        <a-tag :color="getStatusColor(item.status_id)">
          {{ getStatusName(item.status_id) }}
        </a-tag>
      </template>
      <template slot="total" slot-scope="text, row">
        <div :style="{textAlign: 'center'}">
          <img v-if="row.payment_type === 'cash'" src="./icons/money.svg" style="width: 70%; height: 35px" />
          <img v-if="row.payment_type === 'click'" src="./icons/click.svg" style="width: 70%; height: 35px" />
          <img v-if="row.payment_type === 'payme'" src="./icons/payme.svg" style="width: 70%; height: 35px" />
          <img v-if="row.payment_type === 'transfer'" src="./icons/bank.svg" style="width: 70%; height: 35px" />
        </div>
        <p>{{ row.totalPrice }}</p>
      </template>
      <template slot="source" slot-scope="text, row">
        <div :style="{textAlign: 'center'}">
          <img v-if="row.source === 'admin_panel'" src="./icons/consulting.svg" style="width: 70%; height: 35px"/>
          <img v-if="row.source === 'bot'" src="./icons/telegram.svg" style="width: 70%; height: 35px"/>
          <img v-if="row.source === 'android'" src="./icons/android.svg" style="width: 70%; height: 35px"/>
          <img v-if="row.source === 'ios'" src="./icons/ios.svg" style="width: 70%; height: 35px"/>
          <img v-if="row.source === 'website'" src="./icons/globe.svg" style="width: 70%; height: 35px"/>
        </div>
      </template>
      <template slot="delivery_type" slot-scope="type">
        <div :style="{textAlign: 'center'}">
          <img v-if="type === 'delivery'" src="./icons/car.svg" style="width: 70%; height: 35px"/>
          <img v-if="type === 'self-pickup'" src="./icons/running-man.svg" style="width: 70%; height: 35px"/>
          <span v-if="type === 'delivery'">Доставка</span>
          <span v-if="type === 'self-pickup'">Самовывоз</span>
        </div>
      </template>

      <template slot="action" slot-scope="text, row">
        <a-tooltip><template slot="title">{{ $t('read') }}</template>
          <a-button size="small" style="margin: 0 2px" v-if="row.status_id !== '986a0d09-7b4d-4ca9-8567-aa1c6d770505' && row.status_id !=='ccb62ffb-f0e1-472e-bf32-d130bea90617'" type="default" icon="eye" @click="openPreviewModal(row)"></a-button>
        </a-tooltip>
        <a-tooltip ><template slot="title">{{ $t('read') }}</template>
          <a-button v-if="isSamosh" size="small" v-action:get style="margin: 0 2px" type="primary" icon="file-pdf" @click="printAsPDF(row)"></a-button>
        </a-tooltip>
        <router-link :to="{ name: 'OrderEditNew', params: { id: row.id }, query: { status_id: row.status_id } }">
          <a-tooltip><template slot="title">{{ $t('update') }}</template>
            <a-button size="small" style="margin: 0 2px" v-action:update v-if="row.status_id === '986a0d09-7b4d-4ca9-8567-aa1c6d770505' || row.status_id ==='ccb62ffb-f0e1-472e-bf32-d130bea90617'" type="primary" icon="edit"></a-button>
          </a-tooltip>
        </router-link>
        <a-tooltip><template slot="title">{{ $t('finishReason') }}</template>
          <a-button size="small" style="margin: 0 2px" v-action:delete v-if="row.status_id === 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1' || row.status_id === 'd39cb255-6cf5-4602-896d-9c559d40cbbe'" type="primary" icon="exclamation-circle" @click="$refs.reason.show(row)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="topRight"
          v-if="row.courier_id !== '' && row.status_id !== 'e665273d-5415-4243-a329-aee410e39465' && row.status_id !== '84be5a2f-3a92-4469-8283-220ca34a0de4' && row.status_id !== 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1'"
          slot="extra"
          :title="$t('courierCancelledOrder')"
          @confirm="removeCourier(row.id)"
          :okText="$t('yes')"
          :cancelText="$t('no')"
        >
          <a-tooltip><template slot="title">{{ $t('courierCancelled') }}</template>
            <a-button size="small" style="margin: 0 2px" v-action:delete type="danger" icon="car"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip><template slot="title">{{ $t('cancelled') }}</template>
          <a-button size="small" style="margin: 0 2px" v-action:delete v-if="row.status_id !== 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1' && row.status_id !== 'c4227d1b-c317-46f8-b1e3-a48c2496206f' && row.status_id !== 'e665273d-5415-4243-a329-aee410e39465' && row.status_id !== 'd39cb255-6cf5-4602-896d-9c559d40cbbe'" type="danger" icon="issues-close" @click="$refs.changeStatusModal.show(row.id, row, 'cancel', 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1')"></a-button>
        </a-tooltip>
        <a-tooltip><template slot="title">{{ $t('finished') }}</template>
          <a-button size="small" v-action:delete v-if="row.status_id !== 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1' && row.status_id !== 'c4227d1b-c317-46f8-b1e3-a48c2496206f' && row.status_id !== 'e665273d-5415-4243-a329-aee410e39465' && row.status_id !== 'd39cb255-6cf5-4602-896d-9c559d40cbbe'" style="border-color: #52c41a; color: #52c41a; margin: 0 2px" type="primary" ghost icon="issues-close" @click="$refs.changeStatusModal.show(row.id, row, 'finish', 'e665273d-5415-4243-a329-aee410e39465')"></a-button>
        </a-tooltip>
      </template>
    </a-table>
    <!--MODALS-->
    <preview ref="previewModal" />
    <finish ref="changeStatusModal"/>
    <reason ref="reason"/>
    <pdfGenerator :order="selectedOrder"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import timer from '@/utils/timer'
import Preview from './Preview'
import FinishModal from './modal'
import Filters from '@/views/orderNew/Filters'
import ReasonModal from '@/views/orderNew/ReasonModal'
import pdfGenerator from '@/views/orderNew/template/pdfGenerator'
import moment from 'moment'
import store from '@/store'

const setter = function (e) {
  console.log('Setter:', e)
  store.dispatch('webSocketCountOrders', e)
}

export default {
  components: {
    'finish': FinishModal,
    'preview': Preview,
    'filters': Filters,
    'reason': ReasonModal,
    pdfGenerator
  },
  data () {
    return {
      isSamosh: localStorage.getItem('shipper_id') == '"19d96f2a-7808-4c69-b8ca-79310a29bfab"',
      selectedOrder: { visible: false, data: null },
      time: {
        startDay: null,
        endDay: null,
        startTime: '05:00:00',
        endTime: '05:00:00'
      },
      columns: [
        {
          title: this.$t('orderId'),
          dataIndex: 'external_order_id',
          align: 'center',
          width: 90
        },
        {
          title: this.$t('duration'),
          // dataIndex: 'timer',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'timer' }
        },
        {
          title: this.$t('client'),
          dataIndex: 'clientPhoneAndName',
          width: 150
        },
        // {
        //   title: this.$t('status'),
        //   dataIndex: 'status_id',
        //   align: 'center',
        //   width: 160,
        //   scopedSlots: { customRender: 'status' }
        // },
        {
          title: this.$t('courier'),
          dataIndex: 'courierPhoneAndName',
          width: 150
        },
        {
          title: this.$t('branch'),
          dataIndex: 'branch',
          width: 150
        },
        // {
        //   title: this.$t('paymentType'),
        //   align: 'center',
        //   dataIndex: 'payment_type',
        //   width: 80,
        //   scopedSlots: { customRender: 'payment' }
        // },
        {
          title: this.$t('delivery_type'),
          align: 'center',
          dataIndex: 'delivery_type',
          width: 100,
          scopedSlots: { customRender: 'delivery_type' }
        },
        {
          title: this.$t('price.order'),
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'total' }
        },
        {
          title: this.$t('address.client'),
          dataIndex: 'to_address',
          ellipsis: true,
          width: 200
        },
        {
          title: this.$t('Source'),
          dataIndex: 'source',
          width: 90,
          scopedSlots: { customRender: 'source' }
        },
        {
          title: this.$t('createdAt'),
          dataIndex: 'created_at',
          width: 160
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: 130,
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loading: false,
      isShowFilter: false,
      realTimeInterval: null,
      params: {
        pagination: {
          current: 1,
          pageSize: 20,
          total: null
        },
        status_id: undefined,
        customer_id: undefined,
        courier_id: undefined,
        branch_ids: undefined,
        status_ids: undefined,
        start_date: undefined,
        end_date: undefined
      },
    }
  },
  methods: {
    ...mapActions(['getAllOrder', 'getAllOrderNotLoader', 'removeCourierOrder', 'getPhoneCustomers', 'getOrderByCountStatuses']),
    openPreviewModal (id) {
      this.$refs.previewModal.openModal(id)
    },
    printAsPDF (data) {
      console.log(data)
      this.selectedOrder.visible = true
      this.$store.dispatch('getOrder', data.id).then(res => {
        console.log('resssss', res)
        this.selectedOrder.data = res
      })
    },
    // getCount () {
    //   this.getOrderByCountStatuses({
    //     ids: '986a0d09-7b4d-4ca9-8567-aa1c6d770505,' +
    //       'ccb62ffb-f0e1-472e-bf32-d130bea90617,' +
    //       '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3,' +
    //       'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd,' +
    //       '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0,' +
    //       '84be5a2f-3a92-4469-8283-220ca34a0de4,' +
    //       'e665273d-5415-4243-a329-aee410e39465',
    //     start: this.params.start_date ? this.params.start_date : moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00',
    //     end: this.params.end_date ? this.params.end_date : moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
    //   })
    // },
    webSocket () {
      const shipperId = JSON.parse(localStorage.getItem('shipper_id'))
      const token = localStorage.getItem('token')
      const websocket = new WebSocket(`wss://test.websocket.delever.uz/ws?name=status&shipper_id=${shipperId}&token=${token}`)
      console.log(websocket)
      // let orderCount = null
      websocket.onopen = function (e) {
        console.log('Socket Connection: ', e)
      }
      websocket.onmessage = function (e) {
        console.log(e)
        const _data = JSON.parse(e.data).orders_count
        console.log(JSON.parse(e.data))
        setter(_data)
        // this.setCount(_data)
      }
    },
    setCount (_data) {
      this.$store.dispatch('webSocketCountOrders', _data)
    },
    changeTablePagination (pagination) {
      this.params.pagination = pagination
      this.$router.push({
        name: 'MainNewOrders',
        query: {
          status_id: this.$route.query.status_id,
          page: pagination.current,
          limit: pagination.pageSize
        }
      })
      this.getAllOrder(this.params)
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
    getStatusData (key) {
      this.params.status_id = key
      this.getAllOrder(this.params)
    },
    realTime () {
      this.realTimeInterval = setInterval(() => {
        this.getAllOrderNotLoader(this.params)
        // this.getCount()
        console.log(this.orders_count)
        console.log('realTime')
      }, 5000)
    },
    showReason (item) {
      console.log(item)
    },
    removeCourier (id) {
      this.removeCourierOrder(id)
    },
    customerGet (e) {
      this.params.customer_id = e
    },
    filterBranch (e) {
      this.params.branch_ids = e ? e.toString() : undefined
    },
    filterCourier (e) {
      this.params.courier_id = e
    },
    filterStatus (e) {
      this.params.status_ids = e ? e.toString() : undefined
    },
    filterDate (e) {
      if (e) {
        this.time.startDay = e[0]
        this.time.endDay = e[1]
        this.params.start_date = this.time.startDay + ' ' + this.time.startTime
        this.params.end_date = this.time.endDay + ' ' + this.time.endTime
      } else {
        this.params.start_date = undefined
        this.params.end_date = undefined
      }
    },
    filterTime (e) {
      console.log(e)
      if (e.start && e.end) {
        this.time.startTime = e.start
        this.time.endTime = e.end
        if (this.time.startDay && this.time.endDay) {
          this.params.start_date = this.time.startDay + ' ' + this.time.startTime + ':00'
          this.params.end_date = this.time.endDay + ' ' + this.time.endTime + ':00'
        }
      } else {
        console.log('Call Null Time')
        this.time.startTime = '05:00:00'
        this.time.endTime = '05:00:00'
        if (this.time.startDay && this.time.endDay) {
          this.params.start_date = this.time.startDay + ' ' + this.time.startTime
          this.params.end_date = this.time.endDay + ' ' + this.time.endTime
        }
      }
    },
    moment
  },
  computed: {
    ...mapGetters(['order', 'load_order', 'orderPagination', 'orders_count']),
    orders () {
      return (
        this.order && this.order.length ? this.order.map(order => {
          return {
            ...order,
            clientPhoneAndName: order.client_name + '\n' + order.client_phone_number,
            courierPhoneAndName: (order.courier ? order.courier.first_name : '') + '\n' + (order.courier ? order.courier.phone : ''),
            branch: order.steps ? order.steps[0].branch_name + '\n' + order.steps[0].phone_number : '',
            totalPrice: new Intl.NumberFormat().format(order.order_amount + order.co_delivery_price) + ' ' + this.$t('sum'),
            timer: timer.timer(order.created_at, order.status_notes)
          }
        }) : []
      )
    }
  },
  beforeDestroy () {
    clearInterval(this.realTimeInterval)
  },
  created () {
    console.log(this.isSamosh, localStorage.getItem('shipper_id'), '"19d96f2a-7808-4c69-b8ca-79310a29bfab"')
    this.webSocket()
  },
  mounted () {
    this.params.start_date = moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00'
    this.params.end_date = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
    if (this.$route.query.status_id) {
      if (this.$route.query.page && this.$route.query.limit) {
        this.params.pagination.current = parseInt(this.$route.query.page)
        this.params.pagination.pageSize = parseInt(this.$route.query.limit)
      }
      this.params.status_id = this.$route.query.status_id
    } else {
      this.params.status_id = '986a0d09-7b4d-4ca9-8567-aa1c6d770505'
    }
    console.log(this.params)
    this.getAllOrder(this.params)
    // this.getCount()
    this.realTime()
  }
}
</script>

<style lang="less" scoped>
.ant-table-row-cell-ellipsis{
  white-space: normal !important;
}
ul {
  cursor: pointer;
}

.slide-enter-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-in;
  -webkit-transition-timing-function: ease-in;
  -o-transition-timing-function: ease-in;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter, .slide-leave-to {
  overflow: hidden;
  max-height: 0;
}</style>
