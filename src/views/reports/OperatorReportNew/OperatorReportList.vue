<template>
  <div class="maindiv">
    <a-card class="maindiv">
      <div slot="title">
        <a-page-header>
        {{ $t('Операторы отчетов') }}
        </a-page-header>
      </div>
      <a-card :bordered="false">
        <div slot="title">
          <a-form-model :rules="rules" :model="params" ref="ruleForm">
            <a-row>
              <a-col :xm="24" :md="6" style="margin-top: 6px">
                <a-select allowClear @change="SelectChange" placeholder="Фильтр по">
                  <a-select-option v-for="(OpratorListName, index) in OpratorListNames " :value="OpratorListName.id" :key="index">
                    {{ OpratorListName.name }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :xm="24" :md="5" class="margenLeftTime">
                <a-range-picker :disabled-date="disabledDate" :disabled-time="disabledRangeTime" format="YYYY-MM-DD" @change="onChangeFromDate" style="margin-top: 5px" :placeholder="['От даты' ,'До даты']">
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
            </a-row>
          </a-form-model>
        </div>
        <div slot="extra">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ $t('Операторы отчетов') }} </span>
            </template>
            <a-button @click="downloadExcel"> <a-icon :type="buttonLoading ? 'loading' :'download'" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
          </a-tooltip>
        </div>
        <div>
          <template>
            <a-table
              :rowKey="() => Math.random()*100000+1"
              :columns="columns"
              :data-source="getOpratorReportList"
              :pagination="false"
              @change="onTableChange"
              :loading="loading"
              :scroll="{ x: 2100, y: 400 }"
              bordered
            >
              <span slot="ReportNumber">
                      <span>{{ $t('ReportNumber') }}</span>
                      <span style="margin-left: 10px">
                        <a-button @click="SortTableHeaderIcons('date')" size="small" style="background-color: #FAFAFA">
                     <a-icon v-if="data" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!data" :component="$myIcon.bxicons2"></a-icon></a-button>
                      </span>
                  </span>
              <span slot="delevery" style="display:flex;">
                  <span> {{ $t('Количество доставки') }} </span>
                        <span style="margin-left: 10px">
                        <a-button @click="SortTableHeaderIcons('delivery')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="delivery" :component="$myIcon.bxicons1"></a-icon>
                           <a-icon v-if="!delivery" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                           </span>
                   </span>
              <span slot="reissued_order_count">
                      <span>{{ $t('reissued_order_count') }}</span>
                      <span style="margin-left: 10px">
                        <a-button @click="SortTableHeaderIcons('reissued_order_count')" size="small" style="background-color: #FAFAFA">
                     <a-icon v-if="reissuedordercount" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!reissuedordercount" :component="$myIcon.bxicons2"></a-icon></a-button>
                      </span>
                  </span>
              <span slot="byTotalPrice">
                  <span>  {{ $t('Общая сумма') }}</span>

                       <span style="margin-left: 10px"> <a-button @click="SortTableHeaderIcons('total_price')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="byTotalPrice" :component="$myIcon.bxicons1"></a-icon>
                           <a-icon v-if="!byTotalPrice" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                         </span>
                   </span>
              <span slot="byProductPrice">
                    <span>{{ $t('Сумма продукта') }}</span>
                       <span style="margin-left: 10px"> <a-button @click="SortTableHeaderIcons('product_price')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="byProductPrice" :component="$myIcon.bxicons1"></a-icon>
                           <a-icon v-if="!byProductPrice" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                         </span>
                   </span>
              <span slot="bySelfPickup">
                    <span>{{ $t('Сумма самовывоза') }}</span>
                       <span style="margin-left: 10px"> <a-button @click="SortTableHeaderIcons('total_self_pickup')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="bySelfPickup" :component="$myIcon.bxicons1"></a-icon>
                           <a-icon v-if="!bySelfPickup" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                         </span>
                   </span>
              <span slot="totalDelivery">
                    <span>{{ $t('Сумма доставки') }}</span>
                       <span style="margin-left: 10px"> <a-button @click="SortTableHeaderIcons('total_delivery')" size="small" style="background-color: #FAFAFA">
                          <a-icon v-if="totalDelivery" :component="$myIcon.bxicons1"></a-icon>
                           <a-icon v-if="!totalDelivery" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                         </span>
                   </span>
              <span slot="pickup">
                    <span> {{ $t('Количество самовывоза') }}</span>

                     <span style="margin-left: 10px">
                       <a-button @click="SortTableHeaderIcons('self_pickup')" size="small" style="background-color: #FAFAFA">
                     <a-icon v-if="self_pickup" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!self_pickup" :component="$myIcon.bxicons2"></a-icon></a-button>
                     </span>

                  </span>
              <span slot="chargeDelivery">
                    <span>{{ $t('Общее количество') }}</span>
                    <span style="margin-left: 10px"><a-button @click="SortTableHeaderIcons('free_delivery')" size="small" style="background-color: #FAFAFA">
                       <a-icon v-if="free_delivery" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!free_delivery" :component="$myIcon.bxicons2"></a-icon>
                     </a-button>
                   </span>
                  </span>
                   <span slot="aggregators">
                    <span>{{ $t('Агрегаторы') }}</span>
                    <span style="margin-left: 10px"><a-button @click="SortTableHeaderIcons('aggregators')" size="small" style="background-color: #FAFAFA">
                       <a-icon v-if="aggregators" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!aggregators" :component="$myIcon.bxicons2"></a-icon>
                     </a-button>
                   </span>
                  </span>
                   <span slot="awayCashback">
                    <span>{{ $t('Отдано кэшбеков') }}</span>
                    <span style="margin-left: 10px"><a-button @click="SortTableHeaderIcons('awayCashback')" size="small" style="background-color: #FAFAFA">
                       <a-icon v-if="awayCashback" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!awayCashback" :component="$myIcon.bxicons2"></a-icon>
                     </a-button>
                   </span>
                  </span>
                  <span slot="butSolt">
                    <span>{{ $t('Отменено но продано') }}</span>
                    <span style="margin-left: 10px"><a-button @click="SortTableHeaderIcons('butSolt')" size="small" style="background-color: #FAFAFA">
                       <a-icon v-if="butSolt" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!butSolt" :component="$myIcon.bxicons2"></a-icon>
                     </a-button>
                   </span>
                  </span>
              <span slot="cancelDorders">
                    <span>{{ $t('cancelDorders') }}</span>
                    <span style="margin-left: 10px"><a-button @click="SortTableHeaderIcons('canceled_orders')" size="small" style="background-color: #FAFAFA">
                     <a-icon v-if="canceled_orders" :component="$myIcon.bxicons1"></a-icon>
                     <a-icon v-if="!canceled_orders" :component="$myIcon.bxicons2"></a-icon></a-button>
                     </span>
                  </span>
              <template slot="name" slot-scope="text, record">
                <!--            <a v-if="record.date.length > 10">Итого</a> <br>-->
                <a-tooltip :title="record.date.length > 10 ? 'Итого' :'Число' + ' '+ record.date ">
                  <a @click="dataTableTable(record)">{{ record.date.length > 10 ? 'Итого' : record.date }} {{ record.data }}</a>
                </a-tooltip>
              </template>
              <template slot="delevery" slot-scope="text ,record">
                <a-tooltip :title=" record.delivery ? 'Доставка'+ ' ' + record.delivery : ''">
                  <a style="color:blue" @click="deliveryRouter('delivery', record)">{{ record.delivery }}</a>
                </a-tooltip>
              </template>
              <template slot="self_pickup" slot-scope="text ,record" class="hovers">
                <a-tooltip :title=" text.self_pickup? 'Самовывоз' + ' '+text.self_pickup : ''">
                  <a style="color:blue" @click="deliveryRouter('self-pickup', record)">{{ text.self_pickup }}</a>
                </a-tooltip>
              </template>
              <template slot="total_price" slot-scope="text ,record">
                <a-tooltip :title=" record.total_price ? 'По общей цене'+ ' '+new Intl.NumberFormat().format(record.total_price) : ''">
                  <a style="color:blue" @click="deliveryRouter('byTotalPrice', record)">{{ new Intl.NumberFormat().format(record.total_price) }}</a>
                </a-tooltip>
              </template>
              <template slot="product_price" slot-scope="text ,record">
                <a-tooltip :title=" record.product_price ? 'По цене продукта'+ ' ' + new Intl.NumberFormat().format(record.product_price): ''">
                  <a style="color:blue" @click="deliveryRouter('byTotalPrice', record)">{{ new Intl.NumberFormat().format(record.product_price) }}</a>
                </a-tooltip>
              </template>
              <template slot="total_self_pickup" slot-scope="text ,record">
                <a-tooltip :title=" record.total_self_pickup ? 'По цене продукта'+ ' ' + new Intl.NumberFormat().format(record.total_self_pickup): ''">
                  <a style="color:blue" @click="deliveryRouter('byTotalPrice', record)">{{ new Intl.NumberFormat().format(record.total_self_pickup) }}</a>
                </a-tooltip>
              </template>
              <template slot="total_delivery" slot-scope="text ,record">
                <a-tooltip :title=" record.total_delivery ? 'По цене продукта'+ ' ' + new Intl.NumberFormat().format(record.total_delivery): ''">
                  <a style="color:blue" @click="deliveryRouter('byTotalPrice', record)">{{ new Intl.NumberFormat().format(record.total_delivery) }}</a>
                </a-tooltip>
              </template>
              <template slot="order_count" slot-scope="text, record">
                <a-tooltip title="order_count">
                  <a style="color:blue" @click="dataTableTable(record)">{{ record.order_count }}</a>
                </a-tooltip>
              </template>
              <template slot="canceled_orders" slot-scope="text ,record">
                <a-tooltip title="Отмененные заказы">
                  <a style="color:blue" @click="deliveryRouter('canceled_orders', record)">{{ record.canceled_orders }}</a>
                </a-tooltip>
              </template>
              <template slot="reissued_order_count" slot-scope="text ,record">
                <a-tooltip :title="$t('reissued_order_count')+ ' '+ record.reissued_order_count">
                  <a style="color:blue" @click="deliveryRouter('reissued_order_count', record)">{{ record.reissued_order_count }} </a>
                </a-tooltip>
              </template>
              <template slot="aggregators" slot-scope="text ,record">
                <a-tooltip :title="$t('aggregators')+ ' '+ record.aggregators">
                  <a style="color:blue" @click="deliveryRouter('aggregators', record)">{{ record.aggregators }} </a>
                </a-tooltip>
              </template>
              <template slot="given_cashback" slot-scope="text ,record">
                <a-tooltip :title="$t('given_cashback')+ ' '+ record.given_cashback">
                  <a style="color:blue" @click="deliveryRouter('given_cashback', record)">{{ record.given_cashback }} </a>
                </a-tooltip>
              </template>
              <template slot="canceled_but_sold" slot-scope="text ,record">
                <a-tooltip :title="$t('canceled_but_sold')+ ' '+ record.canceled_but_sold">
                  <a style="color:blue" @click="deliveryRouter('canceled_but_sold', record)">{{ record.canceled_but_sold }} </a>
                </a-tooltip>
              </template>
            </a-table>
          </template>
        </div>
      </a-card>
    </a-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
