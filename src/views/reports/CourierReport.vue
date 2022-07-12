<template>
  <a-card :title="$t('courierReport')" style="width: 100%">
    <div slot="extra">
<!--      <span>{{this.params.}}</span>-->
    </div>
    <div class="card-container">
      <a-tabs default-active-key="2" type="card" @change="changeTabs">
        <a-tab-pane key="2" tab="Отчет по курьерам">
          <CourierReportTable />
        </a-tab-pane>
        <a-tab-pane key="1" tab="Отчет по курьерам по дате">
          <CourierOrderReport />
        </a-tab-pane>
        <a-tab-pane key="3" tab="Отчет по курьерам по комментарию">
          <CourierReportComments />
        </a-tab-pane>
        <div slot="tabBarExtraContent">
<!--          -->
        </div>
      </a-tabs>
    </div>
  </a-card>
</template>
<script>
// import request from '@/utils/request'
import moment from 'moment'
import request from '@/utils/request'
import mainTable from './TableReports'
import { mapActions, mapGetters } from 'vuex'
import CourierReportTable from './courierReport/courierReportTable'
import CourierOrderReport from './courierReport/courierOrderReport.vue'
import CourierReportComments from './courierReport/commentReport.vue'
export default {
  components: {
    mainTable,
    CourierReportTable,
    CourierReportComments,
    CourierOrderReport
  },
  data () {
    return {
      infoDate: '',
      activeKey: '1',
      dateDay: '',
      dateMonth: '',
      startDay: '',
      endDay: '',
      branch_id: null,
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      loadTable: false,
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'courier_name'
        },
        {
          title: this.$t('totalCount'),
          dataIndex: 'total_orders_count',
          align: 'center',
          sorter: (a, b) => a.total_orders_count - b.total_orders_count
        },
        {
          title: this.$t('totalPrice'),
          dataIndex: 'total_sum',
          align: 'center',
          sorter: (a, b) => a.total_sum - b.total_sum
        },
        {
          title: this.$t('deliveryPrice'),
          dataIndex: 'total_delivery_price',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['courierReports', 'branches']),
    dataOperators () {
      return this.operatorReports
    }
  },
  methods: {
    ...mapActions(['getCourierReports', 'getBranches']),
    onChangeDataPicker (val) {
      console.log(val[0].format(this.dateFormat))
    },
    onClickReport () {
      // if (this.dateDay) {
      //   console.log(this.dateDay)
      //   console.log(moment(this.dateDay).subtract(24, 'hours').format('YYYY,MM-DD HH:mm:ss'))
        request({
          url: '/reports/couriers-excel',
          method: 'get',
          params: {
            start_date: this.infoDate.slice(0, 10) + ' ' + '05:00:00',
            end_date: this.infoDate.slice(-10) + ' ' + '05:00:00'
          }
        })
        .then((response) => {
          console.log(response.file)
          const link = document.createElement('a')
          link.href = response.file
          document.body.appendChild(link)
          link.click()
        })
      // } else {
      //   this.$message.error('dateNotGiven')
      // }
    },
    nowReport (type) {
      var date = new Date()
      if (type === 'day') {
        // this.params.start_date = moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        // this.params.end_date = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        var now = moment(date).subtract({ hours: this.$diffDayHour }).format(this.dateFormat)
        var nextDay = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) })
        var tomorrow = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format(this.dateFormat) + ' ' + '05:00:00'
        // console.log(now, tomorrow)
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
        this.activeKey = val
        this.branch_id = null
        this.loadTable = true
        this.getCourierReports(
          {
            date: this.nowReport('day'),
            branch_id: this.branch_id
          }
        ).then(res => {
          this.loadTable = false
        })
      }
      if (val === '3') {
        this.activeKey = val
        this.branch_id = null
        this.infoDate = ''
      }
      console.log(val)
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
          this.getCourierReports({
            date: {
              start_date: start + ' ' + '05:00:00',
              end_date: end + ' ' + '05:00:00'
            },
            branch_id: this.branch_id
          }).then(res => {
            this.loadTable = false
          })
        } else this.$message.error(this.$t('error_start_time'))
      } else this.$message.error(this.$t('error_start_time'))
    },
    getByDay (val) {
      if (val === '') {
        this.loadTable = true
        this.getCourierReports(
          {
            date: this.nowReport('day'),
            branch_id: this.branch_id
          }
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
      this.getCourierReports({
        date: {
          start_date: startDate,
          end_date: endDate
        },
        branch_id: this.branch_id
      }).then(res => {
        this.loadTable = false
      })
    },
    getReportByBranch (e) {
      if (this.activeKey === '1') {
        if (e === 'all') {
          this.branch_id = null
          this.getByDay(this.dateDay)
        } else {
          this.branch_id = e
          this.getByDay(this.dateDay)
        }
      } else if (this.activeKey === '3') {
        if (e === 'all') {
          this.branch_id = null
          this.customReport()
        } else {
          this.branch_id = e
          this.customReport()
        }
      }
    },
    moment
  },
  watch: {
    dateDay (val) {
      this.getByDay(val)
    },
    dateMonth (val) {
      if (val === null) {
        this.loadTable = true
        this.getCourierReports(
          {
            date: this.nowReport('day'),
            branch_id: this.branch_id
          }
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
      this.getCourierReports({
        date: {
          start_date: startDate,
          end_date: endDate
        },
        branch_id: this.branch_id
      }).then(res => {
        this.loadTable = false
      })
    }
  },
  mounted () {
    this.loadTable = true
    this.getCourierReports(
      {
        date: this.nowReport('day'),
        branch_id: this.branch_id
      }
    ).then(res => {
      this.loadTable = false
    })
    this.getBranches({
      current: 1,
      pageSize: 100
    })
  }
}
</script>
