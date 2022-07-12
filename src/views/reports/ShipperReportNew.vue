<template>
  <a-card :title="$t('list')" style="width: 100%">
    <div class="card-container">
      <a-tabs type="card" @change="changeTabs">
        <a-tab-pane key="1" :tab="$t('day_report')">
          <a-date-picker :locale="locale" style="margin: 10px 0" :placeholder="$t('select_day')" v-model="dateDay" :valueFormat="dateFormat" :format="dateFormat" />
          <a-row>
            <a-col :span="12">
              <a-list bordered :loading="loadTable" :rowKey="item => item" size="large" :data-source="dataT">
                <a-list-item slot="renderItem" slot-scope="item">
                  <span><strong>{{ item }}</strong></span>
                </a-list-item>
              </a-list>
            </a-col>
            <a-col :span="12">
              <a-list bordered :loading="loadTable" :rowKey="item => item.key" size="large" :data-source="shipperData">
                <a-list-item slot="renderItem" slot-scope="item">
                  {{ item.value }}
                </a-list-item>
              </a-list>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="3" :tab="$t('all_report')">
          <a-date-picker :locale="locale" style="margin: 10px 5px" :placeholder="$t('start_time')" v-model="startDay" :valueFormat="dateFormat" :format="dateFormat" />
          <a-date-picker :locale="locale" style="margin: 10px 5px" :placeholder="$t('end_time')" v-model="endDay" :valueFormat="dateFormat" :format="dateFormat" />
          <a-button @click="customReport" type="primary">{{ $t('search') }}</a-button>
          <a-row>
            <a-col :span="12">
              <a-list bordered :loading="loadTable" :rowKey="item => item" size="large" :data-source="dataT">
                <a-list-item slot="renderItem" slot-scope="item">
                  <span><strong>{{ item }}</strong></span>
                </a-list-item>
              </a-list>
            </a-col>
            <a-col :span="12">
              <a-list bordered :loading="loadTable" :rowKey="item => item.key" size="large" :data-source="shipperData">
                <a-list-item slot="renderItem" slot-scope="item">
                  {{ item.value }}
                </a-list-item>
              </a-list>
            </a-col>
          </a-row>
        </a-tab-pane>
        <div slot="tabBarExtraContent">
          <span>{{ infoDate }}</span>
        </div>
      </a-tabs>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import dateLocal from '@/locales/datepicker'
