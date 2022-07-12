<template>
  <div class="maindiv">
    <a-card class="maindiv">
<!--      <div slot="title">-->
<!--        <a-page-header>-->
<!--          {{ $t('courierReport') }}-->
<!--        </a-page-header>-->
<!--      </div>-->
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
                <a-form-model-item size="large" ref="to_time" prop="to_time">
                  <a-time-picker v-model="params.to_time" @change="onTimePicerTo" :open.sync="open2" placeholder="До времени" valueFormat="hh:mm:ss">
                    <a-button slot="addon" size="small" type="primary" @click="handleClose">
                      Ok
                    </a-button>
                  </a-time-picker>
                </a-form-model-item>
              </a-col>
              <a-col :xm="24" :md="6" class="margenLeftTimes">
<!--                Выбрать филиал-->
                <a-select style="width: 100%" @change="handleMenuClick" :placeholder="$t('seelctplaceholder')" >
                  <a-select-option v-for="(filayalname, index) in FilyalBranchlist" :key="index" :value="filayalname.id" :title="filayalname.name">
                  {{ filayalname.name }}
                  </a-select-option>
                </a-select>
<!--                <a-dropdown>-->
<!--                  <a-menu slot="overlay" @click="handleMenuClick">-->
<!--                    <a-menu-item v-for="(filayalname, index) in FilyalBranchlist " :key="index">-->
<!--&lt;!&ndash;                      <a-checkbox :checked="columns[index].value">&ndash;&gt;-->
<!--&lt;!&ndash;                      </a-checkbox>&ndash;&gt;-->
<!--                      <strong> {{ filayalname.name }}</strong>-->
<!--                    </a-menu-item>-->
<!--                  </a-menu>-->
<!--                  <a-button style="margin-left: 8px; color: #D9D9D9"> Выбрать филиал<a-icon type="down" /> </a-button>-->
<!--                </a-dropdown>-->
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div slot="extra">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ $t('courierReport') }} Скачать файл</span>
            </template>
            <a-button @click="downloadExcel"> <a-icon type="download" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
          </a-tooltip>
        </div>
        <div>
          <template>
            <a-table
              :rowKey="record => record.index"
              :columns="columns"
              :customRow="customRowClik"
              :data-source="getReportListCourier"
              :pagination="false"
              @change="onTableChange"
              :loading="loading"
              :scroll="{ x: 3600, y: 400 }"
              :bordered="true"
              style="cursor: pointer"

            >
                        <span slot="fullnamecourier" style="display: flex">
                                <span>{{ $t('fullnamecourier') }}</span>
                          <span style="margin-left: 10px">
                          <a-button @click="sortTableHeaderIcons('courier')" size="small" style="background-color: #FAFAFA">
                               <a-icon v-if="data" :component="$myIcon.bxicons1"></a-icon>
                               <a-icon v-if="!data" :component="$myIcon.bxicons2"></a-icon></a-button></span>
                            </span>
                        <span slot="numberorders" style="display: flex">
                             <span> {{ $t('numberorders') }} </span>
                          <span style="margin-left: 10px">   <a-button @click="sortTableHeaderIcons('order_count')" size="small" style="background-color: #FAFAFA">
                                    <a-icon v-if="delivery" :component="$myIcon.bxicons1"></a-icon>
                                     <a-icon v-if="!delivery" :component="$myIcon.bxicons2"></a-icon>
                                  </a-button>
                              </span>
                             </span>
                        <span slot="fullordersumm">
                             <span> {{ $t('fullordersumm') }} </span>
                                <span style="margin-left: 10px"> <a-button @click="sortTableHeaderIcons('total_price')" size="small" style="background-color: #FAFAFA">
                                    <a-icon v-if="maxDistance" :component="$myIcon.bxicons1"></a-icon>
                                     <a-icon v-if="!maxDistance" :component="$myIcon.bxicons2"></a-icon>
                                  </a-button>
                             </span>
                             </span>
                        <span slot="min_distance">
                             <span> {{ $t('min_distance') }} </span>
                          <span style="margin-left: 10px"><a-button @click="sortTableHeaderIcons('min_distance')" size="small" style="background-color: #FAFAFA">
                                    <a-icon v-if="maxDistance" :component="$myIcon.bxicons1"></a-icon>
                                     <a-icon v-if="!maxDistance" :component="$myIcon.bxicons2"></a-icon>
                                  </a-button>
                              </span>
                             </span>
                         <span slot="Среднее">

                          <span> {{ $t('Среднее') }} </span>
                          <span style="margin-left: 10px"><a-button @click="sortTableHeaderIcons('avg_distance')" size="small" style="background-color: #FAFAFA">
                                    <a-icon v-if="aggregator" :component="$myIcon.bxicons1"></a-icon>
                                    <a-icon v-if="!aggregator" :component="$myIcon.bxicons2"></a-icon>
                                  </a-button>
                                    </span>
                            </span>
                         <span slot="longest">
                          <span> {{ $t('longest') }} </span>
                          <span style="margin-left: 10px"> <a-button @click="sortTableHeaderIcons('max_distance')" size="small" style="background-color: #FAFAFA">
                               <a-icon v-if="self_pickup" :component="$myIcon.bxicons1"></a-icon>
                               <a-icon v-if="!self_pickup" :component="$myIcon.bxicons2"></a-icon></a-button>
                               </span>
                            </span>
                        <span slot="totaldringdistance">
                             <span> {{ $t('totaldringdistance') }} </span>
                                  <span style="margin-left: 10px"><a-button @click="sortTableHeaderIcons('total_distance')" size="small" style="background-color: #FAFAFA">
                                    <a-icon v-if="byProductPrice" :component="$myIcon.bxicons1"></a-icon>
                                     <a-icon v-if="!byProductPrice" :component="$myIcon.bxicons2"></a-icon>
                                  </a-button>
                              </span>
                             </span>
                        <span slot="Категория курьера">
                <span>{{ $t('Категория курьера') }}</span>
                                 <span style="margin-left: 10px"><a-button @click="sortTableHeaderIcons('free_delivery')" size="small" style="background-color: #FAFAFA">
                                 <a-icon v-if="free_delivery" :component="$myIcon.bxicons1"></a-icon>
                               <a-icon v-if="!free_delivery" :component="$myIcon.bxicons2"></a-icon>
                               </a-button>
                                   </span>
                              </span>
                        <span slot="Cost_delivery">
                          <span> {{ $t('Cost_delivery') }} </span>
                          <span style="margin-left: 10px"> <a-button @click="sortTableHeaderIcons('delivery_price')" size="small" style="background-color: #FAFAFA">
                                 <a-icon v-if="delivery_price" :component="$myIcon.bxicons1"></a-icon>
                               <a-icon v-if="!delivery_price" :component="$myIcon.bxicons2"></a-icon>
                               </a-button>
                              </span>
                        </span>
                         <span slot="delivery_time_min">
                             <span> {{ $t('delivery_time_min') }} </span>
                            <span style="margin-left: 10px"> <a-button @click="sortTableHeaderIcons('min_time')" size="small" style="background-color: #FAFAFA">
                                    <a-icon v-if="minTime" :component="$myIcon.bxicons1"></a-icon>
                                     <a-icon v-if="!minTime" :component="$myIcon.bxicons2"></a-icon>
                                  </a-button>
                               </span>
                             </span>
                        <span slot="totaltime">
                          <span>{{ $t('totaltime') }}</span>
                          <span style="margin-left: 10px"><a-button @click="sortTableHeaderIcons('total_time')" size="small" style="background-color: #FAFAFA">
                               <a-icon v-if="total_time" :component="$myIcon.bxicons1"></a-icon>
                               <a-icon v-if="!total_time" :component="$myIcon.bxicons2"></a-icon></a-button>
                              </span>
                            </span>
                        <span slot="delivery_time_longest">
                          <span> {{ $t('delivery_time_longest') }}</span>
                                <span style="margin-left: 10px">
                                  <a-button @click="sortTableHeaderIcons('max_time')" size="small" style="background-color: #FAFAFA">
                               <a-icon v-if="canceled_orders" :component="$myIcon.bxicons1"></a-icon>
                               <a-icon v-if="!canceled_orders" :component="$myIcon.bxicons2"></a-icon></a-button>
                              </span>
                            </span>
                         <span slot="Отмененные заказы">
                           <span>  {{ $t('Отмененные заказы') }} </span>
                           <span style="margin-left: 10px"> <a-button @click="sortTableHeaderIcons('canceled_orders_count')" size="small" style="background-color: #FAFAFA">
                               <a-icon v-if="canceled_orders_not" :component="$myIcon.bxicons1"></a-icon>
                               <a-icon v-if="!canceled_orders_not" :component="$myIcon.bxicons2"></a-icon></a-button>
                               </span>
                            </span>
                        <span slot="delivery_time_average">
                          <span> {{ $t('delivery_time_average') }} </span>
                          <span style="margin-left: 10px"> <a-button @click="sortTableHeaderIcons('avg_time')" size="small" style="background-color: #FAFAFA">
                            <a-icon v-if="given_cashback" :component="$myIcon.bxicons1"></a-icon>
                               <a-icon v-if="!given_cashback" :component="$myIcon.bxicons2"></a-icon>
                                </a-button>
                               </span>
                            </span>
                        <span slot="delivery_time_shortest">
                          <span>{{ $t('delivery_time_shortest') }} </span>
                          <span style="margin-left: 10px">  <a-button @click="sortTableHeaderIcons('canceled_but_sold')" size="small" style="background-color: #FAFAFA">
                                    <a-icon v-if="canceled_but_sold" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!canceled_but_sold" :component="$myIcon.bxicons2"></a-icon>
                                  </a-button>
                              </span>
                            </span>
              <template slot="courier" slot-scope="text ,record" class="classpointer">
