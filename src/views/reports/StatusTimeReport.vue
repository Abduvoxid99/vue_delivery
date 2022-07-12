<template>
  <a-card :title="$t('list')" style="width: 100%">
    <div class="card-container">
      <a-tabs type="card">
        <a-tab-pane key="1" :tab="$t('day_report')">
          <a-date-picker style="margin: 10px 0" :placeholder="$t('select_day')" v-model="dateDay" :valueFormat="dateFormat" :format="dateFormat" />
          <a-select mode="multiple" style="width: 200px; margin-left: 20px;" :placeholder="$t('branches')" @change="getReportByBranch">
            <a-select-option v-for="item in branches" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
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
export default {
  data () {
    return {
      infoDate: '',
      dateDay: new Date(),
      dateMonth: '',
      startDay: '',
      endDay: '',
      branch_ids: [],
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      loadTable: false,
      dataT: [
        this.$t('allStatusTime'),
        this.$t('allStatusBranchAcceptedTime'),
        this.$t('allStatusBranchFinishTime'),
        this.$t('allStatusPickedTime'),
        this.$t('allStatusFinishOrder')
      ]
    }
  },
  methods: {
    ...mapActions(['getStatusReports', 'getBranches']),
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
          end_date: tomorrow,
          branch_ids: this.branch_ids.join(',')
        }
      }
    },
    timeFormat (value) {
      console.log(value)
      if (value !== 0) {
        var h, m, s
        if (value >= 0) s = value
        else s = 0
        if (s > 0) {
          m = Math.floor(s / 60)
          const sec = (s - m * 60).toString().split('.')
          s = sec.length > 1 ? (sec[0] + '.' + sec[1].slice(0, (sec[1].length - (sec[1].length - 2)))) : sec[0]
        } else m = 0
        if (m > 0) {
          h = Math.floor(m / 60)
          m = m - h * 60
        } else h = 0
        return (h !== 0 ? (h + ' ' + this.$t('hour')) : '') + ' ' + (m !== 0 ? (m + ' ' + this.$t('minut')) : '') + ' ' + (s + ' ' + this.$t('sec'))
      } else return '0' + ' ' + this.$t('sec')
    },
    getReportByBranch (e) {
      console.log(e)
      this.branch_ids = e
      // this.getByDay(this.dateDay)
      this.getStatusReports({
        start_date: moment(this.dateDay).format('YYYY-MM-DD') + ' 05:00:00',
        end_date: moment(this.dateDay).add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00',
        branch_ids: e.join(',')
      })
    },
    getByDay (val) {
    if (val === '') {
      this.loadTable = true
      this.getStatusReports(
        {
           ...this.nowReport('day')
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
    this.getStatusReports({
      start_date: startDate,
      end_date: endDate,
      branch_ids: this.branch_ids.join(',')
    }).then(res => {
      this.loadTable = false
    })
  },
    moment
  },
  computed: {
    ...mapGetters(['statusReports', 'branches']),
    shipperData () {
      const data = [
        {
          value: this.timeFormat(parseFloat(this.statusReports.total_time_avg)),
          key: 'total_time_avg'
        },
        {
          value: this.timeFormat(parseFloat(this.statusReports.operator_accepting_avg)),
          key: 'operator_accepting_avg'
        },
        {
          value: this.timeFormat(parseFloat(this.statusReports.vendor_preparing_avg)),
          key: 'vendor_preparing_avg'
        },
        {
          value: this.timeFormat(parseFloat(this.statusReports.courier_picking_avg)),
          key: 'courier_picking_avg'
        },
        {
          value: this.timeFormat(parseFloat(this.statusReports.delivering_time_avg)),
          key: 'delivering_time_avg'
        }
      ]
      return data
    }
  },
  watch: {
    dateDay (val) {
      if (this.branch_ids.length) {
        if (val === null) {
          this.loadTable = true
          this.getStatusReports(
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
        this.getStatusReports({
          start_date: startDate,
          end_date: endDate,
          branch_ids: this.branch_ids.join(',')
        }).then(res => {
          this.loadTable = false
        })
      }
    }
  },
  mounted () {
    this.getBranches({
      current: 1,
      pageSize: 100
    })
    // this.loadTable = true
    // this.getStatusReports(
    //   this.nowReport('day')
    // ).then(res => {
    //   this.loadTable = false
    // })
  }
}
</script>
