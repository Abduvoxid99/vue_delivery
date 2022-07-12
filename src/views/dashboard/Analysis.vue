<template>
  <page-header-wrapper>
    <div>
      <a-card :bordered="false">
        <a-row>
          <a-col :sm="8" :xs="24">
            <info :title="$t('branchesCount')" :value="branchesCount>0 ? branchesCount.toString() : '0'" :bordered="true" />
          </a-col>
          <a-col :sm="8" :xs="24">
            <info :title="$t('clientsCount')" :value="clientsCount>0 ? clientsCount.toString() : '0'" :bordered="true" />
          </a-col>
          <a-col :sm="8" :xs="24">
            <info :title="$t('driversCount')" :value="driversCount>0 ? driversCount.toString() : '0'" />
          </a-col>
        </a-row>
      </a-card>
      <a-card>
        <a-row>
          <a-col :sm="8" :xs="18">
            <a-date-picker v-model="dateBranch" style="width: 95%" :placeholder="$t('selectReportDate')" @change="onBranchDate"/>
          </a-col>
          <a-col :sm="4" :xs="6">
            <a :href="branchReportLink">
              <a-button type="primary">{{ $t('branchReport') }}</a-button>
            </a>
          </a-col>
          <a-col :sm="8" :xs="18">
            <a-date-picker v-model="dateCourier" style="width: 95%" :placeholder="$t('selectReportDate')" @change="onCourierDate"/>
          </a-col>
          <a-col :sm="4" :xs="6">
            <a :href="courierReportLink">
              <a-button type="primary">{{ $t('courierReport') }}</a-button>
            </a>
          </a-col>
        </a-row>
      </a-card>
      <!-- <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="Total sales" :total="totalSales + ' so\'m'">
            <a-tooltip title="Indicator description " slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <template slot="footer">1 USD = <span> {{ buyPrice }} ({{ $t('buyPrice') }}) </span> <span> = {{ sellPrice }} ({{ $t('sellPrice') }}) </span></template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="Views " :total="8846 | NumberFormat">
            <a-tooltip title="Indicator description " slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-area />
            </div>
            <template slot="footer">Daily Orders<span> {{ '1234' | NumberFormat }}</span></template>
          </chart-card>
        </a-col>
      </a-row>
      <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
        <div class="salesCard">
          <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
            <div class="extra-wrapper" slot="tabBarExtraContent">
              <div class="extra-item">
                <a>This week</a>
                <a>This month</a>
                <a>This year</a>
              </div>
              <a-range-picker :style="{width: '256px'}" />
            </div>
            <a-tab-pane loading="true" :tab="$t('thisWeek')" key="1">
              <a-row>
                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                  <bar :data="barData" :title="$t('ordersCount')" />
                </a-col>
                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <rank-list :title="$t('orderCountByBranch')" :list="rankList"/>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane :tab="$t('thisMonth')" key="2">
              <a-row>
                <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                  <bar :data="barData2" title="Orders Rank" />
                </a-col>
                <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <rank-list title="Order Rank List" :list="rankList"/>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>

      <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
        <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card :loading="loading" :bordered="false" :title="$t('popularProducts')" :style="{ height: '100%' }">
              <div class="ant-table-wrapper">
                <a-table
                  row-key="index"
                  size="small"
                  :columns="searchTableColumns"
                  :dataSource="searchData"
                  :pagination="{ pageSize: 5 }"
                >
                  <span slot="range" slot-scope="text, record">
                    <trend :flag="record.status === 0 ? 'up' : 'down'">
                      {{ text }}%
                    </trend>
                  </span>
                </a-table>
              </div>
            </a-card>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" :title="$t('proportionByCategory')" :style="{ height: '100%' }">
              <div>
                <div>
                  <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                    <v-tooltip :showTitle="false" dataKey="item*percent" />
                    <v-axis />
                    <v-legend dataKey="item"/>
                    <v-pie position="percent" color="item" :vStyle="pieStyle" />
                    <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                  </v-chart>
                </div>

              </div>
            </a-card>
          </a-col>
        </a-row>
      </div> -->
    </div>
  </page-header-wrapper>
