<template>
  <div>
    <a-card>
      <div slot="title"><a-page-header>{{ $t('reports.by.delivery.time') }}</a-page-header></div>
      <a-card>
        <div slot="title"><a-page-header><h1></h1></a-page-header></div>
        <a-table
          :rowKey="record => record.id"
          :columns="columns"
          :data-source="orders"
          bordered
          :pagination="paginationDeleveryTime"
          @change="changeTablePagination"
          :loading="loading"
          :scroll="{ x: 1300 ,y:600 }" >
          <template slot="delivery_type" slot-scope="row">
<!--            <span>{{ row ==='delivery'? 'Доставка': 'Самовывоз' }}-->
              <div :style="{textAlign: 'center'}">
          <img v-if="row === 'delivery'" src="../../orderNew/icons/car.svg" style="width: 70%; height: 35px" />
          <img v-if="row === 'self-pickup'" src="../../orderNew/icons/running-man.svg" style="width: 70%; height: 35px" />
        </div>
          </template>
          <template slot="id" slot-scope="text"> <span>{{ updateIndex (text.id) }}</span></template>
          <template slot="timer" slot-scope="text">
            <p><a-tag color=" #948aec">{{ moment(text.created_at).format('YYYY-MM-DD hh:mm:ss').split(' ')[0] }}</a-tag></p>
            <p><a-tag color="#3db8c1">{{ moment(text.created_at).format('YYYY-MM-DD hh:mm:ss').split(' ')[1] }}</a-tag></p>
          </template>
          <template slot="branch" slot-scope="text">
            <p><span style="color: #1890ff">{{ text.aggregator.name }}</span></p>
            <p><span>{{ text.aggregator.phone_number }}</span></p>
          </template>
          <template slot="couier" slot-scope="text">
            <p><span style="color: #1890ff">{{ text.aggregator.name }}</span></p>
            <p><span>{{ text.aggregator.phone_number }}</span></p>
          </template>
          <template slot="client" slot-scope="text">
            <p><span style="color: #1890ff">{{ text.client_name }}</span></p>
            <p><span>{{ text.client_phone_number }}</span></p>
          </template>
          <template slot="courier" slot-scope="row">
           <p> <span>{{ row.courier.first_name }}</span> </p>
            <p><span>{{ row.courier.last_name }}</span></p>
            <p><span>{{ row.courier.phone }}</span></p>
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
      </a-card>
    </a-card>

  </div><!--  <orderTable/>-->
</template>

<script>
import moment from 'moment'
import timer from '../../../utils/timer'
import { mapActions, mapGetters } from 'vuex'
export default {
 data () {
   return {
     loading: false,
     params: {
       page: { current: 1, pageSize: 50, total: null },
       branch_ids: this.$route.query.branchId,
       start_date: this.$route.query.start_date,
       end_date: this.$route.query.end_date,
       range_time_from: this.$route.query.data.range_time_from,
       range_time_to: this.$route.query.data.range_time_to

     }
   }
 },
  methods: {
    updateIndex (id) {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < this.TimeReports.length; i++) {
        // eslint-disable-next-line no-undef
        if (this.TimeReports[i].id === id) return this.$route.query.page ? ((parseInt(this.$route.query.page) - 1) * 50 + (i + 1)) : (i + 1)
      }
    },
    changeTablePagination (pagination) {
      console.log('kskgjsg>>>', pagination)
      this.loading = true
      console.log('pagination=>', pagination)
      this.params.page = { ...pagination }
      this.$router.push({ name: this.$route.name, query: { page: pagination.current, limit: pagination.pageSize } })
      this.$store.dispatch('getReportTime', this.params)
        .finally(() => {
          this.loading = false
        })
    },
   GetTimeReport () {
     this.loading = true
     this.getReportTime(this.params)
     .finally(() => {
       this.loading = false
     })
   },
    format () {
      const dateFrom = moment().subtract(2, 'd').format('YYYY-MM-DD') + ' 05:00:00'
      return dateFrom
    },

   ...mapActions(['getReportTime']),
   moment
  },
  computed: {
   ...mapGetters(['TimeReports', 'paginationDeleveryTime']),
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
          scopedSlots: { customRender: 'courier' },
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
          // sortOrder: this.params.sort_by === 'created_at' || this.params.sort_by === '-created_at'
        }
      ]
    },
    orders () {
      return (
        this.TimeReports && this.TimeReports.length ? this.TimeReports.map(order => {
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

  },
  mounted () {
   // setTimeout(() => {
   //   console.log(this.params)
   //   console.log(
   //     this.$route.query.branchId,
   //     this.$route.query.start_date,
   //      this.$route.query.end_date,
   //      this.$route.query.data.range_time_from,
   //     this.$route.query.data.range_time_to
   //   )
   // }, 5000)
    // this.getReportTime(this.params)
   this.GetTimeReport()
  }
}
</script>

<style scoped>

</style>
