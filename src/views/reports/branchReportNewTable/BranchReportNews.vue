<template>
  <div>
    <a-card>
      <div slot="title"><a-page-header>{{ $t('branchReports') }}</a-page-header></div>
      <a-card>
        <div slot="title"><a-page-header><h1>{{ columnNameFilter(this.$route.query.columname) }}</h1></a-page-header></div>
        <a-button @click="downloadExcel" slot="extra"> <a-icon type="download" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
        <a-table
          :rowKey="record => record.id"
          :columns="columns"
          :data-source="orders"
          @change="changeTablePagination"
          :pagination="paginationCourier"
          :loading="loading"
          :scroll="{ x: 1300, y: 400 }" >
<!--          <template slot="delivery_type" slot-scope="row"><span>{{ row ==='delivery'? 'Доставка': 'Самовывоз' }}</span></template>-->
          <template slot="id" slot-scope="text"> <span>{{ updateIndex (text.id) }}</span></template>
          <template slot="couier" slot-scope="text">
            <p><span style="color: #1890ff">{{ text.courier.first_name }}</span></p>
            <p><span>{{ text.courier.last_name }}</span></p>
            <p><span>{{ text.courier.phone }}</span></p>
          </template>
          <template slot="timer" slot-scope="text"> <a-tag color="blue">
            {{ moment(text.created_at).format('YYYY-MM-DD') }}
          </a-tag></template>
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
          <template slot="delivery_type" slot-scope="row">
                      <!--            <span>{{ row ==='delivery'? 'Доставка': 'Самовывоз' }}-->
                      <div :style="{textAlign: 'center'}">
                        <img v-if="row === 'delivery'" src="../../orderNew/icons/car.svg" style="width: 70%; height: 35px" />
                        <img v-if="row === 'self-pickup'" src="../../orderNew/icons/running-man.svg" style="width: 70%; height: 35px" />
                      </div>
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
// import orderTable from '@/views/orderNew/orderTable'
// import moment from 'moment'
import { mapGetters } from 'vuex'
import moment from 'moment'
import timer from '../../../utils/timer'
import { jsontoexcel } from 'vue-table-to-excel'

export default {
  components: {
    // orderTable
  },
  data () {
    return {
      loading: false,
      order: [],
      params: {
        source: this.$route.query.columname === 'aggergattor' ? '' : this.$route.query.columname,
        branch_id: this.$route.query.branch_id,
        page: { current: 1, pageSize: 50, total: null },
        status_ids: 'e665273d-5415-4243-a329-aee410e39465',
        aggregator_id: this.$route.query.columname === 'aggergattor' ? '7a031a9e-827d-4f03-a01d-41b42a9e5c7e' : '',
        start_date: this.$route.query.from_date.length > 10 ? this.$route.query.from_date.split('/')[0] : this.$route.query.from_date,
        end_date: this.$route.query.to_date,
        range_time_from: this.$route.query.range_time_from ?? '',
        range_time_to: this.$route.query.range_time_to ?? '',
        // delivery_type: this.$route.query.colname === 'delivery' || this.$route.query.colname === 'self-pickup' ? this.$route.query.colname : ''
        // status_ids: ,
        // payment_type:
        // aggregator_id:
      }
    }
  },
  mounted () {
    this.getBranchListItem()
    console.log('=====', this.params)
  },
  methods: {
    downloadExcel () {
      jsontoexcel.getXlsx(this.orders, Object.keys(this.orders[0]), 'Отчет по филиалам.xlsx')
    },
    columnNameFilter (columnname) {
      switch (columnname) {
        case 'admin_panel': return 'Админ'
        case 'bot': return 'Бот'
        case 'app': return 'Апп'
        case 'website': return 'Заказы на сайте'
        case 'aggergattor': return 'Агрегаторы'
        // default: 'Общая отчет филиалам'
        //   break
      }
      return 'Общая отчет филиалам'
    },
    changeTablePagination (pagination) {
      console.log('kskgjsg>>>', pagination)
      this.loading = true
      console.log('pagination=>', pagination)
      this.params.page = { ...pagination }
      this.$router.push({ name: this.$route.name, query: { page: pagination.current, limit: pagination.pageSize } })
      this.$store.dispatch('getOrderAllListItem', this.params)
        .finally(() => {
          this.loading = false
        })
    },

    moment,
    updateIndex (id) {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < this.BranchListItem.length; i++) {
        // eslint-disable-next-line no-undef
        if (this.BranchListItem[i].id === id) return this.$route.query.page ? ((parseInt(this.$route.query.page) - 1) * 50 + (i + 1)) : (i + 1)
      }
    },
    getBranchListItem () {
      this.loading = true
      this.$store.dispatch('getOrderAllListItem', this.params)
        .then(res => {
          console.log('resorder====', res)
        })
        .finally(() => {
          this.loading = false
        })
    }

  },
  computed: {
    ...mapGetters(['OrderStatus', 'paginationCourier', 'BranchListItem']),
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
        this.BranchListItem && this.BranchListItem.length ? this.BranchListItem.map(order => {
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
.pointer { cursor: pointer; }
</style>
