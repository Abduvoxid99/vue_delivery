<template>
  <a-card :title="$t('list')" style="width: 100%">
    <!-- <mainTable :columns="columns" :dataTable="branchReports" :pagination="paginationBranchReports"></mainTable> -->
    <div class="card-container">
      <a-tabs default-active-key="2" type="card" @change="changeTabs">
        <a-tab-pane key="2" :tab="$t('branchReports')">
          <BranchesTable
          ></BranchesTable>
        </a-tab-pane>
        <a-tab-pane key="4" :tab="$t('branchTimeReports')">
          <BranchesTimeTable
          ></BranchesTimeTable>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>
<script>
import mainTable from './TableReports'
import moment from 'moment'
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import BranchesTable from './branchReportNewTable/branchReportNewTable'
import BranchesTimeTable from './branchReportNewTable/branchTimeReport'
export default {
  components: {
    mainTable,
    BranchesTable,
    BranchesTimeTable
  },
  data () {
    return {
      infoDate: '',
      dateDay: '',
      dateMonth: '',
      startDay: '',
      endDay: '',
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      loadTable: false,
      loadExcel: false,
      currentDate: null,
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          width: 120
        },
        {
          title: this.$t('admin'),
          dataIndex: 'admin_panel_orders_count',
          align: 'center'
        },
        {
          title: this.$t('telegram_bot'),
          dataIndex: 'bot_orders_count',
          align: 'center'
        },
        {
          title: this.$t('app'),
          dataIndex: 'app_orders_count',
          align: 'center'
        },
        {
          title: this.$t('all_orders'),
          dataIndex: 'total_orders_count',
          align: 'center'
        },
        {
          title: this.$t('totalSum'),
          dataIndex: 'total_sum',
          align: 'center'
        },
        {
          title: this.$t('delevery'),
          dataIndex: 'total_delivery_sum',
          align: 'center'
        },
        {
          title: 'Общая сумма наличные',
          dataIndex: 'total_sum_cash',
          align: 'center'
        },
        {
          title: 'Общая сумма доставки(наличные)',
          dataIndex: 'total_cash_delivery_sum',
          align: 'center'
        },
        {
          title: 'Общая сумма Payme',
          dataIndex: 'total_sum_payme',
          align: 'center'
        },
        {
          title: 'Общая сумма доставки (Payme)',
          dataIndex: 'total_payme_delivery_sum',
          align: 'center'
        },

        {
          title: 'Общая сумма по перечислению',
          dataIndex: 'total_sum_transfer',
          align: 'center'
        },

        {
          title: 'Общая сумма доставки(перечисление)',
          dataIndex: 'total_transfer_delivery_sum',
          align: 'center'
        },
        // {
        //   title: 'Payme Оплаченные Чеки',
        //   dataIndex: 'total_sum_payme',
        //   align: 'center'
        // },
        {
          title: 'Click',
          dataIndex: 'total_sum_click',
          align: 'center'
        },
        {
          title: 'Общая сумма доставки (Click)',
          dataIndex: 'total_click_delivery_sum',
          align: 'center'
        },
        {
          title: 'Средний чек',
          dataIndex: 'sredniy',
          align: 'center'
        },
        // {
        //   title: 'Click Оплаченные Чеки',
        //   dataIndex: 'total_sum_click_paid',
        //   align: 'center'
        // }
      ],
    }
  },
  methods: {
    ...mapActions(['getBranchReports']),
    nowReport (type) {
      var date = new Date()
      if (type === 'day') {
        // this.params.start_date = moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        // this.params.end_date = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
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
        this.getBranchReports(
          this.nowReport('day')
        ).then(res => {
          this.loadTable = false
        })
      }
      if (val === '2') {
        this.loadTable = true
        this.getBranchReports(
          this.nowReport('day')
        ).then(res => {
          this.loadTable = false
        })
      }
      if (val === '3') {
        this.infoDate = ''
      }
    },
    onClickReport () {
      if (this.dateDay) {
        this.loadExcel = true
        request({
          url: '/reports/branches-excel',
          method: 'get',
          params: {
            start_date: this.currentDate.start,
            end_date: this.currentDate.end
          }
        })
        .then((response) => {
          console.log(response)
          var link = document.createElement('a')
          // link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(response.file)
          // link.style = 'visibility:hidden'
          // link.download = fileName

          // document.body.appendChild(link);
          link.href = response.file
          document.body.appendChild(link)
          link.click()
          // document.body.removeChild(link);
          // window.location = response.filename
        }).finally(() => {
          this.loadExcel = false
        })
      } else {
        this.$message.error('Дата не указана')
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
          this.getBranchReports({
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
    ...mapGetters(['branchReports', 'paginationBranchReports']),
    filteredBranches () {
      return this.branchReports.map(e => {
        return {
          admin_panel_orders_count: e.admin_panel_orders_count,
          app_orders_count: e.app_orders_count,
          bot_orders_count: e.bot_orders_count,
          name: e.name,
          total_delivery_sum: new Intl.NumberFormat().format(e.total_delivery_sum),
          total_orders_count: e.total_orders_count,
          total_sum: new Intl.NumberFormat().format(e.total_sum + e.total_delivery_sum),
          total_sum_cash: new Intl.NumberFormat().format(e.total_sum_cash + e.total_cash_delivery_sum),
          total_cash_delivery_sum: new Intl.NumberFormat().format(e.total_cash_delivery_sum),
          total_sum_click: new Intl.NumberFormat().format(e.total_sum_click + e.total_click_delivery_sum),
          total_click_delivery_sum: new Intl.NumberFormat().format(e.total_click_delivery_sum),
          total_sum_transfer: new Intl.NumberFormat().format(e.total_sum_transfer),
          total_transfer_delivery_sum: new Intl.NumberFormat().format(e.total_transfer_delivery_sum),
          // total_sum_click_paid: new Intl.NumberFormat().format(e.total_sum_click_paid),
          total_sum_payme: new Intl.NumberFormat().format(e.total_sum_payme + e.total_payme_delivery_sum),
          total_payme_delivery_sum: new Intl.NumberFormat().format(e.total_payme_delivery_sum),
          sredniy: new Intl.NumberFormat().format(Math.round(e.total_sum / parseInt(e.total_orders_count === '0' ? 1 : e.total_orders_count))),
          // payme_invoices: new Intl.NumberFormat().format(e.total_sum_payme_invoices),
          // payme_paid: new Intl.NumberFormat().format(e.total_sum_payme_paid),
          website_orders_count: e.website_orders_count
        }
      })
    },
    column () {
      return [
      {
        title: this.$t('name'),
        dataIndex: 'name',
        width: 120,
        sorter: (a, b) => a.name - b.name,
        // slots: {
        //   filterIcon: 'delete'
        // },
        // scopedSlots: {
        //   customRender: (e) => `<h1>Salom + ${e}</h1>`
        // }
        // sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: this.$t('admin'),
        dataIndex: 'admin_panel_orders_count',
        align: 'center'
      },
      {
        title: this.$t('bot'),
        dataIndex: 'bot_orders_count',
        align: 'center'
      },
      {
        title: this.$t('app'),
        dataIndex: 'app_orders_count',
        align: 'center'
      },
      {
        title: this.$t('aggregators'),
        // dataIndex: 'app_orders_count',
        align: 'center'
      },
      {
        title: this.$t('all_orders'),
        dataIndex: 'total_orders_count',
        align: 'center',
        width: 150
      },
      {
        title: this.$t('totalSum'),
        dataIndex: 'total_sum',
        align: 'center',
        width: 150
      },
      {
        title: this.$t('delevery'),
        dataIndex: 'total_delivery_sum',
        align: 'center'
      },
      {
        title: 'Общая сумма наличные',
        dataIndex: 'total_sum_cash',
        align: 'center',
        width: 150
      },
      {
        title: 'Общая сумма доставки(наличные)',
        dataIndex: 'total_cash_delivery_sum',
        align: 'center'
      },
      {
        title: 'Общая сумма Payme',
        dataIndex: 'total_sum_payme',
        align: 'center',
        width: 150
      },
      {
        title: 'Общая сумма доставки (Payme)',
        dataIndex: 'total_payme_delivery_sum',
        align: 'center',
        width: 150
      },

      {
        title: 'Общая сумма по перечислению',
        dataIndex: 'total_sum_transfer',
        align: 'center',
        width: 150
      },

      {
        title: 'Общая сумма доставки(перечисление)',
        dataIndex: 'total_transfer_delivery_sum',
        align: 'center'
      },
      {
        title: 'Click',
        dataIndex: 'total_sum_click',
        align: 'center'
      },
      {
        title: 'Общая сумма доставки (Click)',
        dataIndex: 'total_click_delivery_sum',
        align: 'center',
        width: 150
      },
      {
        title: 'Отдано Кэшбек',
        // dataIndex: 'total_sum_payme',
        align: 'center'
      },
      {
        title: 'Средний чек',
        dataIndex: 'sredniy',
        align: 'center'
      },
      // {
      //   title: 'Click Оплаченные Чеки',
      //   dataIndex: 'total_sum_click_paid',
      //   align: 'center'
      // }
    ]
    }
  },
  watch: {
    dateDay (val) {
      if (val === null) {
        this.loadTable = true
        this.getBranchReports(
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
      this.currentDate = {
        start: startDate,
        end: endDate
      }
      console.log(startDate, endDate)
      this.loadTable = true
      this.getBranchReports({
        start_date: startDate,
        end_date: endDate
      }).then(res => {
        this.loadTable = false
      })
    },
    dateMonth (val) {
      if (val === null) {
        this.loadTable = true
        this.getBranchReports(
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
      this.getBranchReports({
        start_date: startDate,
        end_date: endDate
      }).then(res => {
        this.loadTable = false
      })
    }
  },
  mounted () {
        this.loadTable = true
        this.getBranchReports(
          this.nowReport('day')
        ).then(res => {
          this.loadTable = false
        })
  }
}
</script>
