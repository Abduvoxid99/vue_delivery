<template>
  <a-card :title="$t('list')" style="width: 100%">
    <div slot="extra">
      <a-range-picker
        slot="extra"
        v-model="datePicker"
        valueFormat="YYYY-MM-DD"
        format="YYYY-MM-DD"
        :placeholder="['Дата начала', 'Дата окончания']"
        style="width: 100%">
      </a-range-picker>
    </div>
    <div class="card-container">
      <a-row>
        <a-col :span="12">
          <a-list bordered :loading="loadPersonalReport" :rowKey="item => item" size="large" :data-source="dataT">
            <a-list-item slot="renderItem" slot-scope="item">
              <span><strong>{{ item }}</strong></span>
            </a-list-item>
          </a-list>
        </a-col>
        <a-col :span="12">
          <a-list bordered :loading="loadPersonalReport" :rowKey="item => item.key" size="large" :data-source="shipperData">
            <a-list-item slot="renderItem" slot-scope="item">
              {{ item.value }}
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      datePicker: null,
      startDay: '',
      endDay: '',
      dateFormat: 'YYYY-MM-DD',
      loadTable: false,
      dataT: [
        'Админ',
        'Бот',
        'Сайт',
        'Приложение',
        'Общий заказ',
        'Наличные',
        'Click',
        'Payme',
        'Доставка',
        'Общая сумма',
        'Средний чек'
      ]
    }
  },
  methods: {
    ...mapActions(['getPersonalReport']),
    nowReport (type) {
      const date = new Date()
      if (type === 'day') {
        var now = moment(date).subtract({ hours: this.$diffDayHour }).format(this.dateFormat)
        var tomorrow = moment(date).add({ hours: (24 - this.$diffDayHour) }).format(this.dateFormat)
        this.datePicker = [now, tomorrow]
        return {
          start_date: now + ' ' + '05:00:00',
          end_date: tomorrow + ' ' + '05:00:00'
        }
      }
    },
    moment
  },
  computed: {
    ...mapGetters(['personalReport', 'loadPersonalReport']),
    shipperData () {
      const data = [
        {
          value: this.personalReport.admin_panel_orders_count,
          key: 'admin_panel_orders_count'
        },
        {
          value: this.personalReport.bot_orders_count,
          key: 'bot_orders_count'
        },
        {
          value: this.personalReport.website_orders_count,
          key: 'website_orders_count'
        },
        {
          value: this.personalReport.app_orders_count,
          key: 'app_orders_count'
        },
        {
          value: this.personalReport.total_orders_count,
          key: 'total_orders_count'
        },
        {
          value: new Intl.NumberFormat().format(this.personalReport.total_sum_cash),
          key: 'total_sum_cash'
        },
        {
          value: new Intl.NumberFormat().format(this.personalReport.total_sum_click),
          key: 'total_sum_click'
        },
        {
          value: new Intl.NumberFormat().format(this.personalReport.total_sum_payme),
          key: 'total_sum_payme'
        },
        {
          value: new Intl.NumberFormat().format(this.personalReport.total_delivery_sum),
          key: 'total_delivery_sum'
        },
        {
          value: new Intl.NumberFormat().format(this.personalReport.total_sum),
          key: 'total_sum'
        },
        {
          value: new Intl.NumberFormat().format(Math.round(this.personalReport.total_sum / parseInt(this.personalReport.total_orders_count === '0' ? 1 : this.personalReport.total_orders_count))),
          key: 'sredniy'
        },
      ]
      return data
    }
  },
  watch: {
    datePicker (val) {
      this.getPersonalReport({
        id: JSON.parse(localStorage.getItem('user_id')),
        date: {
          start_date: val[0] + ' ' + '05:00:00',
          end_date: val[1] + ' ' + '05:00:00'
        }
      })
      console.log(val)
    }
  },
  mounted () {
    this.getPersonalReport(
      {
        id: JSON.parse(localStorage.getItem('user_id')),
        date: this.nowReport('day')
      }
    ).then(res => {
      console.log(res)
    })
  }
}
</script>
