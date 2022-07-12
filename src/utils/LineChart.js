import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: ['data', 'labels', 'title', 'headTitle'],
  mounted () {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
    //       {
    //         label: 'Заказ отменен',
    //         data: this.data.map(e => e.canceled_orders_count),
    //         backgroundColor: 'rgb(255,0,0)'
    //       },
    // {
    //   label: this.headTitle,
    //     data: this.data.map(e => e.finished_orders_count),
    //   backgroundColor: 'rgb(107,148,210)'
    // }
          {
            label: `Доставка:${ this.data.reduce((summ, value) => { return summ + value.delivery_orders_count }, 0) }`,
            data: this.data.map(e => e.delivery_orders_count),
            backgroundColor: 'transparent',
            borderColor: 'rgba(2,158,255,0.5)',
            pointBackgroundColor: 'rgb(107,148,210)'
          },
          {
            label: `Самовывоз:${ this.data.reduce((summ, value) => { return summ + value.self_pickup_orders_count }, 0) }`,
            data: this.data.map(e => e.self_pickup_orders_count),
            backgroundColor: 'transparent',
            borderColor: 'rgba(2,158,0,0.5)',
          },
          {
            label: `Отмененны:${ this.data.reduce((summ, value) => { return summ + value.canceled_orders_count }, 0) }`,
            data: this.data.map(e => e.canceled_orders_count),
            // backgroundColor: 'rgb(255,0,0)',
            borderColor: 'rgb(255,0,0)',
            pointBackgroundColor: 'rgb(107,0,0)'
          },
          {

            label: `Повторно оформленные:${ this.data.reduce((summ, value) => { return summ + value.reissued_orders_count }, 0) }`,
            data: this.data.map(e => e.reissued_orders_count),
            backgroundColor: 'rgba(51, 255, 189)'
          },
          {
            label: `Итого: ${this.data.reduce((value, e) => { return value + e.finished_orders_count }, 0)}`,
            backgroundColor: 'rgba(255, 255, 0)'
          }
        ]
      },
      {
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItems, data) {
              // console.log('tooltipItems=>', tooltipItems, data.datasets, data.datasets[tooltipItems.datasetIndex])
              return data.datasets[tooltipItems.datasetIndex].label.split(':')[0] + ' ' + tooltipItems.yLabel
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        // title: {
        //   display: true,
        //   text: this.title
        // }
      }
    )
  }
}
