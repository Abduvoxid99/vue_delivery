<template>
<div>
  <a-card>
    <div slot="title"><a-page-header>Общий отчет</a-page-header></div>
    <a-card>
      <div slot="title"><a-page-header><h1>отчет</h1></a-page-header></div>
      <a-table
        :rowKey="record => record.id"
        :columns="columns"
        :data-source="orders"
        @change="changeTablePagination"
        :pagination="paginationReportsMianCourier"
        :loading="loading"
        :scroll="{ x: 1300, y: 600 }" >
        <template slot="delivery_type" slot-scope="row">
          <div :style="{textAlign: 'center'}">
            <img v-if="row.delivery_type === 'delivery'" src="../orderNew/icons/car.svg" style="width: 70%; height: 35px" />
            <img v-if="row.delivery_type === 'self-pickup'" src="../orderNew/icons/running-man.svg" style="width: 70%; height: 35px" />
          </div>
<!--          <template slot="delivery_type" slot-scope="row">-->
<!--            &lt;!&ndash;            <span>{{ row ==='delivery'? 'Доставка': 'Самовывоз' }}&ndash;&gt;-->
<!--            <div :style="{textAlign: 'center'}">-->
<!--              <img v-if="row === 'delivery'" src="../orderNew/icons/car.svg" style="width: 70%; height: 35px" />-->
<!--              <img v-if="row === 'self-pickup'" src="../orderNew/icons/running-man.svg" style="width: 70%; height: 35px" />-->
<!--            </div>-->
<!--          </template>-->
        </template>
        <template slot="id" slot-scope="text"> <span>{{ updateIndex (text.id) }}</span></template>
        <template slot="timer" slot-scope="text">
        <p><a-tag color=" #948aec">{{ moment(text.created_at).format('YYYY-MM-DD hh:mm:ss').split(' ')[0] + ' ' + moment(text.created_at).format('YYYY-MM-DD hh:mm:ss').split(' ')[1] }}</a-tag></p>
      </template>
        <template slot="branch" slot-scope="text">
          <p><span style="color: #1890ff">{{ text.aggregator.name }}</span></p>
          <p><span>{{ text.aggregator.phone_number }}</span></p>
        </template>
        <template slot="curer" slot-scope="text">
          <p><span style="color: #1890ff">{{ text.aggregator.name }}</span></p>
          <p><span>{{ text.aggregator.phone_number }}</span></p>
        </template>
                <template slot="client" slot-scope="text">
                  <p><span style="color: #1890ff">{{ text.client_name }}</span></p>
                  <p><span>{{ text.client_phone_number }}</span></p>
                </template>
        <template slot="couier" slot-scope="text">
                  <p><span style="color: #1890ff">{{ text.courier.first_name }}</span></p>
                  <p><span>{{ text.courier.last_name }}</span></p>
          <p><span>{{ text.courier.phone }}</span></p>
                </template>
        <template slot="source" slot-scope="row">
          <div :style="{textAlign: 'center'}">
            <img v-if="row.source === 'admin_panel'" src="../orderNew/icons/consulting.svg" style="width: 70%; height: 35px" />
            <img v-if="row.source === 'bot'" src="../orderNew/icons/telegram.svg" style="width: 70%; height: 35px" />
            <img v-if="row.source === 'android'" src="../orderNew/icons/android.svg" style="width: 70%; height: 35px" />
            <img v-if="row.source === 'ios'" src="../orderNew/icons/ios.svg" style="width: 70%; height: 35px" />
            <img v-if="row.source === 'website'" src="../orderNew/icons/globe.svg" style="width: 70%; height: 35px" />
          </div>
        </template>
        <template slot="total" slot-scope="row">
          <div :style="row.paid ? 'background-color: #d0ffb8' : ''">
            <div :style="{textAlign: 'center'}">
              <img v-if="row.payment_type === 'cash'" src="../orderNew/icons/money.svg" style="width: 70%; height: 35px" />
              <img v-if="row.payment_type === 'click'" src="../orderNew/icons/click.svg" style="width: 70%; height: 35px" />
              <img v-if="row.payment_type === 'payme'" src="../orderNew/icons/payme.svg" style="width: 70%; height: 35px" />
              <img v-if="row.payment_type === 'transfer'" src="../orderNew/icons/bank.svg" style="width: 70%; height: 35px" />
            </div>
            <p>{{ row.totalPrice }}</p>
            <!--            <p>{{ row.paid }}</p>-->
          </div>
        </template>
      </a-table>
    </a-card>
  </a-card>

</div><!--  <orderTable/>-->
</template>

<script>
// import orderTable from '@/views/orderNew/orderTable'
// import moment from 'moment'
import { mapGetters } from 'vuex'
import moment from 'moment'
import timer from '../../utils/timer'

