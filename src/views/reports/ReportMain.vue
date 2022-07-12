<template>
<div class="maindiv">
  <a-card class="maindiv">
    <div slot="title">
      <a-page-header>
        Общий отчет
      </a-page-header>
    </div>
    <a-card :bordered="false">
      <div slot="title">
        <a-form-model :rules="rules" :model="params" ref="ruleForm">
       <a-row>
         <a-col :xm="24" :md="5">
           <a-range-picker @change="onChangeFromDate" style="margin-top: 5px" :placeholder="['От даты' ,'До даты']">
           </a-range-picker>
         </a-col>
         <a-col :xm="24" :md="3" class="margenLeftTime">
               <a-form-model-item ref="from_time" prop="from_time">
                 <a-time-picker v-model="params.from_time" @change="onTimePickerForm" :open.sync="open1" placeholder="От времени" valueFormat="hh:mm:ss">
                   <a-button slot="addon" size="small" type="primary" @click="handleClose">
                     Ok
                   </a-button>
                 </a-time-picker>
               </a-form-model-item>
         </a-col>
         <a-col :xm="24" :md="4" class="margenLeftTime">
               <a-form-model-item ref="to_time" prop="to_time">
                 <a-time-picker v-model="params.to_time" @change="onTimePicerTo" :open.sync="open2" placeholder="До времени" valueFormat="hh:mm:ss">
                   <a-button slot="addon" size="small" type="primary" @click="handleClose">
                     Ok
                   </a-button>
                 </a-time-picker>
               </a-form-model-item>
         </a-col>
           <a-col :xm="24" :md="6" class="margenLeftTimes">
             <a-dropdown>
               <a-menu slot="overlay" @click="handleMenuClick">
                 <a-menu-item v-for="(tablecolumn, index) in newarray " :key="tablecolumn">
                   <a-checkbox :checked="columns[index].value">
                 </a-checkbox>
                  <strong> {{ tablecolumn }}</strong>
                 </a-menu-item>
               </a-menu>
               <a-button style="margin-left: 8px; color: #D9D9D9"> Фильтр по<a-icon type="down" /> </a-button>
             </a-dropdown>
           </a-col>
       </a-row>
        </a-form-model>
    </div>
      <div slot="extra">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ $t('ReportsMian') }} Скачать файл</span>
          </template>
          <a-button @click="downloadExcel"> <a-icon :type="buttonLoading ? 'loading' : 'download'" style="color: blue; font-size: 1.1rem;"></a-icon></a-button>
        </a-tooltip>
      </div>
    <div>
      <template>
        <a-table
          :rowKey="() => Math.random().toString()"
          :columns="filteredCols"
          :data-source="getReportList"
          :pagination="false"
          @change="onTableChange"
          :loading="loading"
          :scroll="{ x: 3200, y: 400 }"
          bordered

        >
                  <span slot="ReportNumber">
                      <span>{{ $t('ReportNumber') }}</span>
                      <span style="margin-left: 10px">
                        <a-button @click="ReportMainSortTableHeaderIcons('date')" size="small" style="background-color: #FAFAFA">
                     <a-icon v-if="data" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!data" :component="$myIcon.bxicons2"></a-icon></a-button>
                      </span>
                  </span>
                  <span slot="reissued_order_count">
                      <span>{{ $t('reissued_order_count') }}</span>
                      <span style="margin-left: 10px">
                        <a-button @click="ReportMainSortTableHeaderIcons('reissued_order_count')" size="small" style="background-color: #FAFAFA">
                     <a-icon v-if="reissuedordercount" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!reissuedordercount" :component="$myIcon.bxicons2"></a-icon></a-button>
                      </span>
                  </span>
                  <span slot="delevery" style="display:flex;">
                  <span> {{ $t('delevery') }} </span>
                        <span style="margin-left: 10px">
                        <a-button @click="ReportMainSortTableHeaderIcons('delivery')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="delivery" :component="$myIcon.bxicons1"></a-icon>
                           <a-icon v-if="!delivery" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                           </span>
                   </span>
                  <span slot="byTotalPrice">
                  <span>  {{ $t('byTotalPrice') }}</span>

                       <span style="margin-left: 10px"> <a-button @click="ReportMainSortTableHeaderIcons('total_price')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="byTotalPrice" :component="$myIcon.bxicons1"></a-icon>
                           <a-icon v-if="!byTotalPrice" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                         </span>
                   </span>
                   <span slot="byProductPrice">
                    <span>{{ $t('byProductPrice') }}</span>
                       <span style="margin-left: 10px"> <a-button @click="ReportMainSortTableHeaderIcons('product_price')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="byProductPrice" :component="$myIcon.bxicons1"></a-icon>
                           <a-icon v-if="!byProductPrice" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                         </span>
                   </span>
                    <span slot="totalDelivery">
                                <span>  {{ $t('totalDelivery') }} </span>
                                 <span style="margin-left: 10px"> <a-button @click="ReportMainSortTableHeaderIcons('total_delivery')" size="small" style="background-color: #FAFAFA">
                                    <a-icon v-if="total_delivery" :component="$myIcon.bxicons1"></a-icon>
                                    <a-icon v-if="!total_delivery" :component="$myIcon.bxicons2"></a-icon>
                                  </a-button>
                                 </span>
                    </span>
                    <span slot="totalPickup">
                                <span>  {{ $t('totalPickup') }} </span>
                                 <span style="margin-left: 10px"> <a-button @click="ReportMainSortTableHeaderIcons('total_self_pickup')" size="small" style="background-color: #FAFAFA">
                                    <a-icon v-if="total_self_pickup" :component="$myIcon.bxicons1"></a-icon>
                                    <a-icon v-if="!total_self_pickup" :component="$myIcon.bxicons2"></a-icon>
                                  </a-button>
                                 </span>
                    </span>
                    <span slot="totalAggregator">
                       <span> {{ $t('totalAggregator') }} </span>
                       <span style="margin-left: 10px">
                          <a-button @click="ReportMainSortTableHeaderIcons('total_aggregator')" size="small" style="background-color: #FAFAFA">
                            <a-icon v-if="total_aggregator" :component="$myIcon.bxicons1"></a-icon>
                            <a-icon v-if="!total_aggregator" :component="$myIcon.bxicons2"></a-icon>
                          </a-button>
                      </span>
                    </span>
                  <span slot="pickup">
                    <span> {{ $t('pickup') }}</span>

                     <span style="margin-left: 10px">
                       <a-button @click="ReportMainSortTableHeaderIcons('self_pickup')" size="small" style="background-color: #FAFAFA">
                     <a-icon v-if="self_pickup" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!self_pickup" :component="$myIcon.bxicons2"></a-icon></a-button>
                     </span>

                  </span>
                  <span slot="aggregators">
                     <span> {{ $t('aggregators') }} </span>
                     <span style="margin-left: 10px">
                        <a-button @click="ReportMainSortTableHeaderIcons('aggregator')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="aggregator" :component="$myIcon.bxicons1"></a-icon>
                          <a-icon v-if="!aggregator" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                    </span>
                  </span>
                  <span slot="chargeDelivery">
                    <span>{{ $t('chargeDelivery') }}</span>
                    <span style="margin-left: 10px"><a-button @click="ReportMainSortTableHeaderIcons('free_delivery')" size="small" style="background-color: #FAFAFA">
                       <a-icon v-if="free_delivery" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!free_delivery" :component="$myIcon.bxicons2"></a-icon>
                     </a-button>
                   </span>
                  </span>
                  <span slot="cancelDorders">
                    <span>{{ $t('cancelDorders') }}</span>

                    <span style="margin-left: 10px"><a-button @click="ReportMainSortTableHeaderIcons('canceled_orders')" size="small" style="background-color: #FAFAFA">
                     <a-icon v-if="canceled_orders" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!canceled_orders" :component="$myIcon.bxicons2"></a-icon></a-button>
                     </span>
                  </span>
                  <span slot="awayCashback">
                    <span>{{ $t('awayCashback') }} </span>
                    <span style="margin-left: 10px"> <a-button @click="ReportMainSortTableHeaderIcons('given_cashback')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="given_cashback" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!given_cashback" :component="$myIcon.bxicons2"></a-icon>
                      </a-button>
                         </span>
                  </span>
                  <span slot="butSolt">
                      <span>  {{ $t('butSolt') }} </span>
                       <span style="margin-left: 10px"> <a-button @click="ReportMainSortTableHeaderIcons('canceled_but_sold')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="canceled_but_sold" :component="$myIcon.bxicons1"></a-icon>
                         <a-icon v-if="!canceled_but_sold" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                         </span>
                  </span>
          <template slot="name" slot-scope="text, recodr">