export default {
  data () {
    return {
      locale: dateLocal,
      infoDate: '',
      dateDay: '',
      dateMonth: '',
      startDay: '',
      endDay: '',
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      loadTable: false,
      dataT: [
        this.$t('admin'),
        this.$t('telegram_bot'),
        this.$t('app'),
        this.$t('site'),
        this.$t('all_orders'),
        this.$t('totalSum'),
        this.$t('totalDelevery'),
        'Общая сумма наличные',
        'Общая сумма доставки(наличные)',
        'Общая сумма по перечислению',
        'Общая сумма доставки(перечисление)',
        'Общая сумма Payme',
        'Общая сумма доставки (Payme)',
        'Общая сумма Click',
        'Общая сумма доставки (Click)',
        'Средний чек'
      ]
    }
  },
  methods: {
    ...mapActions(['getShipperReports']),
    nowReport (type) {
      var date = new Date()
      if (type === 'day') {
        var now = moment(date).subtract({ hours: this.$diffDayHour }).format(this.dateFormat)
        var nextDay = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) })
        var tomorrow = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format(this.dateFormat) + ' ' + '05:00:00'
        console.log(now, tomorrow)
        this.infoDate = now + ' ' + '--' + ' ' + moment(nextDay).format(this.dateFormat)
        return {
          start_date: now + ' ' + '05:00:00',
          end_date: tomorrow
        }
      }
      if (type === 'month') {
        var nowMonth = moment(date).format(this.monthFormat) + '-' + '01' + ' ' + '05:00:00'
        var nMonth = date.setMonth(date.getMonth() + 1)
        var nextMonth = moment(nMonth).format(this.monthFormat) + '-' + '01' + ' ' + '05:00:00'
        this.infoDate = moment(date).format(this.monthFormat) + ' ' + '--' + ' ' + moment(nMonth).format(this.monthFormat)
        return {
          start_date: nowMonth,
          end_date: nextMonth
        }
      }
    },
    changeTabs (val) {
      if (val === '1') {
        this.loadTable = true
        this.getShipperReports(
          this.nowReport('day')
        ).then(res => {
          this.loadTable = false
        })
      }
      if (val === '3') {
        this.infoDate = ''
      }
    },
    customReport () {
      this.infoDate = ''
      var start = this.startDay
      var end = this.endDay
      if (start && end) {
        var startTime = parseInt(start.split('-')[0]) * 365 + parseInt(start.split('-')[1]) * 30 + parseInt(start.split('-')[2])
        var endTime = parseInt(end.split('-')[0]) * 365 + parseInt(end.split('-')[1]) * 30 + parseInt(end.split('-')[2])
        if (startTime < endTime) {
          this.infoDate = start + ' ' + '--' + ' ' + end
          this.loadTable = true
          this.getShipperReports({
            start_date: start + ' ' + '05:00:00',
            end_date: end + ' ' + '05:00:00'
          }).then(res => {
            this.loadTable = false
          })
        } else this.$message.error(this.$t('error_start_time'))
      } else this.$message.error(this.$t('error_start_time'))
    },
    moment
  },
  computed: {
    ...mapGetters(['shipperReports']),
    shipperData () {
      const data = [
        {
          value: this.shipperReports.admin_panel_orders_count,
          key: 'admin_panel_orders_count'
        },
        {
          value: this.shipperReports.bot_orders_count,
          key: 'bot_orders_count'
        },
        {
          value: this.shipperReports.app_orders_count,
          key: 'app_orders_count'
        },
        {
          value: this.shipperReports.website_orders_count,
          key: 'website_orders_count'
        },
        {
          value: this.shipperReports.total_orders_count,
          key: 'total_orders_count'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_sum + this.shipperReports.total_delivery_sum),
          key: 'total_sum'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_delivery_sum),
          key: 'total_delivery_sum'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_sum_cash + this.shipperReports.total_cash_delivery_sum),
          key: 'total_sum_cash'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_cash_delivery_sum),
          key: 'total_cash_delivery_sum'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_sum_transfer),
          key: 'total_sum_transfer'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_transfer_delivery_sum),
          key: 'total_transfer_delivery_sum'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_sum_payme + this.shipperReports.total_payme_delivery_sum),
          key: 'total_sum_payme'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_payme_delivery_sum),
          key: 'total_payme_delivery_sum'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_sum_click + this.shipperReports.total_click_delivery_sum),
          key: 'total_sum_click'
        },
        {
          value: new Intl.NumberFormat().format(this.shipperReports.total_click_delivery_sum),
          key: 'total_click_delivery_sum'
        },
        {
          value: new Intl.NumberFormat().format(Math.round(this.shipperReports.total_sum / parseInt(this.shipperReports.total_orders_count === '0' ? 1 : this.shipperReports.total_orders_count))),
          key: 'total_medium_check'
        }
      ]
      return data
    }
  },
  watch: {
    dateDay (val) {
      if (val === null) {
        this.loadTable = true
        this.getShipperReports(
          this.nowReport('day')
        ).then(res => {
          this.loadTable = false
        })
        return
      }
      var startDate = val + ' ' + '05:00:00'
      var tomorrow = new Date(val)
      tomorrow.setDate(tomorrow.getDate() + 1)
      var endDate = moment(tomorrow).format(this.dateFormat) + ' ' + '05:00:00'
      this.infoDate = val + ' ' + '--' + ' ' + moment(tomorrow).format(this.dateFormat)
      console.log(startDate, endDate)
      this.loadTable = true
      this.getShipperReports({
        start_date: startDate,
        end_date: endDate
      }).then(res => {
        this.loadTable = false
      })
    },
    dateMonth (val) {
      if (val === null) {
        this.loadTable = true
        this.getShipperReports(
          this.nowReport('month')
        ).then(res => {
          this.loadTable = false
        })
        return
      }
      var startDate = val + '-' + '01' + ' ' + '05:00:00'
      var thisMonth = new Date(val)
      thisMonth.setMonth(thisMonth.getMonth() + 1)
      var endDate = moment(thisMonth).format(this.monthFormat) + '-' + '01' + ' ' + '05:00:00'
      this.infoDate = val + ' ' + '--' + ' ' + moment(thisMonth).format(this.monthFormat)
      console.log(startDate, endDate)
      this.loadTable = true
      this.getShipperReports({
        start_date: startDate,
        end_date: endDate
      }).then(res => {
        this.loadTable = false
      })
    }
  },
  mounted () {
        this.loadTable = true
        this.getShipperReports(
          this.nowReport('day')
        ).then(res => {
          this.loadTable = false
        })
  }
}
</script>
