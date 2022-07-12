<template>
  <div class="maindiv">
    <a-card class="maindiv">
      <a-card :bordered="false">
        <div slot="title">
          <a-form-model :rules="rules" :model="params" ref="ruleForm">
            <a-row>
              <a-col :xm="24" :md="5">
                <a-range-picker
                  :default-value="[params.from_date, params.to_date]"
                  allowClear
                  @change="onChangeFromDate"
                  style="margin-top: 5px"
                  :placeholder="['От даты', 'До даты']"
                >
                </a-range-picker>
              </a-col>
              <a-col :xm="24" :md="3" class="margenLeftTime">
                <a-form-model-item ref="from_time" prop="from_time">
                  <a-time-picker
                    v-model="params.from_time"
                    @change="onTimePickerForm"
                    :open.sync="open1"
                    placeholder="От времени"
                    valueFormat="hh:mm:ss"
                  >
                    <a-button slot="addon" size="small" type="primary" @click="handleClose">
                      Ok
                    </a-button>
                  </a-time-picker>
                </a-form-model-item>
              </a-col>
              <a-col :xm="24" :md="4" class="margenLeftTime">
                <a-form-model-item size="large" ref="to_time" prop="to_time">
                  <a-time-picker
                    v-model="params.to_time"
                    @change="onTimePicerTo"
                    :open.sync="open2"
                    placeholder="До времени"
                    valueFormat="hh:mm:ss"
                  >
                    <a-button slot="addon" size="small" type="primary" @click="handleClose">
                      Ok
                    </a-button>
                  </a-time-picker>
                </a-form-model-item>
              </a-col>
              <a-col :xm="24" :md="6" class="margenLeftTimes">
                <a-select allowClear v-model="params.courier_id" style="width: 100%" @change="handleMenuClick" :placeholder="$t('seelctplaceholder')">
                  <a-select-option
                    v-for="(courier, index) in courierList"
                    :key="index"
                    :value="courier.id"
                    :title="courier.name"
                  >
                    {{ courier.first_name }} {{ courier.last_name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div slot="extra">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ $t('courierReport') }}</span>
            </template>
            <a-button @click="downloadExcel">
              <a-icon type="download" style="color: blue; font-size: 1.1rem; background-color: "></a-icon
            ></a-button>
          </a-tooltip>
        </div>
        <div>
          <div style="float: right">
            <a-tag color="blue" style="padding: 7px">
              <span style="padding: 5px">Нравится проц</span> :
              <span>{{ likes_percent+' %' }}</span></a-tag>
           <a-tag color="red" style="padding: 7px">
             <span style="padding: 5px">Процент не нравится</span> :
             <span>{{ dislikes_percent+' %' }}</span></a-tag>
          </div>
          <br>
          <hr style="margin-top: 20px">
          <br>
          <template>
            <a-table
              :rowKey="record => record.index"
              :columns="columns"
              :customRow="customRowClik"
              :data-source="courierReportList"
              :pagination="true"
              :loading="loading"
              :scroll="{ x: 1900, y: 600 }"
              :bordered="true"
              style="cursor: pointer"
            >
              <span slot="ReportNumber" style="display: flex">
                <span>{{ $t('ReportNumber') }}</span>
                <span style="margin-left: 10px">
                  <a-button @click="sortTableHearderIcons('date')" size="small" style="background-color: #FAFAFA">
                    <a-icon v-if="data" :component="$myIcon.bxicons1"></a-icon>
                    <a-icon v-if="!data" :component="$myIcon.bxicons2"></a-icon></a-button
                ></span>
              </span>
              <span slot="Доставка">
                <span> {{ $t('Доставка') }} </span>
                <span style="margin-left: 10px"
                ><a-button @click="sortTableHearderIcons('order_count')" size="small" style="background-color: #FAFAFA">
                    <a-icon v-if="order_count" :component="$myIcon.bxicons1"></a-icon>
                    <a-icon v-if="!order_count" :component="$myIcon.bxicons2"></a-icon>
                  </a-button>
                </span>
              </span>
              <span slot="courierFullSum" style="display: flex">
                <span> {{ $t('courierFullSum') }} </span>
                <span style="margin-left: 10px">
                  <a-button @click="sortTableHearderIcons('orders_price')" size="small" style="background-color: #FAFAFA">
                    <a-icon v-if="orders_price" :component="$myIcon.bxicons1"></a-icon>
                    <a-icon v-if="!orders_price" :component="$myIcon.bxicons2"></a-icon>
                  </a-button>
                </span>
              </span>
              <span slot="Общий километраж">
                <span> {{ $t('Общий километраж') }} </span>
                <span style="margin-left: 10px">
                  <a-button @click="sortTableHearderIcons('total_distance')" size="small" style="background-color: #FAFAFA">
                    <a-icon v-if="total_distance" :component="$myIcon.bxicons1"></a-icon>
                    <a-icon v-if="!total_distance" :component="$myIcon.bxicons2"></a-icon>
                  </a-button>
                </span>
              </span>
              <span slot="Среднее расстояние">
                <span> {{ $t('Среднее расстояние') }} </span>
                <span style="margin-left: 10px"
                  ><a-button @click="sortTableHearderIcons('avg_distance')" size="small" style="background-color: #FAFAFA">
                    <a-icon v-if="avg_distance" :component="$myIcon.bxicons1"></a-icon>
                    <a-icon v-if="!avg_distance" :component="$myIcon.bxicons2"></a-icon>
                  </a-button>
                </span>
              </span>
              <span slot="Общее время доставки">
                <span> {{ $t('Общее время доставки') }} </span>
                <span style="margin-left: 10px"
                  ><a-button @click="sortTableHearderIcons('total_time')" size="small" style="background-color: #FAFAFA">
                    <a-icon v-if="total_time" :component="$myIcon.bxicons1"></a-icon>
                    <a-icon v-if="!total_time" :component="$myIcon.bxicons2"></a-icon>
                  </a-button>
                </span>
              </span>
              <span slot="Среднее время доставки">
                <span> {{ $t('Среднее время доставки') }} </span>
                <span style="margin-left: 10px">
                  <a-button @click="sortTableHearderIcons('avg_time')" size="small" style="background-color: #FAFAFA">
                    <a-icon v-if="avg_time" :component="$myIcon.bxicons1"></a-icon>
                    <a-icon v-if="!avg_time" :component="$myIcon.bxicons2"></a-icon
                  ></a-button>
                </span>
              </span>
              <span slot="Время начала работы">
                <span> {{ $t('Время начала работы') }} </span>
                <span style="margin-left: 10px">
                  <a-button @click="sortTableHearderIcons('attendance_time')" size="small" style="background-color: #FAFAFA">
                    <a-icon v-if="attendance_time" :component="$myIcon.bxicons1"></a-icon>
                    <a-icon v-if="!attendance_time" :component="$myIcon.bxicons2"></a-icon
                  ></a-button>
                </span>
              </span>
              <template slot="ReportNumber" slot-scope="text, record" class="classpointer">

                  <span style="color:blue">{{ record.date }}</span>