<!--            <a v-if="recodr.date.length > 10">Итого</a> <br>-->
            <a-tooltip :title="recodr.date.length > 10 ? 'Итого' :'Число' + ' '+ recodr.date ">
            <a @click="dataTableTable(recodr)">{{ recodr.date.length > 10 ? 'Итого' : recodr.date }} {{ recodr.data }}</a>
            </a-tooltip>
          </template>
          <template slot="del" slot-scope="text ,record">
            <a-tooltip :title=" record.delivery ? 'Доставка'+ ' ' + record.delivery : ''">
              <a style="color:blue" @click="TableItemOnclick('delivery', record)">{{ record.delivery }}</a>
            </a-tooltip>
          </template>
          <template slot="total_price" slot-scope="text ,record">
            <a-tooltip :title=" record.total_price ? 'По общей цене'+ ' '+new Intl.NumberFormat().format(record.total_price) : ''">
              <a style="color:blue" @click="TableItemOnclick('byTotalPrice', record)">{{ new Intl.NumberFormat().format(record.total_price) }}</a>
            </a-tooltip>
          </template>
          <template slot="product_price" slot-scope="text ,record">
            <a-tooltip :title=" record.product_price ? 'По цене продукта'+ ' ' + new Intl.NumberFormat().format(record.product_price): ''">
              <a style="color:blue" @click="TableItemOnclick('byTotalPrice', record)">{{ new Intl.NumberFormat().format(record.product_price) }}</a>
            </a-tooltip>
          </template>
          <template slot="total_delivery" slot-scope="text ,record" class="hovers">
            <a-tooltip :title=" text.total_delivery ? 'Сумма доставка' + ' '+text.total_delivery : ''">
              <a style="color:blue" @click="TableItemOnclick('total_delivery', record)">{{ text.total_delivery }}</a>
            </a-tooltip>
          </template>
          <template slot="total_self_pickup" slot-scope="text ,record" class="hovers">
            <a-tooltip :title=" text.total_self_pickup? 'Сумма самовывоз' + ' '+text.total_self_pickup : ''">
              <a style="color:blue" @click="TableItemOnclick('total_self_pickup', record)">{{ text.total_self_pickup }}</a>
            </a-tooltip>
          </template>
          <template slot="total_aggregator" slot-scope="text ,record">
            <a-tooltip :title=" text.total_aggregator? 'Сумма агрегаторы' + ' '+text.total_aggregator : ''" >
              <a style="color:blue" @click="TableItemOnclick('total_aggregator', record)">{{ record.total_aggregator }}</a>
            </a-tooltip>
          </template>
          <template slot="self_pickup" slot-scope="text ,record" class="hovers">
            <a-tooltip :title=" text.self_pickup? 'Самовывоз' + ' '+text.self_pickup : ''">
              <a style="color:blue" @click="TableItemOnclick('self-pickup', record)">{{ text.self_pickup }}</a>
            </a-tooltip>
          </template>
          <template slot="aggergattor" slot-scope="text ,record">
            <a-tooltip :title="record.aggregators ? 'Агрегаторы'+ ' '+ record.aggregators :''">
              <a style="color:blue" @click="TableItemOnclick('aggergattor', record)">{{ record.aggregators }}</a>
            </a-tooltip>
          </template>
          <template slot="free_delivery" slot-scope="text ,record">
            <span>{{ record.free_delivery }}</span>
