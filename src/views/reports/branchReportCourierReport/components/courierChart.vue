<template>
  <div>
    <a-row type="flex" :gutter="[8,8]">
      <a-col :span="7">
          <a-month-picker allowClear v-model="filter.month" style="width: 100%" :placeholder="$t('selectReportDate')"/>
      </a-col>
      <a-col :span="7">
        <a-select :filter-option="$filterOption" show-search allowClear placeholder="Выберите courier" style="width: 100%" v-model="filter.courier_id">
          <a-select-option v-for="item in couriers" :key="item.id" :value="item.id">{{ item.first_name }}</a-select-option>
        </a-select>
      </a-col>
      <a-col span="auto">
        <a-button :loading="btnLoader" @click="onSearch" type="primary">{{ $t('search') }}</a-button>
      </a-col>
      <a-col span="auto">
        <a-button v-if="isSearch" :loading="btnLoader" @click="clear" :type="isSearch ? 'danger' : ''" shape="circle" icon="delete"></a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col v-if="courier_report" :span="24">
        <Chart :labels="labels" :isCurier="true" :data="[courier_report]" :months="months" :title="courier_report.courier_name"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// import moment from 'moment'
import Chart from './chart'
import moment from 'moment'
moment.locales('ru')
export default {
  // eslint-disable-next-line
  props: ['courier_report', 'couriers', 'getCourierReport'],
  components: {
    Chart
  },
  data () {
    return {
      btnLoader: false,
      isSearch: false,
      filter: {
        month: '',
        courier_id: undefined
      },
      labels: [],
      months: [''],
    }
  },
  methods: {
    clear () {
      this.filter = {
        month: '',
        courier_id: undefined
      }
      this.isSearch = false
      this.courier_report = {}
    },
    onSearch () {
      if (!Object.values(this.filter).every(el => el)) {
        alert('please Provide all field')
        return
      }
      this.btnLoader = true
      this.isSearch = true
      const form = {
        start_date: this.filter.month.startOf('month').format('YYYY-MM-DD'),
        end_date: this.filter.month.endOf('month').format('YYYY-MM-DD'),
        courier_id: this.filter.courier_id,
        limit: 1000
      }
      this.months[0] = this.filter.month.startOf('month').format('MMMM')
      this.labels = []
      // for (let index = 1; index <= parseInt(this.filter.month.endOf('month').format('D')); index++) {
      //   this.labels = [ ...this.labels, this.filter.month.endOf('month').format('YY MMM ') + index ]
      // }
      for (let index = 1; index <= parseInt(this.filter.month.endOf('month').format('D')); index++) {
        this.labels = [ ...this.labels, ('0' + index).slice(-2) ]
      }
      console.log(this.labels)
      this.getCourierReport(form, this)
      // this.$router.replace({ query: { ...form } })
    }
  }
}
</script>

<style>

</style>