// import { jsontoexcel } from 'vue-table-to-excel'
import { notification } from 'ant-design-vue'
export default {
  data () {
    return {
      buttonLoading: false,
      newarray: [],
      reissuedordercount: false,
      open2: false,
      open1: false,
      aggregator: false,
      data: false,
      delivery: false,
      self_pickup: false,
      free_delivery: false,
      canceled_orders: false,
      canceled_but_sold: false,
      given_cashback: false,
      byTotalPrice: false,
      byProductPrice: false,
      bySelfPickup: false,
      totalDelivery: false,
      aggregators: false,
      awayCashback: false,
      butSolt: false,
      columns: [
        {
          slots: { title: 'ReportNumber' },
          scopedSlots: { customRender: 'name' },
          key: 'name',
          width: '180px',
          align: 'center',
        },
        {
          slots: { title: 'delevery' },
          scopedSlots: { customRender: 'delevery' },
          key: 'delivery',
          align: 'center',
          width: '200px',
        },
        {
          slots: { title: 'pickup' },
          scopedSlots: { customRender: 'self_pickup' },
          // dataIndex: 'self_pickup',
          align: 'center',
          key: 'self_pickup',
          width: '240px',
        },
        {
          slots: { title: 'byTotalPrice' },
          scopedSlots: { customRender: 'total_price' },
          key: 'total_price',
          width: '230px',
          align: 'center',
        },
        {
          slots: { title: 'byProductPrice' },
          scopedSlots: { customRender: 'product_price' },
          key: 'product_price',
          align: 'center',
          width: '200px',
        },
        {
          slots: { title: 'bySelfPickup' },
          scopedSlots: { customRender: 'total_self_pickup' },
          key: 'total_self_pickup',
          align: 'center',
          width: '230px',
        },
        {
          slots: { title: 'totalDelivery' },
          scopedSlots: { customRender: 'total_delivery' },
          key: 'total_delivery',
          align: 'center',
          width: '200px',
        },
        {
          slots: { title: 'chargeDelivery' },
          scopedSlots: { customRender: 'order_count' },
          width: '200px',
          key: 'total_count',
          align: 'center',
        },
        {
          slots: { title: 'cancelDorders' },
          scopedSlots: { customRender: 'canceled_orders' },
          // dataIndex: 'canceled_orders',
          width: '230px',
          align: 'center',
        },
         {
          slots: { title: 'aggregators' },
          scopedSlots: { customRender: 'aggregators' },
          // dataIndex: 'canceled_orders',
          width: '200px',
          align: 'center',
        },
        {
          slots: { title: 'reissued_order_count' },
          scopedSlots: { customRender: 'reissued_order_count' },
          width: '230px',
          align: 'center',
        },
          {
          slots: { title: 'awayCashback' },
          scopedSlots: { customRender: 'given_cashback' },
          width: '200px',
          align: 'center',
        },
        {
          slots: { title: 'butSolt' },
          scopedSlots: { customRender: 'canceled_but_sold' },
          width: '230px',
          align: 'center',
        },
      ],
      title: true,
      todaytime: moment(Date.now()).format('hh:mm:ss'),
      params: {
        page: { page: 1, pageSiz: 10, totle: null },
        to_time: '',
        from_time: '',
        to_date: moment().format('YYYY-MM-DD'),
        from_date: this.format(),
        sort_by: '',
        sort_type: '',
        operator_id: ''
      },
      loading: false,
      rules: {
        to_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
        from_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
      }
    }
  },
  computed: {
    ...mapGetters(['paginationReportsMian', 'reporList', 'OpratorListNames', 'OperatorListAll']),
    getpagination () {
      return this.paginationReportsMian
    },
    getOpratorReportList () {
      return this.OperatorListAll || []
    }
  },
  methods: {
    moment,
    disabledDate: (current) => {
      return current && current < moment('20200101', 'YYYYMMDD').startOf('day')
    },
    SelectChange (e) {
      this.params.operator_id = e
      this.loading = true
      this.GetAllOpratorListName(this.params)
      .finally(() => {
        this.loading = false
      })
    },
    deliveryRouter (type, value) {
      const formDatas = value.date.length > 10 ? value.date.split('/')[0] : value.date
      const todata = value.date.length > 10 ? value.date.split('/')[1] : value.date
      // console.log(formDatas, todata)
      const data = {
        fromData: this.params.from_time ? formDatas + ' ' + this.params.from_time : `${formDatas} 05:00:00`,
        toDate: this.params.to_time ? `${todata}` + ' ' + this.params.to_time : moment(todata).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00',
        operatorId: this.params.operator_id ? this.params.operator_id : JSON.parse(localStorage.getItem('user_id'))
      }
      this.$router.push({ name: 'OperatorReportItem', query: { colname: type, form_date: data.fromData, to_date: data.toDate, operatorId: data.operatorId } })
    },
    dataTableTable (TablevalueItem) {
      // const operatorId = TablevalueItem.id ? TablevalueItem.id : JSON.parse(localStorage.getItem('user_id'))
      const opratorId = this.params.operator_id ? this.params.operator_id : JSON.parse(localStorage.getItem('user_id'))
      this.$router.push({ name: 'OperatorReportItem', query: { form_date: TablevalueItem.date + ' ' + '05:00:00', to_date: moment(TablevalueItem.date).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00', operatorId: opratorId } })
      console.log(TablevalueItem)
    },
    GetAllOperatorListNames () {
      this.loading = true
      this.GetAllOpratorListName(this.params)
        .finally(() => {
          this.loading = false
        })
    },
    sortType (colname) {
     switch (colname) {
        case 'date': this.data = !this.data
          return this.data
        case 'delivery' : this.delivery = !this.delivery
          return this.delivery
        case 'reissued_order_count' : this.reissuedordercount = !this.reissuedordercount
          return this.reissuedordercount
        case 'total_price' : this.byTotalPrice = !this.byTotalPrice
          return this.byTotalPrice
        case 'product_price' : this.byProductPrice = !this.byProductPrice
           return this.byProductPrice
        case 'total_self_pickup' : this.bySelfPickup = !this.bySelfPickup
           return this.bySelfPickup
        case 'total_delivery' : this.totalDelivery = !this.totalDelivery
           return this.totalDelivery
        case 'self_pickup' : this.self_pickup = !this.self_pickup
          return this.self_pickup
        case 'free_delivery': this.free_delivery = !this.free_delivery
          return this.free_delivery
        case 'canceled_orders' : this.canceled_orders = !this.canceled_orders
          return this.canceled_orders
        case 'aggregators' : this.aggregators = !this.aggregators
          return this.aggregators
        case 'awayCashback' : this.awayCashback = !this.awayCashback
          return this.awayCashback
        case 'butSolt' : this.butSolt = !this.butSolt
          return this.butSolt
      }
    },
    ParamsInsideSortType (value) {
      this.sortType(value) ? this.params.sort_type = 'asc' : this.params.sort_type = 'desc'
      this.params.sort_by = value
    },
    SortTableHeaderIcons (value) {
      this.ParamsInsideSortType(value)
      this.GetAllOperatorListNames()
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('ReportOperatorExcel', this.params)
        .then(res => {
          console.log(res)
          notification.success({
            message: this.$t('Оператор Excel файл готов'),
          })
          const elm = document.createElement('a')
          elm.setAttribute(
            'href',
            `${ res.url }`)
          elm.setAttribute('download', 'opratro')
          elm.click()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.buttonLoading = false
        })
    },
    handleClose (value) {
      console.log(value)
      this.open1 = false
      this.open2 = false
    },
    onSubmit () {
      this.loading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // this.loading = !this.loading
          this.GetAllOpratorListName(this.params).finally(() => {
            // this.loading = !this.loading
            this.loading = false
          })
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
    onTableChange (pagination) {
      this.loading = true
      console.log(pagination)
      this.params.page.page = pagination.current
      // this.$store.dispatch('getRepeortMainList', this.params)
      //   .finally(() => {
      //     this.loading = false
      //   })
    },
    onTimePicerTo (value, pageTime) {
      console.log(value, pageTime)
      this.params.to_time = pageTime
      // eslint-disable-next-line no-unused-expressions
      this.params.from_time === undefined ? undefined : this.params.from_time
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
      this.GetAllOpratorListName(this.params)
    },
    onChangeToDate (value, dateString) {
      this.params.to_date = dateString
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
      this.onSubmit(this.params)
    },
    onOk (value) {
      console.log('onOk: ', value)
    },
   ...mapActions(['OpratorListName', 'GetAllOpratorListName'])
  },
  mounted () {
   this.GetAllOperatorListNames()
  },
  created () {
    this.OpratorListName()
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
