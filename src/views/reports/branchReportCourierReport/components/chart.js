import { Bar } from 'vue-chartjs'
import moment from 'moment'
moment.locales('ru')
const colors = ['#52c41a', '#13c2c2', '#1890ff']

export default {
  extends: Bar,
  props: ['data', 'labels', 'months'],
  watch: {
    data (val) {
      console.log('DATA ==>', val)
      this.getRender()
    },
  },
  mounted () {
    this.getRender()
  },
  methods: {
    getRender () {
      this.renderChart(
        {
          labels: this.labels,
          datasets: this.data.map((item, index) => ({
            label: `${this.months[index] ? this.months[index] : 'Количество'} : ${item.orders_amount.reduce(
              (summ, value) => summ + value.amount,
              0
            )}`,
            data: this.labels.map(el => {
              console.log('el', el)
              const idx = item.orders_amount.filter(element => {
                if (el == element.date.split('-')[2]) {
                  return element.amount
                } else return 0
              })
              return idx.length ? idx[0].amount : 0
            }),
            backgroundColor: colors[index]
          }))
        },
        {
          tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
              label: function (tooltipItems, data) {
                return data.datasets[tooltipItems.datasetIndex].label.split(':')[0] + ' ' + tooltipItems.yLabel
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      )
    },
  },

}