<!--            <a-tooltip title="free_delivery">-->
<!--              <a style="color:black" @click="deliveryRouter('byTotalPrice', record)">{{ record.free_delivery }}</a>-->
<!--            </a-tooltip>-->
          </template>
          <template slot="canceled_orders" slot-scope="text ,record">
            <a-tooltip title="Отмененные заказы">
              <a style="color:blue" @click="TableItemOnclick('canceled_orders', record)">{{ record.canceled_orders }}</a>
            </a-tooltip>
          </template>
          <template slot="aggergattor" slot-scope="text ,record">
            <a-tooltip title="Агрегаторы">
              <a style="color:blue" @click="TableItemOnclick('aggergattor', record)">{{ record.aggregators }}</a>
            </a-tooltip>
          </template>
          <template slot="canceled_but_sold" slot-scope="text ,record">
            <a-tooltip title="canceled_but_sold">
              <a style="color:blue">{{ record.canceled_but_sold }}</a>
            </a-tooltip>
          </template>
          <template slot="reissued_order_count" slot-scope="text ,record">
            <a-tooltip :title="$t('reissued_order_count')+ ' '+ record.reissued_order_count">
              <a style="color:blue" @click="TableItemOnclick('reissued_order_count', record)">{{ record.reissued_order_count }} </a>
            </a-tooltip>
          </template>
        </a-table>
      </template>
    </div>
