<template>
  <div>
    <!--    <h1 v-action:get style="margin: 10px">{{ $t('dashboard') }}</h1>-->
    <div v-action:get style="display: flex; justify-content: space-between; width: 100%">
      <transition name="slide-fade" >
        <a-col v-if="fadeload" class="counter" :span="8" @click="$router.push({name:'BranchList'})">
            <a-icon class="svg" type="shop" />
            <span class="count_label">{{ $t('branchesCount') }}</span>
            <number
              class="count"
              ref="number1"
              :from="0"
              :to="branchesCount"
              :duration="2"
              :delay="0"
              easing="Power1.easeOut"
            />
            <!--
             <span class="count">{{ new Intl.NumberFormat().format(branchesCount) }}</span> -->
        </a-col>
      </transition>
      <transition name="slide-fade" >
        <a-col v-if="fadeload" class="counter" :span="8" @click="$router.push({name:'clients'})">
            <a-icon class="svg" type="team" />
            <span class="count_label">{{ $t('clientsCount') }}</span>
            <number
              class="count"
              ref="number1"
              :from="0"
              :to="clientsCount"
              :duration="2"
              :delay="0"
              easing="Power1.easeOut"
            />
        </a-col>
      </transition>
      <transition name="slide-fade">
        <a-col v-if="fadeload" class="counter" :span="8" @click="$router.push({name:'CourierList'})">
          <a-icon class="svg" type="car" />
          <span class="count_label">{{ $t('driversCount') }}</span>
          <number
            class="count"
            ref="number1"
            :from="0"
            :to="driversCount"
            :duration="2"
            :delay="0"
            easing="Power1.easeOut"
          />
          <!-- <span class="count">{{ driversCount }}</span> -->
        </a-col>
      </transition>
    </div>

    <a-card v-if="isloadChart" v-action:get style="margin-top: 25px" :title="$t('monthly')">
      <a-row slot="extra">
        <a-select v-model="month" style="width: 200px" @change="changeMonth">
          <a-select-option v-for="item in months" :key="item.val" :value="item.val">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-row>
      <!--      <transition name="slide-fade">-->
      <Barchart :title="$t('monthly')" :headTitle="$t('orders')" v-if="isloadChart" :data="dataDay"
                :labels="dataLabels"></Barchart>
      <!--      </transition>-->
    </a-card>
    <a-card>
      <!-- <a-range-picker
        :disabled-date="disabledDate"
        :value="mapDateRangeValue"
        @change="onMapPickerChange"
        style="margin-top: 5px"
        :placeholder="['От даты', 'До даты']"
      /> -->
      <OrdersMap :range="mapDateRange" style="margin-top: 24px" />
    </a-card>
    <a-card v-if="isloadChart" v-action:get :title="$t('yearly')">
      <a-select slot="extra" v-model="year" style="width: 200px" @change="changeYear">
        <a-select-option :value="2020">2020</a-select-option>
        <a-select-option :value="2021">2021</a-select-option>
        <a-select-option :value="2022">2022</a-select-option>
      </a-select>
      <transition name="slide-fade">
        <LineChart :headTitle="$t('orders')" v-if="isloadChart" :data="dataYear" :labels="yearLabels"></LineChart>
      </transition>
    </a-card>

    <a-card v-if="!isloadChart" style="margin-top: 25px">
      <a-skeleton :paragraph="{ rows: 5 }" active />
    </a-card>

    <a-card v-if="!isloadChart">
      <a-skeleton :paragraph="{ rows: 5 }" active />
    </a-card>

  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import LineChart from '@/utils/LineChart'