</template>

<script>
import Info from './components/Info'
import moment from 'moment'
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  // NumberInfo,
  MiniSmoothArea
} from '@/components'
import { baseMixin } from '@/store/app-mixin'

const barData = []
const barData2 = []
for (let i = 0; i < 30; i += 1) {
  barData.push({
    x: `${i + 1}месяц`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  barData2.push({
    x: `${i + 1}месяц`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: 'Egret island  ' + (i + 1) + ' Number shop ',
    total: 1234.56 - i * 100
  })
}

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: 'Time'
  },
  {
    dataKey: 'y',
    alias: 'User number',
    min: 0,
    max: 10
  }]

const searchTableColumns = [
  {
    dataIndex: 'index',
    title: '',
    width: 90
  },
  {
    dataIndex: 'keyword',
    title: 'Наименование товара'
  },
  {
    dataIndex: 'count',
    title: 'Количество заказов'
  }
]
const searchData = []
for (let i = 0; i < 5; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `Лаваш -${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}

const DataSet = require('@antv/data-set')

const sourceData = [
  { item: 'Лаваш ', count: 32.2 },
  { item: 'Пиццы', count: 21 },
  { item: 'Бургеры', count: 17 },
  { item: 'Донар', count: 13 },
  { item: 'Сэндвич', count: 9 },
  { item: 'other ', count: 7.8 }
]

const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
})
const pieData = dv.rows

export default {
  name: 'Dashboard',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Info,
    Trend,
    // NumberInfo,
    MiniSmoothArea
  },
  data () {
    return {
      loading: true,
      dateBranch: '',
      dateCourier: '',
      courierReportLink: null,
      branchReportLink: null,
      sellPrice: 0,
      buyPrice: 0,
      rankList,
      // ordersCount: '',
      // driversCount: '',
      // clientsCount: '',
      // 搜索User number
      searchUserData,
      searchUserScale,
      searchTableColumns,
      searchData,

      barData,
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  computed: {
      ...mapGetters(['paginationOrder', 'paginationClient', 'paginationCourier', 'pagination_branches', 'orders']),
      ordersCount () {
        return this.paginationOrder.total
      },
      clientsCount () {
        return this.paginationClient.total
      },
      branchesCount () {
        console.log(this.pagination_branches, ' brancheeeeeeeeeeees')
        return this.pagination_branches.total
      },
      driversCount () {
        return this.paginationCourier.total
      },
      totalSales () {
        var totalSoum = 0
        if (this.orders) {
          this.orders.map(order => {
          totalSoum = totalSoum + order.order_amount
          })
        }
        return totalSoum
      }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  mounted () {
    this.getBranches()
    this.getCouriers()
    this.getClients()
    this.usdPrice()
    this.getAll({ current: 1, limit: 1000 })
  },
  methods: {
    ...mapActions(['getBranches', 'getCouriers', 'getAll', 'getClients', 'getBranches']),
    onBranchDate (e) {
      request({
        url: '/branches-report-excel',
        method: 'get',
        params: { date: e.format('YYYY-MM-DD') }
      })
      .then(res => {
        console.log(res, 'response')
        this.branchReportLink = res.file
      })
      console.log(e.format('YYYY-MM-DD'))
    },
    onCourierDate (e) {
      request({
        url: '/couriers-report-excel',
        method: 'get',
        params: { date: e.format('YYYY-MM-DD') }
      })
      .then(res => {
        console.log(res, 'response')
        this.courierReportLink = res.file
      })
      console.log(e.format('YYYY-MM-DD'))
    },
    usdPrice () {
        var sellPrice = 0
        var buyPrice = 0
        request({
          url: '/exchange-rates',
          method: 'get',
          headers: { 'Content-Type': 'text/html' }
        })
        .then(response => {
          console.log(response)
          var USD = response.find(money => {
            console.log(money, 'money')
            if (money.title === 'US Dollar') {
              return money
            }
          })
          console.log(USD)
          sellPrice = USD.nbu_cell_price
          buyPrice = USD.nbu_buy_price
          this.sellPrice = sellPrice
          this.buyPrice = buyPrice
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
