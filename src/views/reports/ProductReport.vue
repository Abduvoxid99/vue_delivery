<template>
  <a-card :title="$t('list')" style="width: 100%">
    <div class="card-container">
      <a-tabs type="card" @change="changeTabs">
        <a-tab-pane key="1" :tab="$t('day_report')">
          <a-date-picker :value="params.start_date" :format="dateFormat" style="margin: 10px 0" :placeholder="$t('select_day')" @change="ItemDay" />
          <a-select allowClear style="width: 200px; margin-left: 20px;" :placeholder="$t('branches')" @change="getReportByBranch">
            <a-select-option value="all">{{ $t('all_branches') }}</a-select-option>
            <a-select-option v-for="item in branches" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <div style="float: right">
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ $t('ReportsMian') }} Скачать файл</span>
              </template>
              <a-button @click="downloadExcel"> <a-icon :type="buttonLoading ? 'loading' : 'download'" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
            </a-tooltip>
          </div>
          <a-table
            :columns="columns"
            :rowKey="record => record.product_name"
            :dataSource="productReports"
            :loading="loadTable"
            :pagination="paginationProductReports"
            @change="changePage"
            :scroll="{ y: 400 }"
          >
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" :tab="$t('all_report')">
          <div class="flex">
            <a-range-picker @change="onChange" />
            <!--          <a-date-picker style="margin: 10px 5px" :placeholder="$t('start_time')" v-model="startDay" :valueFormat="dateFormat" :format="dateFormat" />-->
            <!--          <a-date-picker style="margin: 10px 5px" :placeholder="$t('end_time')" v-model="endDay" :valueFormat="dateFormat" :format="dateFormat" />-->
            <a-select allowClear style="width: 200px; margin-left: 20px;" :placeholder="$t('branches')" @change="getReportByBranch">
              <a-select-option value="all">{{ $t('all_branches') }}</a-select-option>
              <a-select-option v-for="item in branches" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-select allowClear style="width: 200px; margin-left: 20px;" :placeholder="$t('Операторы')" @change="getReportByShipperId">
              <a-select-option v-for="item in OpratorListNames" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <!--          <a-button style="margin-left: 20px;" @click="customReport" type="primary">{{ $t('search') }}</a-button>-->
          </div>
          <div style="float: right">
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ $t('ReportsMian') }} Скачать файл</span>
              </template>
              <a-button @click="downloadExcel"> <a-icon :type="buttonLoading ? 'loading' : 'download'" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
            </a-tooltip>
          </div>
          <a-table
            :columns="columns"
            :rowKey="record => record.product_name + Math.random()"
            :dataSource="productReports"
            :loading="loadTable"
            :pagination="paginationProductReports"
            @change="changePage"
            style="margin-top: 20px"
            :scroll="{ y: 400 }"
          >
          </a-table>
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
import mainTable from './TableReports'
import { mapActions, mapGetters } from 'vuex'
import { notification } from 'ant-design-vue'
export default {
  components: {
    mainTable
  },
  data () {
    return {
      params: {
        start_date: moment().format('YYYY-MM-DD') + ' 05:00:00',
        end_date: moment(moment().format('YYYY-MM-DD')).add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00',
        branch_id: null,
        shipper_user_id: null,
        dateFormat: 'YYYY/MM/DD',
       monthFormat: 'YYYY/MM',
       dateFormatList: ['DD/MM/YYYY', 'DD/MM/YY'],
      },
      buttonLoading: false,
      activeKey: '1',
      infoDate: '',
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
          dataIndex: 'product_name'
        },
        {
          title: this.$t('totalCount'),
          dataIndex: 'total_products_count',
          align: 'center',
          sorter: (a, b) => a.total_products_count - b.total_products_count
        },
        {
          title: this.$t('totalPrice'),
          dataIndex: 'total_sum',
          align: 'center',
          sorter: (a, b) => a.total_sum - b.total_sum
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['productReports', 'branches', 'OpratorListNames', 'paginationProductReports'])
  },
  methods: {
    onChange (event) {
      this.params.start_date = moment(event[0]._d).format('YYYY-MM-DD') + ' 05:00:00'
      this.params.end_date = moment(event[1]._d).format('YYYY-MM-DD') + ' 05:00:00'
      this.loadTable = true
      this.getProductReports(this.params).finally(() => {
        this.loadTable = false
      })
    },
    ItemDay (event) {
      console.log(event)
      const selectDay = moment(event).format('YYYY-MM-DD') + ' 05:00:00'
      this.params.start_date = event ? selectDay : moment().format('YYYY-MM-DD') + ' 05:00:00'
      this.params.end_date = event ? moment(event).add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00' : moment().add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00'
      this.loadTable = true
      this.getProductReports(this.params).finally(() => {
        this.loadTable = false
      })
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('ExcelPraductReports', this.params)
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
    ...mapActions(['getProductReports', 'getBranches', 'OpratorListName']),
    onChangeDataPicker (val) {
      console.log(val[0].format(this.dateFormat))
    },
    changePage (e) {
      this.$store.commit('GET_PRODUCT_REPORTS_PAGINATION', e)
    },
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
        this.activeKey = val
        this.loadTable = true
        this.getProductReports(
          this.params
        ).then(res => {
          this.loadTable = false
        })
      }
      if (val === '3') {
        this.activeKey = '3'
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
          this.getProductReports({
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
        this.getProductReports(
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
      this.getProductReports({
        date: {
          start_date: startDate,
          end_date: endDate
        },
        branch_id: this.branch_id
      }).then(res => {
        this.loadTable = false
      })
    },
    getReportByShipperId (e) {
      this.loadTable = true
      this.params.shipper_user_id = e
      this.getProductReports(this.params)
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
        this.loadTable = false
      })
    },
    getReportByBranch (e) {
      if (this.activeKey === '1') {
        if (e === 'all') {
          // this.branch_id = null
          console.log('e', e)
          this.params.branch_id = null
          this.loadTable = true
          this.getProductReports(this.params).finally(() => {
            this.loadTable = false
          })
          // this.getByDay(this.dateDay)
        } else {
          // this.branch_id = e
          // this.getByDay(this.dateDay)
          console.log('e', e)
          this.params.branch_id = e
          this.loadTable = true
          this.getProductReports(this.params).finally(() => {
            this.loadTable = false
          })
        }
      } else if (this.activeKey === '3') {
        if (e === 'all') {
          console.log('e', e)
          this.params.branch_id = null
          this.loadTable = true
          this.getProductReports(this.params).finally(() => {
            this.loadTable = false
          })
          // this.branch_id = null
          // this.customReport()
        } else {
          console.log('e', e)
          this.params.branch_id = e
          this.loadTable = true
          this.getProductReports(this.params).finally(() => {
            this.loadTable = false
          })
          // this.branch_id = e
          // this.customReport()
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
        this.getProductReports(
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
      this.getProductReports({
        start_date: startDate,
        end_date: endDate
      }).then(res => {
        this.loadTable = false
      })
    }
  },
  mounted () {
    this.loadTable = true
    this.getProductReports(
      this.params
      // {
      //   date: this.nowReport('day'),
      //   branch_id: this.branch_id
      // }
    ).then(res => {
      // this.pagination.total = res.length
      // console.log(this.pagination.total)
      this.loadTable = false
    })
    this.getBranches({
      current: 1,
      pageSize: 100
    })
    this.OpratorListName()
  }
}
</script>
<style scoped>
.flex{
  display: flex;
}
</style>