<!--                <a-tooltip :title="$t('fullnamecourier')">-->
<!--                  <a style="color:black" @click="CourierName('courier', record)">-->
                 <p> <span v-if="record.courier">{{ record.courier.last_name }} {{ record.courier.first_name }}</span></p>
                  <p v-if="record.courier"><span>{{ record.courier.phone }}</span></p>
                  <span v-if="!record.courier">Итого</span>
<!--                  </a>-->
<!--                </a-tooltip>-->
              </template>
              <template slot="total_price" slot-scope="text ,record">
                  <a style="color:black">{{ record.total_price }}</a>
              </template>
              <template slot="total_distance" slot-scope="text" class="hovers">
<!--                <a-tooltip :title="$t('totaldringdistance')+ ' '+Math.trunc(text.total_distance)/1000 + ' км'">-->
                  <a style="color:black">{{ Math.trunc(text.total_distance) / 1000 }}{{ ' км' }}</a>
<!--                </a-tooltip>-->
              </template>
              <template slot="min_distance" slot-scope="text ,record">
<!--                <a-tooltip :title="$t('min_distance')+ ' '+Math.trunc(record.min_distance*10)/1000 + ' км'">-->
                  <a style="color: black"> <span>{{ Math.trunc(record.min_distance) / 1000 }} {{ 'км' }}</span> </a>
