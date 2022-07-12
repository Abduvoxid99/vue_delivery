<template>
<a-card>
  <div slot="title" style="display: flex; align-items: center; justify-content: space-between;">
    <a-page-header style="padding-top: 0">Отчет по курьерам / Полная информация</a-page-header>
    <div slot="extra">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ $t('courierReport') }} Скачать файл</span>
          </template>
          <a-button @click="downloadExcel"> <a-icon type="download" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
        </a-tooltip>
    </div>
  </div>
 <div>
   <a-table
     :rowKey="record => record.id"
     :columns="columns"
     :data-source="orders"
     @change="changeTablePagination"
     :pagination="Courierpagination"
     :loading="loading"
     :scroll="{ x: 1300, y: 600 }"
     bordered
   >
     <template slot="delivery_type" slot-scope="row">
       <!--            <span>{{ row ==='delivery'? 'Доставка': 'Самовывоз' }}-->
       <div :style="{textAlign: 'center'}">
         <img v-if="row === 'delivery'" src="../../orderNew/icons/car.svg" style="width: 70%; height: 35px" />
         <img v-if="row === 'self-pickup'" src="../../orderNew/icons/running-man.svg" style="width: 70%; height: 35px" />
       </div>
     </template>
     <template slot="id" slot-scope="text"> <span>{{ updateIndex (text.id) }}</span></template>
     <template slot="timer" slot-scope="text"> <a-tag color="#0080ff">{{ moment(text.created_at).format('YYYY-MM-DD') }}</a-tag></template>
     <template slot="branch" slot-scope="text">
       <p><span style="color: #1890ff">{{ text.aggregator.name }}</span></p>
       <p><span>{{ text.aggregator.phone_number }}</span></p>
     </template>
     <template slot="curer" slot-scope="text">
       <p><span style="color: #1890ff">{{ text.aggregator.name }}</span></p>
       <p><span>{{ text.aggregator.phone_number }}</span></p>
     </template>
     <template slot="couier" slot-scope="row">
       <p><span style="color: #1890ff">{{ row.first_name }} {{ row.last_name }}</span></p>
       <span>{{ row.phone }}</span>
     </template>
     <template slot="source" slot-scope="row">
       <div :style="{textAlign: 'center'}">
         <img v-if="row.source === 'admin_panel'" src="../../orderNew/icons/consulting.svg" style="width: 70%; height: 35px" />
         <img v-if="row.source === 'bot'" src="../../orderNew/icons/telegram.svg" style="width: 70%; height: 35px" />
         <img v-if="row.source === 'android'" src="../../orderNew/icons/android.svg" style="width: 70%; height: 35px" />
         <img v-if="row.source === 'ios'" src="../../orderNew/icons/ios.svg" style="width: 70%; height: 35px" />
         <img v-if="row.source === 'website'" src="../../orderNew/icons/globe.svg" style="width: 70%; height: 35px" />
       </div>
     </template>
     <template slot="client" slot-scope="text">
       <p><span style="color: #1890ff">{{ text.client_name }}</span></p>
       <p><span>{{ text.client_phone_number }}</span></p>
     </template>
     <template slot="total" slot-scope="row">
       <div :style="row.paid ? 'background-color: #d0ffb8' : ''">
         <div :style="{textAlign: 'center'}">
           <img v-if="row.payment_type === 'cash'" src="../../orderNew/icons/money.svg" style="width: 70%; height: 35px" />
           <img v-if="row.payment_type === 'click'" src="../../orderNew/icons/click.svg" style="width: 70%; height: 35px" />
           <img v-if="row.payment_type === 'payme'" src="../../orderNew/icons/payme.svg" style="width: 70%; height: 35px" />
           <img v-if="row.payment_type === 'transfer'" src="../../orderNew/icons/bank.svg" style="width: 70%; height: 35px" />
         </div>
         <p>{{ row.totalPrice }}</p>
         <!--            <p>{{ row.paid }}</p>-->
       </div>
     </template>
   </a-table>
 </div>
</a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import timer from '../../../utils/timer'
import moment from 'moment'
import { notification } from 'ant-design-vue'
export default {
  data () {
    return {
      params: {
        page: { current: 1, pageSize: 50, total: null },
        courier_id: this.$route.query.curier_id ? this.$route.query.curier_id : '',
        status_ids: 'e665273d-5415-4243-a329-aee410e39465',
        delivery_type: 'delivery',
       start_date: this.$route.query.from_date ?? '',
       end_date: this.$route.query.to_date ?? ''
      },
      buttonLoading: false,
    }
  },
  methods: {
    moment,
    ...mapActions(['getCourierReportsItem']),
    changeTablePagination (pagination) {
      console.log('kskgjsg>>>', pagination)
      this.loading = !this.loading
      console.log('pagination=>', pagination)
      this.params.page = { ...pagination }
      this.$router.push({ name: this.$route.name, query: { page: pagination.current, limit: pagination.pageSize } })
      this.$store.dispatch('getCourierReportsItem', this.params)
        .finally(() => {
          this.loading = !this.loading
        })
    },
    Delevery (value) {
      console.log(value)
      this.delivery = !this.delivery
    },
    productPrice (value) {
      console.log(value)
      this.byProductPrice = !this.byProductPrice
    },
    MinTime (value) {
      console.log(value)
      this.minTime = !this.minTime
    },
    MaxDistance (value) {
      console.log(value)
      this.maxDistance = !this.maxDistance
    },
    updateIndex (id) {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < this.curierDataItem.length; i++) {
        // eslint-disable-next-line no-undef
        if (this.curierDataItem[i].id === id) return this.$route.query.page ? ((parseInt(this.$route.query.page) - 1) * 50 + (i + 1)) : (i + 1)
      }
    },
    CourierAllGet () {
      this.loading = !this.loading
      this.$store.dispatch('getCourierReportsItem', this.params)
        .then(res => {
          console.log('res ==>>', res)
        })
        .finally(() => {
          this.loading = !this.loading
        })
    },

    downloadExcel () {
      this.buttonLoading = true
      this.$store
        .dispatch('ClientsOrderReportExcel', this.params)
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
  },

  mounted () {
    console.log('salommmm=>>', this.curierDataItem)
    this.CourierAllGet()
    this.loading = false
  },
  computed: {
    ...mapGetters(['curierDataItem', 'Courierpagination', 'Courierpagination']),
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
          dataIndex: 'courier',
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
          dataIndex: 'delivery_type',
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
          // sortOrder: this.params.sort_by === 'created_at' || this.params.sort_by === '-created_at'ro
        }
      ]
    },
    orders () {
      return (
        this.curierDataItem && this.curierDataItem.length ? this.curierDataItem.map(order => {
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

</style>
