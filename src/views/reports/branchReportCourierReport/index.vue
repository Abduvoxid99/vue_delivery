<template>
  <div>
    <a-card>
        <a-tabs v-model="currentTab" @change="handleTabChange">
        <a-tab-pane :tab="$t('branches')" :key="'1'">
            <branchChart :branch_report="branch_report" :branches="branches" :getBranchReport="getBranchReport" />
        </a-tab-pane>
        <a-tab-pane :tab="$t('couriers')" :key="'2'">
            <courier-chart :courier_report="courier_report" :couriers="couriers" :getCourierReport="getCourierReport" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import courierChart from './components/courierChart.vue'
import branchChart from './components/branchChart.vue'

export default {
  components: {
    courierChart,
    branchChart
  },
  data () {
    return {
      currentTab: '1',
      branches: [],
      couriers: [],
      branch_report: {},
      courier_report: {},
    }
  },
  methods: {
    getBranchReport (params, t) {
      this.$store.dispatch('getOrderBranchComparisonReport', params).then(res => {
        console.log(res)
        this.branch_report = res
      }).finally(() => {
        t.btnLoader = false
      })
    },
    getCourierReport (params, t) {
      this.$store.dispatch('getOrderCourierReport', params).then(res => {
        console.log(res)
        this.courier_report = res.courier_dashboard_report
      }).finally(() => {
        t.btnLoader = false
      })
    },
    getBranches () {
      this.$store.dispatch('getBranches').then(res => {
        console.log(res)
        this.branches = res.branches
      })
    },
    handleTabChange (e) {
      console.log(e)
    },
    getCouriers (params) {
      this.$store.dispatch('getCouriersList', params).then(res => {
        this.couriers = res.couriers
      })
    }
  },
  created () {
    // const form = {
    //   limit: 1000,
    //   page: 1,
    //   start_date: '2021-11-01',
    //   end_date: moment().endOf('month').format('YYYY-MM-DD'),
    //   branch_id: 'b746c0f1-45be-4983-a770-d6f2995154c2'
    // }
    // this.getBranchReport(form)
    this.getBranches({ limit: 1000 })
    this.getCouriers({ limit: 1000, page: 1 })
  }
}
</script>

<style>

</style>