<!--                </a-tooltip>-->
              </template>
              <template slot="max_distance" slot-scope="text ,record">
<!--                <a-tooltip :title="$t('longest')+ ' '+Math.trunc(record.max_distance)/1000+ ' км'">-->
                  <a style="color:black">{{ Math.trunc(record.max_distance) / 1000 + ' км' }}</a>
<!--                </a-tooltip>-->
              </template>
              <template slot="avg_distance" slot-scope="text ,record">
<!--                <a-tooltip :title="$t('Среднее')+' '+ Math.trunc(record.avg_distance)/1000 + ' км'">-->
                  <a style="color:black">{{ Math.trunc(record.avg_distance) / 1000 }} {{ ' км' }}</a>
<!--                </a-tooltip>-->
              </template>
              <template slot="Категориякурьера" slot-scope="text ,record">
                <!--                <a-tooltip title="free_delivery">-->
                <!--                  <a style="color:black" @click="deliveryRouter('byTotalPrice', record)">{{ record.free_delivery }}</a>-->
                <span>{{ record.courier_type ? record.courier_type : '' }}</span>
                <!--                </a-tooltip>-->
              </template>
              <template slot="total_time" slot-scope="text ,record">
                <!--                <a-tooltip title="canceled_orders">-->
                <a style="color:black">{{ record.total_time }}</a>
                <!--                </a-tooltip>-->
              </template>
            </a-table>
          </template>
        </div>
      </a-card>
    </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
