<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 0, 18, 0]">
        <v-tooltip />
        <v-smooth-area position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
const data = []
const beginDay = new Date().getTime()

for (let i = 0; i < 10; i++) {
  data.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD HH'),
    y: Math.round(Math.random() * 10)
  })
}

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]
const scale = [{
  dataKey: 'x',
  min: 2
}, {
  dataKey: 'y',
  title: '时间',
  min: 1,
  max: 22
}]

export default {
  name: 'MiniArea',
  data () {
    return {
      data,
      tooltip,
      scale,
      height: 100,
      startTime: null
    }
  },
  mounted () {
    var msPerDay = 86400 * 1000
    var currentDate = new Date()
    const currentTime = currentDate.getTime()
    this.startTime = currentTime - (currentTime % msPerDay)
    this.startTime += ((new Date()).getTimezoneOffset() * 60 * 1000)
  },
  computed: {
    ...mapGetters(['orders'])
  },
  methods: {
    ...mapActions(['getAll'])
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