<!--                <span v-if="!record.courier">Итого</span>-->
              </template>
              <template slot="orders_price" slot-scope="text, record">
                <a style="color:blue">{{ record.orders_price }}</a>
              </template>
              <template slot="order_count" slot-scope="text, record">
                <a style="color:blue">{{ record.order_count }}</a>
              </template>
              <template slot="total_distance" slot-scope="text" class="hovers">
                <a style="color:blue">{{ Math.trunc(text.total_distance) / 1000 }}{{ ' км' }}</a>
              </template>
              <template slot="total_time" slot-scope="text, record">
                  <span style="color:blue">{{ record.total_time }}</span>
              </template>
              <template slot="avg_distance" slot-scope="text, record">
                <a style="color:blue">{{ Math.trunc(record.avg_distance) / 1000 }} {{ ' км' }}</a>
              </template>
              <template slot="Среднее время доставки" slot-scope="text, record">
                <span style="color:blue">{{ record.avg_time }}</span>
              </template>
              <template slot="attendance_time" slot-scope="text, record">
                <span style="color:blue">{{ record.attendance_time || '---' }}</span>
              </template>
            </a-table>
          </template>
        </div>
      </a-card>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
// import { jsontoexcel } from 'vue-table-to-excel'
import { mapActions } from 'vuex'
import { notification } from 'ant-design-vue'
export default {
  data () {
    return {
      filayalId: '',
      current: ['mail'],
      newarray: [],
      buttonLoading: false,
      dislikes_percent: '',
      likes_percent: '',
      open2: false,
      open1: false,
      total_distance: false,
      data: false,
      minTime: false,
      orders_price: false,
      avg_time: false,
      attendance_time: false,
      avg_distance: false,
      order_count: false,
      total_time: false,
      columns: [
        {
          slots: { title: 'ReportNumber' },
          scopedSlots: { customRender: 'ReportNumber' },
          width: '6%',
          key: 'name',
          value: true
        },
        {
          slots: { title: 'Доставка' },
          scopedSlots: { customRender: 'order_count' },
          width: '6%',
          key: 'order_count',
          align: 'center',
          value: true
        },
        {
          slots: { title: 'courierFullSum' },
          // dataIndex: 'total_price',
          scopedSlots: { customRender: 'orders_price' },
          key: 'orders_price',
          width: '7%',
          align: 'center',
          name: 'Сумма всех заказов'
        },
        {
          slots: { title: 'Общий километраж' },
          scopedSlots: { customRender: 'total_distance' },
          // dataIndex: 'min_distance',
          key: 'canceled_but_sold',
          width: '8%',
          align: 'center',
        },
        {
          slots: { title: 'Среднее расстояние' },
          scopedSlots: { customRender: 'avg_distance' },
          // dataIndex: 'avg_distance',
          key: 'avg_distance',
          width: '5%',
          align: 'center',
          name: 'Среднее',
          value: true
        },
        {
          slots: { title: 'Общее время доставки' },
          scopedSlots: { customRender: 'total_time' },
          // dataIndex: 'self_pickup',
          key: 'max_distance',
          align: 'center',
          name: 'Самое длинное',
          width: '6%',
          value: true
        },
        {
          slots: { title: 'Среднее время доставки' },
          scopedSlots: { customRender: 'Среднее время доставки' },
          key: 'Среднее время доставки',
          align: 'center',
          width: '6%',
        },
        {
          slots: { title: 'Время начала работы' },
          scopedSlots: { customRender: 'attendance_time' },
          key: 'Время начала работы',
          align: 'center',
          width: '6%',
        },
      ],
      title: true,
      todaytime: moment(Date.now()).format('hh:mm:ss'),
      params: {
        // page: { current: 1, pageSiz: 10, totle: null },
        to_date: moment().format('YYYY-MM-DD'),
        from_date: this.format(),
        courier_id: '',
        to_time: '',
        from_time: '',
        sort_by: '',
        sort_type: ''
      },
      loading: false,
      rules: {
        to_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
        from_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }]
      },
      courierReportList: [],
      courierList: []
    }
  },
  methods: {
    ...mapActions(['getCourierOrderReport']),
    getCouriersList () {
      this.loading = true
      this.$store.dispatch('getCouriersList', { limit: 1000 })
        .then(res => {
            this.courierList = res.couriers
          this.params.courier_id = res.couriers[0].id
          this.$router.push({ name: this.$route.name, query: { courier_id: res.couriers[0].id } })
         this.getCourietRepoartItem()
        }).finally(() => {
          this.loading = false
      })
    },
    sortIcons (type) {
      switch (type) {
        case 'date': this.data = !this.data
              return this.data
        case 'order_count' : this.order_count = !this.order_count
              return this.order_count
        case 'orders_price' : this.orders_price = !this.orders_price
          return this.orders_price
        case 'total_price' : this.total_distance = !this.total_distance
          return this.total_distance
        case 'total_distance' : this.avg_time = !this.avg_time
          return this.avg_time
        case 'avg_time' : this.avg_time = !this.avg_time
          return this.avg_time
        case 'avg_distance' : this.avg_distance = !this.avg_distance
          return this.avg_distance
        case 'attendance_time' : this.attendance_time = !this.attendance_time
          return this.attendance_time
      }
    },
    getCourietRepoartItem () {
      this.loading = true
      this.getCourierOrderReport(this.params)
        .then(res => {
          this.courierReportList = res.reports
          this.dislikes_percent = res.dislikes_percent
          this.likes_percent = res.likes_percent
        })
        .catch(error => {
          console.log(error)
          this.courierReportList = []
        })
        .finally(() => {
          this.loading = false
        })
    },
    sortParmasInsidebyType (value) {
      this.sortIcons(value) ? this.params.sort_type = 'desc' : this.params.sort_type = 'asc'
      this.params.sort_by = value
    },
    sortTableHearderIcons (value) {
      this.sortParmasInsidebyType(value)
      this.getCourietRepoartItem()
    },
    customRowClik (record) {
      let data
      record.date === 'Итого' ? data = {
          fromData: this.params.from_time ? this.params.from_date + ' ' + this.params.from_time : this.params.from_date + ' 05:00:00',
          toDate: this.params.to_time ? this.params.to_date + ' ' + this.params.to_time : moment(this.params.to_date).add('days', 1).format('YYYY-MM-DD') + ' 05:00:00',
          courier_id: this.params.courier_id
        }
       : data = {
          fromData: this.params.from_time ? record.date + ' ' + this.params.from_time : `${record.date} '05:00:00'`,
          toDate: this.params.to_time ? moment(record.date).add('days', 1).format('YYYY-MM-DD') + ' ' + this.params.to_time : moment(record.date).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00',
          courier_id: this.params.courier_id
        }
      // console.log('data.FromData =>>>', data.toDate, data.fromData)

      return {
        on: {
          click: event => {
            this.$router.push({
              name: 'OrderReport',
              query: { start_date: data.fromData, end_date: data.toDate, courier_id: data.courier_id, delivery_type: 'delivery', activTab: '4' }
            })
          }
        }
      }
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('CourierTabsReportExcelDowlonds', this.params)
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
      this.params.courier_id = val
      this.$router.push({ name: this.$route.name, query: { courier_id: val } })
      this.getCourietRepoartItem()
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.getCourietRepoartItem()
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
      const dateFrom = moment()
        .subtract(5, 'd')
        .format('YYYY-MM-DD')
      return dateFrom
    },
    moment,
    onTableChange (pagination) {
      this.loading = true
      console.log(pagination)
      this.params.page.current = pagination.current
      this.getReports()
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
      this.params.to_time ?? this.params.to_time
      this.onSubmit()
    },
    onChangeFromDate (value, dateString) {
      this.newarrayDate = dateString
      this.params.from_date = dateString[0].length ? dateString[0] : this.format()
      this.params.to_date = dateString[1].length ? dateString[1] : moment().format('YYYY-MM-DD')
      this.getCourietRepoartItem()
      // this.getReports()
      // this.AlldataCourierGet()
    }
    // onOk (value) {
    //   console.log('onOk: ', value)
    // },
  },
  mounted () {
  },
  created () {
    this.getCouriersList()
  }
}
</script>

<style scoped>
.classpointer {
  cursor: pointer;
}
.maindiv {
  border-radius: 9px;
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
.hovers:hover {
  color: #f5222d;
}
</style>
