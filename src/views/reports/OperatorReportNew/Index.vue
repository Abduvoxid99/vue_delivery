<template>
  <a-card :title="$t('operatorReports')">
    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="Отчет операторов" type="card">
        <div style="display: flex; aligin-items: center; justify-content: space-between">
          <a-range-picker
            format="YYYY-MM-DD"
            :local="local"
            @change="onDateChange"
            :defaultValue="dateRange"
          />
          <a-button style="width: 48px; color: blue;" @click="downloadExcel" ><a-icon :type="buttonLoading ? 'loading ': 'download'"></a-icon></a-button>
        </div>
        <a-table
          bordered
          style="margin-top: 16px"
          :columns="columns"
          :loading="loading"
          :data-source="items"
          :scroll="{ x: 1000, y: 400 }"
          :pagination="false"
          :row-key="(record) => record['No']"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Отчет операторов новое">
        <OpratorReport />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import moment from 'moment'
import dateLocal from '@/locales/datepicker'
import { columns } from './columns'
import { mapActions } from 'vuex'
// import { jsontoexcel } from 'vue-table-to-excel'
import OpratorReport from './OperatorReportList'
import { notification } from 'ant-design-vue'
export default {
 components: {
   OpratorReport
 },
  data () {
    return {
      params: {
        start_date: moment().format('YYYY-MM-DD') + ' 05:00:00',
        end_date: moment().add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00'
      },
      buttonLoading: false,
      items: [],
      local: dateLocal,
      loading: false,
      dateRange: [
       moment().format('YYYY-MM-DD') + ' 05:00:00',
        moment().add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00'
      ],
      columns: columns
    }
  },
  methods: {
    callback (e) {
      console.log(e)
    },
    moment,
    ...mapActions(['getOperatorReports']),
    avgSum (text) {
      const devider = text.total_orders_count !== '0' ? +text.total_orders_count : 1
      const res = +text.total_sum / devider
      return res.toFixed(2)
    },
    avgSumDelivery (text) {
      const devider = text.total_count_delivery !== '0' ? +text.total_count_delivery : 1
      const res = +text.total_sum_delivery / devider
      return res.toFixed(2)
    },
    avgSelfCall (text) {
      const sum = text.total_orders_count - text.total_count_delivery
      const devider = sum !== 0 ? sum : 1
      const res = (text.total_sum - text.total_sum_delivery) / devider
      return res.toFixed(2)
    },
    onDateChange (val, event) {
      this.dateRange = val
      this.dateRange = [event[0] + ' 05:00:00', event[1] + ' 05:00:00']
      this.params.start_date = event[0] + ' 05:00:00'
      this.params.end_date = event[1] + ' 05:00:00'
      // console.log(val, event, this.params)
      this.getItems()
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('ReporTabOnetOperatorExcel', this.params)
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
    getItems () {
      this.loading = true
      this.getOperatorReports(this.dateRange)
        .then((res) => {
          this.items = res.reports.map((el, i) => ({
            'No': i + 1,
            [this.$t('firstName')]: el.name,
            [this.$t('total_orders_count')]: el.total_orders_count,
            [this.$t('total_sum')]: el.total_sum,
            [this.$t('avg_order_time')]: el.avg_order_time + ` ${this.$t('minutes')}`,
            [this.$t('avg_sum')]: this.avgSum(el),
            [this.$t('total_count_delivery')]: el.total_count_delivery,
            [this.$t('total_sum_delivery')]: el.total_sum_delivery,
            [this.$t('avg_sum_delivery')]: this.avgSumDelivery(el),
            [this.$t('count_self_call')]: el.total_orders_count - el.total_count_delivery,
            [this.$t('sum_self_call')]: el.total_sum - el.total_sum_delivery,
            [this.$t('avg_self_call')]: this.avgSelfCall(el),
            [this.$t('admin')]: el.admin_panel_orders_count,
            [this.$t('app')]: el.app_orders_count,
            [this.$t('telegram_bot')]: el.bot_orders_count,
            [this.$t('site')]: el.website_orders_count,
          }))
          console.log(this.items)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  created () {
    this.getItems()
  },
}
</script>