// import { jsontoexcel } from 'vue-table-to-excel'
import { notification } from 'ant-design-vue'
export default {
  data () {
    return {
      filayalId: '',
      current: ['mail'],
      newarray: [],
      open2: false,
      buttonLoading: false,
      delivery_price: false,
      open1: false,
      aggregator: false,
      data: false,
      minTime: false,
      delivery: false,
      self_pickup: false,
      free_delivery: false,
      canceled_orders: false,
      canceled_orders_not: false,
      canceled_but_sold: false,
      given_cashback: false,
      maxDistance: false,
      byProductPrice: false,
      total_time: false,
      columns: [
        {
          slots: { title: 'fullnamecourier' },
          scopedSlots: { customRender: 'courier' },
         width: '6%',
          key: 'name',
          name: 'Ф.И.О курьера',
          value: true,
        },
        {
          slots: { title: 'numberorders' },
          dataIndex: 'order_count',
          // key: 'order_count',
          name: 'Количество заказов',
          width: '7%',
          align: 'center'
        },
        {
          slots: { title: 'fullordersumm' },
          // dataIndex: 'total_price',
          scopedSlots: { customRender: 'total_price' },
          key: 'total_price',
          width: '7%',
          align: 'center',
          name: 'Сумма всех заказов',
        },
        {
           slots: { title: 'min_distance' },
          scopedSlots: { customRender: 'min_distance' },
           // dataIndex: 'min_distance',
           key: 'canceled_but_sold',
          width: '8%',
          align: 'center',
          name: 'Мин. Расстояние',
           value: true
         },
        {
          slots: { title: 'Среднее' },
          scopedSlots: { customRender: 'avg_distance' },
          // dataIndex: 'avg_distance',
          key: 'avg_distance',
          width: '5%',
          align: 'center',
          name: 'Среднее',
          value: true
        },
        {
          slots: { title: 'longest' },
          scopedSlots: { customRender: 'max_distance' },
          // dataIndex: 'self_pickup',
          key: 'max_distance',
          align: 'center',
          name: 'Самое длинное',
          width: '6%',
          value: true
        },

        {
          slots: { title: 'totaldringdistance' },
          scopedSlots: { customRender: 'total_distance' },
          key: 'total_distance',
          width: '9%',
          align: 'center',
          name: 'Общее расстояние пробега в (км)',
          value: true
        },
        {
          slots: { title: 'Категория курьера' },
          scopedSlots: { customRender: 'Категориякурьера' },
          key: 'Категориякурьера',
          align: 'center',
          width: '6%',
          name: 'Категория курьера',
          value: true
        },
        {
          slots: { title: 'Cost_delivery' },
          // scopedSlots: { customRender: 'delivery_price' },
          dataIndex: 'delivery_price',
          align: 'center',
          width: '7%',
          key: 'delivery_price',
          value: true
        },
        {
          slots: { title: 'delivery_time_longest' },
          dataIndex: 'total_time',
          key: 'total_time',
          align: 'center',
          width: '8%',
          name: 'Общее Время доставки (Самое длинное)',
          value: true
        },
        {
          slots: { title: 'totaltime' },
          dataIndex: 'max_time',
          align: 'center',
          width: '9%',
          name: 'Время доставки (Самое короткое)',
          value: true
        },
        {
          slots: { title: 'delivery_time_average' },
          dataIndex: 'avg_time',
          key: 'avg_time',
          align: 'center',
          width: '8%',
          name: 'Время доставки (Среднее)',
          value: true
        },
        {
          slots: { title: 'delivery_time_min' },
          dataIndex: 'min_time',
          key: 'min_time',
          align: 'center',
          width: '9%',
          name: 'Время доставки (мин)',
          value: true
        },
        {
          slots: { title: 'Отмененные заказы' },
          dataIndex: 'canceled_orders_count',
          key: 'canceled_orders_count',
          align: 'center',
          width: '6%',
          name: 'Время доставки (мин)',
          value: true
        },
      ],
      title: true,
      todaytime: moment(Date.now()).format('hh:mm:ss'),
      params: {
        page: { page: 1, pageSiz: 10, totle: null },
        to_date: moment().format('YYYY-MM-DD'),
        from_date: this.format(),
        branch_id: '',
        to_time: '',
        from_time: '',
        // date: moment().format('YYYY-MM-DD'),
        // date: '2021-06-30',
        sort_by: '',
        sort_type: ''
      },
      loading: false,
      rules: {
        to_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
        from_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
      }
    }
  },
  computed: {
    ...mapGetters(['paginationReportsMian', 'reporCourierList', 'FilyalBranchlist']),
    getpagination () {
      return this.paginationReportsMian
    },
    getReportListCourier () {
      return this.reporCourierList
    },
  },
  methods: {
    sortParmasInsidebyType (colname) {
      this.sortIcons(colname) ? this.params.sort_type = 'desc' : this.params.sort_type = 'asc'
    },
    sortTableHeaderIcons (colname) {
      this.sortParmasInsidebyType(colname)
      this.AlldataCourierGet()
    },
    sortIcons (colname) {
      switch (colname) {
        case 'courier': this.data = !this.data
          return this.data
        case 'order_count': this.delivery = !this.delivery
          return this.delivery
        case 'total_price': this.maxDistance = !this.maxDistance
          return this.maxDistance
        case 'min_distance': this.maxDistance = !this.maxDistance
          return this.maxDistance
        case 'avg_distance': this.aggregator = !this.aggregator
          return this.aggregator
        case 'max_distance': this.self_pickup = !this.self_pickup
          return this.self_pickup
        case 'total_distance': this.byProductPrice = !this.byProductPrice
          return this.byProductPrice
        case 'free_delivery': this.free_delivery = !this.free_delivery
          return this.free_delivery
        case 'delivery_price': this.delivery_price = !this.delivery_price
          return this.delivery_price
        case 'min_time': this.minTime = !this.minTime
          return this.minTime
        case 'total_time': this.total_time = !this.total_time
          return this.total_time
        case 'max_time': this.canceled_orders = !this.canceled_orders
          return this.canceled_orders
        case 'canceled_orders_count': this.canceled_orders_not = !this.canceled_orders_not
          return this.canceled_orders_not
        case 'avg_time': this.given_cashback = !this.given_cashback
          return this.given_cashback
        case 'canceled_but_sold': this.canceled_but_sold = !this.canceled_but_sold
          return this.canceled_but_sold
      }
    },
    BranchList () {
      this.loading = true
      this.$store.dispatch('BranchListGet')
        .then(res => {
          // console.log('branchList =>> ', res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    customRowClik (record) {
      const formDatas = this.params.from_date
      const todata = this.params.to_date
      // console.log(formDatas, todata)
      const data = {
        fromData: this.params.from_time ? formDatas + ' ' + this.params.from_time : `${formDatas} ' 05:00:00'`,
        toDate: this.params.to_time ? `${todata}` + ' ' + this.params.to_time : moment(todata).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00'
      }
      // console.log('data.FromData =>>>', data.toDate, data.fromData)

      return {
        on: {
          click: (event) => {
            this.$router.push({
              name: 'CourierReportListItem',
              query: { curier_id: record.courier.id, from_date: data.fromData, to_date: data.toDate }
            })
          }
        }
      }
    },
    AlldataCourierGet () {
      this.loading = true
      this.$store.dispatch('getRepeorCuriertMainList', this.params)
        .then(res => {
          console.log('res   =>>>>', res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('CourierReportExcelDowlonds', this.params)
        .then(res => {
          console.log(res)
          notification.success({
            message: this.$t('Отчет по курьерам Excel файл готов'),
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
      // const data = this.reporCourierList.map(el => ({ ...el, courier: el.courier ? el.courier.first_name : '' + ' ' + el.courier ? el.courier.last_name: '' }))
    },
    handleClose (value) {
      console.log(value)
      this.loading = false
      this.open1 = false
      this.open2 = false
    },
    handleMenuClick (val, key, sel) {
      this.loading = true
      this.params.branch_id = val
      this.AlldataCourierGet()
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.AlldataCourierGet()
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
      this.AlldataCourierGet()
    },
    onTimePicerTo (value, pageTime) {
      console.log(value)
      this.params.to_time = pageTime
      // eslint-disable-next-line no-unused-expressions
      this.params.from_time ?? ''
      this.onSubmit()
    },
    onTimePickerForm (value, pageTime) {
      this.params.from_time = pageTime
      console.log(value)
      // eslint-disable-next-line no-unused-expressions
      this.params.to_time ?? ''
      this.onSubmit()
    },
    onChangeFromDate (value, dateString) {
      this.newarrayDate = dateString
      console.log('dateString', dateString)
      this.params.from_date = dateString[0].length ? dateString[0] : this.format()
      this.params.to_date = dateString[1].length ? dateString[1] : moment().format('YYYY-MM-DD')
      this.AlldataCourierGet()
    },
    // onOk (value) {
    //   console.log('onOk: ', value)
    // },
  },
  mounted () {
    this.BranchList()
    this.AlldataCourierGet()
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