<!--      <orrder-table/>-->
    </a-card>
  </a-card>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { notification } from 'ant-design-vue'
// import notification from 'ant-design-vue/lib/notification'
// import { jsontoexcel } from 'vue-table-to-excel'
// import orrderTable from '@/views/reports/OrderListMainReport'
export default {
  data () {
    return {
      buttonLoading: false,
      current: ['mail'],
      excelUrl: '',
      newarray: [],
      reissuedordercount: false,
      open2: false,
      open1: false,
      aggregator: false,
      total_aggregator: false,
      data: false,
      delivery: false,
      self_pickup: false,
      free_delivery: false,
      canceled_orders: false,
      canceled_but_sold: false,
      given_cashback: false,
      byTotalPrice: false,
      byProductPrice: false,
      total_self_pickup: false,
      total_delivery: false,
      columns: [
        {
          slots: { title: 'ReportNumber' },
          scopedSlots: { customRender: 'name' },
          dataIndex: 'date',
          key: 'name',
          width: '10',
          align: 'center',
          name: 'Число',
          value: true,
        },
        {
          slots: { title: 'delevery' },
          scopedSlots: { customRender: 'del' },
          dataIndex: 'delivery',
          key: 'delivery',
          align: 'center',
          width: '10',
          name: 'Доставка',
          value: true
        },
        {
          slots: { title: 'byTotalPrice' },
          dataIndex: 'total_price',
          scopedSlots: { customRender: 'total_price' },
          key: 'total_price',
          width: '10',
          align: 'center',
          // width: '10%',
          name: 'По цене продукта',
          value: true
        },
        {
          slots: { title: 'byProductPrice' },
          scopedSlots: { customRender: 'product_price' },
          dataIndex: 'product_price',
          key: 'product_price',
          align: 'center',
          width: '10',
          name: 'По общей цене',
          value: true
        },
        {
          slots: { title: 'totalDelivery' },
          scopedSlots: { customRender: 'total_delivery' },
          align: 'center',
          key: 'total_delivery',
          name: 'Сумма доставка',
          width: '10',
          value: true
        },
        {
          slots: { title: 'totalPickup' },
          scopedSlots: { customRender: 'total_self_pickup' },
          align: 'center',
          key: 'total_self_pickup',
          name: 'Сумма самовывоз',
          width: '10',
          value: true
        },
        {
          slots: { title: 'totalAggregator' },
          scopedSlots: { customRender: 'total_aggregator' },
          align: 'center',
          key: 'total_aggregator',
          name: 'Сумма агрегаторы',
          width: '10',
          value: true
        },
        {
          slots: { title: 'pickup' },
          scopedSlots: { customRender: 'self_pickup' },
          // dataIndex: 'self_pickup',
          align: 'center',
          key: 'self_pickup',
          name: 'Самовывоз',
          width: '10',
          value: true
        },
        // {
        //   slots: { title: 'Order_count' },
        //   scopedSlots: { customRender: 'order_count' },
        //   dataIndex: 'order_count',
        //   key: 'order_count',
        //   name: 'Бесплатная доставка',
        //   value: true
        // },
        {
          slots: { title: 'aggregators' },
          scopedSlots: { customRender: 'aggergattor' },
          key: 'aggregators',
          align: 'center',
          name: 'Агрегаторы',
          value: true
        },
        {
          slots: { title: 'chargeDelivery' },
          scopedSlots: { customRender: 'free_delivery' },
          dataIndex: 'free_delivery',
          key: 'free_delivery',
          align: 'center',
          name: 'Бесплатная доставка',
          value: true
        },
        {
          slots: { title: 'cancelDorders' },
          scopedSlots: { customRender: 'canceled_orders' },
          dataIndex: 'canceled_orders',
          name: 'Отмененные заказы',
          align: 'center',
          value: true
        },
        {
          slots: { title: 'reissued_order_count' },
          scopedSlots: { customRender: 'reissued_order_count' },
          name: 'Повторно оформленные заказы',
          align: 'center',
          value: true
        },
        {
          slots: { title: 'awayCashback' },
          dataIndex: 'given_cashback',
          key: 'awayCashback',
          align: 'center',
          name: 'Отдано кэшбеков',
          value: true
        },
        {
          slots: { title: 'butSolt' },
          dataIndex: 'canceled_but_sold',
          // key: 'canceled_but_sold',
          name: 'Отменено но продано',
          align: 'center',
          value: true
        },
      ],
      title: true,
      params: {
        page: { page: 1, pageSiz: 10, totle: null },
        search: '',
        to_time: '',
        from_time: '',
        to_date: moment().format('YYYY-MM-DD'),
        from_date: this.format(),
        sort_by: '',
        sort_type: ''
      },
      loading: false,
      rules: {
        from_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
      }
    }
  },
  computed: {
...mapGetters(['paginationReportsMian', 'reporList']),
    getpagination () {
  return this.paginationReportsMian
    },
    getReportList () {
      console.log('this.reporList==>', this.reporList)
  return this.reporList
    },
    filteredCols () {
      return this.columns.filter(item => item.value)
    }
  },
  methods: {
    TableItemOnclick (colname, value) {
      const formDatas = value.date.length > 10 ? value.date.split('/')[0] : value.date
      const todata = value.date.length > 10 ? value.date.split('/')[1] : value.date
      const data = {
        fromData: this.params.from_time ? formDatas + ' ' + this.params.from_time : `${formDatas} 05:00:00`,
        toDate: this.params.to_time ? `${todata}` + this.params.to_time : moment(todata).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00'
      }
      this.$router.push({ name: 'OrderListMainReport', query: { colname: colname, from_date: data.fromData, to_date: data.toDate } })
    },
    dataTableTable (TablevalueItem) {
      this.$router.push({ name: 'OrderReport', query: { toDay: TablevalueItem.date } })
      console.log(TablevalueItem)
    },
    sortTableHearderIcons (colName) {
      switch (colName) {
        case 'date': this.data = !this.data
             return this.data
        case 'reissued_order_count': this.reissuedordercount = !this.reissuedordercount
              return this.reissuedordercount
        case 'delivery': this.delivery = !this.delivery
              return this.delivery
        case 'total_price': this.byTotalPrice = !this.byTotalPrice
              return this.byTotalPrice
        case 'product_price': this.byProductPrice = !this.byProductPrice
              return this.byProductPrice
        case 'self_pickup': this.self_pickup = !this.self_pickup
              return this.self_pickup
        case 'aggregator': this.aggregator = !this.aggregator
              return this.aggregator
        case 'free_delivery': this.free_delivery = !this.free_delivery
              return this.free_delivery
        case 'canceled_orders': this.canceled_orders = !this.canceled_orders
              return this.canceled_orders
        case 'given_cashback': this.given_cashback = !this.given_cashback
              return this.given_cashback
        case 'canceled_but_sold': this.canceled_but_sold = !this.canceled_but_sold
              return this.canceled_but_sold
        case 'total_self_pickup': this.total_self_pickup = !this.total_self_pickup
          return this.total_self_pickup
        case 'total_aggregator': this.total_aggregator = !this.total_aggregator
          return this.total_aggregator
        case 'total_delivery': this.total_delivery = !this.total_delivery
          return this.total_delivery
      }
    },
    SortInsideParamsSortType (colName) {
      this.params.sort_type = this.sortTableHearderIcons(colName) ? 'asc' : 'desc'
      this.params.sort_by = colName
    },
    ReportMainSortTableHeaderIcons (value) {
      this.SortInsideParamsSortType(value)
      this.AlldataGet()
    },
    handleChange (value) {
      console.log(value)
      console.log(this.columns)
      const item = this.columns.filter(el => el.name === value)[0]
      console.log(item)
      item.value = !item.value
      console.log(item)
    },
    customRowClik (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push({ name: 'OrderReport', query: { toDay: record.date } })
        }
                           }
                    }
    },
    AlldataGet () {
      console.log('params', this.params)
      this.loading = true
      this.$store.dispatch('getRepeortMainList', this.params)
        .finally(() => {
            this.loading = false
    })
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('ExcelMainReports', this.params)
      .then(res => {
        console.log(res)
        notification.success({
          message: this.$t('Курьер Excel файл готов'),
        })
        const elm = document.createElement('a')
        elm.setAttribute(
          'href',
          `${ res.url }`)
        elm.setAttribute('download', 'orderReport')
        elm.click()
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        this.buttonLoading = false
      })
      // jsontoexcel.getXlsx(this.reporList, Object.keys(this.reporList[0]), 'Общий отчет.xlsx')
    },
    handleClose (value) {
      console.log(value)
      this.open1 = false
      this.open2 = false
    },
    handleMenuClick ({ val, key, sel }) {
      console.log(val, key, sel)
      this.handleChange(key)
    },
    onSubmit () {
      this.loading = true
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.AlldataGet()
          } else {
            this.loading = false
            return false
          }
        })
    },
    resetForm () {
        this.$refs.ruleForm.resetFields()
    },
    format () {
     const dateFrom = moment().subtract(5, 'd').format('YYYY-MM-DD')
      return dateFrom
    },
    moment,
    onTableChange (pagination) {
      this.loading = true
        console.log(pagination)
        this.params.page.page = pagination.current
        this.$store.dispatch('getRepeortMainList', this.params)
      .finally(() => {
        this.loading = false
      })
    },
    onTimePicerTo (value, pageTime) {
      console.log(value)
      this.params.to_time = pageTime
      // eslint-disable-next-line no-unused-expressions
      this.params.from_time === '' ? '' : this.params.from_time
      this.onSubmit()
    },
    onTimePickerForm (value, pageTime) {
      this.params.from_time = pageTime
      console.log(value)
      // eslint-disable-next-line no-unused-expressions
     this.params.to_time === '' ? '' : this.params.to_time
      this.onSubmit()
    },
    onChangeFromDate (value, dateString) {
      this.newarrayDate = dateString
      this.params.from_date = dateString[0]
      this.params.to_date = dateString[1]
      if (dateString[0] === '' && dateString[1] === '') {
        this.params.to_date = moment().format('YYYY-MM-DD')
        this.params.from_date = this.format()
      }
      this.AlldataGet()
      console.log('val', value)
      console.log('date', dateString)
    },
    onChangeToDate (value, dateString) {
      this.params.to_date = dateString
      this.onSubmit(this.params)
    },
    onOk (value) {
        console.log('onOk: ', value)
    },

  },
  mounted () {
  this.AlldataGet()
    this.newarray = this.columns.map(e => e.name)
    console.log('format===>>>', this.format())
  },
  created () {
  }

}
</script>

<style scoped>
.classpointer {
  cursor: pointer;
}
.maindiv {
  border-radius:9px;
}
.margenLeft {
  margin-left: 15px;
}
.margenLeftTime {
  margin-left: 20px;
}
.margenLeftTimes {
  margin-left: -20px;
  margin-top: 3px;
}
.hovers:hover{
  color: #f5222d;
}
</style>