import Barchart from '@/utils/barchart'
import moment from 'moment'
import OrdersMap from './OrdersMap.vue'
export default {
  components: {
    LineChart,
    Barchart,
    OrdersMap
  },
  data () {
    return {
      fadeload: false,
      fadeloadCharts: false,
      isloadChart: false,
      dataDay: [],
      dataLabels: [],
      dataYear: [],
      yearLabels: [],
      month: null,
      year: new Date().getFullYear(),
      selectedDate: null,
      mapDateRangeValue: [
        moment(),
        moment().add(1, 'd')
      ],
      months: [
        { name: 'Январь', val: 1 },
        { name: 'Февраль', val: 2 },
        { name: 'Mарт', val: 3 },
        { name: 'Aпрель', val: 4 },
        { name: 'Mай', val: 5 },
        { name: 'Июнь', val: 6 },
        { name: 'Июль', val: 7 },
        { name: 'Август', val: 8 },
        { name: 'Сентябрь', val: 9 },
        { name: 'Октябрь', val: 10 },
        { name: 'Ноябрь', val: 11 },
        { name: 'Декабрь', val: 12 }
      ]
    }
  },
  methods: {
    ...mapActions(['getBranches', 'getCouriers', 'getClients', 'getStats']),
    getMonthName (num) {
      switch (num) {
        case 1:
          return 'Янв'
        case 2:
          return 'Фев'
        case 3:
          return 'Mарт'
        case 4:
          return 'Aпр'
        case 5:
          return 'Mай'
        case 6:
          return 'Июнь'
        case 7:
          return 'Июль'
        case 8:
          return 'Авг'
        case 9:
          return 'Сен'
        case 10:
          return 'Окт'
        case 11:
          return 'Ноя'
        case 12:
          return 'Дек'
      }
    },
    onMapPickerChange (e, val) {
      console.log('on Map Tab change', val)
      this.mapDateRangeValue = e
    },
    disabledDate (current) {
      if (this.selectedDate) {
        const end = moment(this.selectedDate).add(30, 'd')
        const start = moment(this.selectedDate).subtract(30, 'd')
        return current && (current < start || current > end)
      }
      return false
    },
    changeYear (e) {
      this.year = e
      this.dashBoard(this.month, e)
    },
    getBranchReport (params) {
      this.$store.dispatch('getOrderBranchReport', params).then(res => {
        console.log('hello => ', res)
      }).catch(err => {
        console.log(err)
      })
    },
    getMonthFullName (num) {
      for (var i = 0; i < this.months.length; i++) {
        if (num === this.months[i].val) return this.months[i].name
      }
    },
    log (v) {
      console.log(v)
    },
    dashBoard (mon, year) {
      this.isloadChart = false
      this.getStats({
        month: mon,
        year: year
      }).then(res => {
        console.log('reschartjs==>>', res)
        this.dataYear = []
        this.yearLabels = []
        this.dataDay = []
        this.dataLabels = []
        this.monthlyStats.forEach(e => {
          this.dataDay.push(e)
          this.dataLabels.push(e.day + ' ' + this.getMonthName(this.month))
        })
        this.yearlyStats.forEach(e => {
          this.dataYear.push(e)
          this.yearLabels.push(this.getMonthFullName(e.month))
        })
        this.isloadChart = true
      })
    },
    changeMonth (e) {
      this.month = e
      this.dashBoard(e, this.year)
    }
  },
  computed: {
    ...mapGetters(['monthlyStats', 'yearlyStats', 'paginationOrder', 'paginationClient', 'paginationCourier', 'pagination_branches', 'orders']),
    branchesCount () {
      return this.pagination_branches.total
    },
    clientsCount () {
      return this.paginationClient.total
    },
    driversCount () {
      return this.paginationCourier.total
    },
    mapDateRange () {
      return {
        start_date: this.mapDateRangeValue[0].format('YYYY-MM-DD') + ' 05:00:00',
        end_date: moment(this.mapDateRangeValue[1].format('YYYY-MM-DD')).add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00',
        limit: 1000000,
        page: 1
      }
    },
  },
  mounted () {
    const date = new Date()
    const nowMonth = parseInt(moment(date).format('MM'))
    const nowYear = parseInt(moment(date).format('YYYY'))
    this.month = nowMonth
    this.fadeload = true
    this.getBranches()
    this.getCouriers()
    this.getClients()
    this.dashBoard(nowMonth, nowYear)
  },
  created () {
    // this.getBranchReport({
    //   start_date: moment().startOf('month').format('YYYY-MM-DD'),
    //   end_date: moment().endOf('month').format('YYYY-MM-DD')
    // })
  }
}
</script>
<style scoped>
.statistics {
  width: 100%;
  height: 500px;
}

.chart_container {
  width: 100%;
  height: 400px;
  padding: 20px;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.18);
  transition: all .3s;
  background-color: white;
}

.counter {
  width: 32%;
  height: 150px;
  padding: 20px;
  background-color: white;
  /* background-color: rgba(51, 255, 0, 0.377); */
  /*box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.18);*/
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  transition: all .3s;
}

.counter:hover {
  transform: scale(1.02);
  cursor: pointer;
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.18);
}

.svg {
  position: absolute;
  right: 0;
  bottom: 0;
  color: rgba(0, 0, 0, 0.13);
  font-size: 80px;
  z-index: 1;
}

.count_label {
  font-size: 20px;
  color: #16213e;
}

.count {
  position: absolute;
  color: #222831d3;
  font-size: 45px;
  font-weight: 800;
  right: 35%;
  bottom: 20%;
}

.slide-fade-enter-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-leave-active {
  transition: all .3s ease;
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active до версии 2.1.8 */
{
  transform: translateY(10px);
  opacity: 0;
}

/* .fade-enter-active {
  transition: all .2s ease-in-out;
  opacity: 1;
}
.fade-leave-active {
  opacity: 0;
} */
/* .bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
} */
/* @keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  50% {
    opacity: 0.5;
    transform: translateY(-15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
} */
/* @keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
} */
</style>