export default {
  components: {
    // orderTable
  },
data () {
return {
  loading: false,
  order: [],
  params: {
    pagination: { current: 1, pageSize: 50, total: null },
    status_ids: this.$route.query.colname === 'canceled_orders' ? 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1,d39cb255-6cf5-4602-896d-9c559d40cbbe,c4227d1b-c317-46f8-b1e3-a48c2496206f' : 'e665273d-5415-4243-a329-aee410e39465',
    aggregator_id: this.$route.query.colname === 'aggergattor' ? '7a031a9e-827d-4f03-a01d-41b42a9e5c7e' : this.$route.query.colname === 'self-pickup' ? 'c87bdae2-c230-4265-b968-ca8775ffaeb3' : '',
    start_date: this.$route.query.from_date.length > 10 ? this.$route.query.from_date.split('/')[0] : this.$route.query.from_date,
    end_date: this.$route.query.to_date,
    delivery_type: this.$route.query.colname === 'delivery' || this.$route.query.colname === 'self-pickup' ? this.$route.query.colname : '',
    is_reissued: this.$route.query.colname === 'reissued_order_count' ? 'true' : ''
    // status_ids: ,
    // payment_type:
    // aggregator_id:
  }
}
},
  mounted () {
    this.getOrderList()
    console.log('=====', this.params)
  },
  methods: {
    changeTablePagination (pagination) {
      console.log('kskgjsg>>>', pagination)
      this.loading = true
      console.log('pagination=>', pagination)
      this.params.pagination = { ...pagination }
      this.$router.push({ name: this.$route.name, query: { page: pagination.current, limit: pagination.pageSize } })
      this.$store.dispatch('getOrderAllList', this.params)
      .finally(() => {
        this.loading = false
      })
    },

    moment,
    updateIndex (id) {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < this.ordersCurer.length; i++) {
        // eslint-disable-next-line no-undef
        if (this.ordersCurer[i].id === id) return this.$route.query.page ? ((parseInt(this.$route.query.page) - 1) * 50 + (i + 1)) : (i + 1)
      }
    },
getOrderList () {
  this.loading = true
  this.$store.dispatch('getOrderAllList', this.params)
    .then(res => {
      console.log('resorder====', res)
    })
  .finally(() => {
    this.loading = false
  })
}

  },
  computed: {
    ...mapGetters(['OrderStatus', 'paginationReportsMianCourier', 'ordersCurer']),
    getOrderListAll () {
      return this.orderList
    },
    columns () {
      return [
        {
          title: this.$t('ordernumber'),
          fixed: 'left',
          // eslint-disable-next-line no-undef
          align: 'center',
          width: 60,
          // eslint-disable-next-line standard/object-curly-even-spacing
          scopedSlots: { customRender: 'id' }
        },
        {
          title: this.$t('orderId'),
          dataIndex: 'external_order_id',
          scopedSlots: { customRender: 'external_order_id' },
          align: 'center',
          width: 150,
        },

        {
          title: this.$t('duration'),
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'timer' }
        },
        {
          title: this.$t('client'),
          width: 150,
          scopedSlots: { customRender: 'client' }
        },

        {
          title: this.$t('courier'),
          // dataIndex: 'courier',
          width: 150,
          scopedSlots: { customRender: 'couier' },
        },
        {
          title: this.$t('branch'),
          dataIndex: 'branch',
          width: 150
        },
        {
          title: this.$t('delivery_type'),
          align: 'center',
          // dataIndex: 'delivery_type',
          width: 100,
          scopedSlots: { customRender: 'delivery_type' }
        },
        {
          title: this.$t('price.order'),
          width: 100,
          align: 'center',
          // dataIndex: 'order_amount',
          key: 'order_amount',
          scopedSlots: { customRender: 'total' },
          sorter: (a, b) => {},
          // sortOrder: this.params.sort_by === 'order_amount' || this.params.sort_by === '-order_amount'
        },
        {
          title: this.$t('address.client'),
          dataIndex: 'to_address',
          ellipsis: true,
          width: 200
        },
        {
          title: this.$t('Source'),
          // dataIndex: 'source',
          width: 90,
          scopedSlots: { customRender: 'source' }
        },
        {
          title: this.$t('createdAt'),
          dataIndex: 'created_at',
          key: 'created_at',
          width: 200,
          fixed: 'right',
          sorter: (a, b) => {},
          // sortOrder: this.params.sort_by === 'created_at' || this.params.sort_by === '-created_at'
        }
      ]
    },
    orders () {
      return (
        this.ordersCurer && this.ordersCurer.length ? this.ordersCurer.map(order => {
          return {
            ...order,
            courierPhoneAndName: (order.courier ? order.courier.first_name : '') + '\n' + (order.courier ? order.courier.phone : ''),
            branch: order.steps ? order.steps[0].branch_name + '\n' + this.$phoneFormatter(order.steps[0].phone_number) : '',
            totalPrice: new Intl.NumberFormat().format(order.order_amount + order.co_delivery_price) + ' ' + this.$t('sum'),
            timer: timer.timer(order.created_at, order.status_notes)
          }
        }) : []
      )
    },
  }
}
</script>
<style scoped>
.pointer { cursor: pointer;
}</style>
