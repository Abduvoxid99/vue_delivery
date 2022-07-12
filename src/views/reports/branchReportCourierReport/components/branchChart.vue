<template>
  <div>
    <a-row type="flex" justify="space-between" :gutter="[8,8]">
      <a-col span="22">
        <a-row type="flex" :gutter="[8,8]">
          <a-col :span="auto">
            <a-row type="flex" :gutter="[8,0]">
              <div v-for="(item, index) in filter.month" :key="item.value + index" style="padding: 0 4px">
                <a-month-picker allowClear v-model="item.value" @change="handleDateChange" style="min-width: 150px" :placeholder="$t('selectDate')"/>
              </div>
            </a-row>
          </a-col>
          <a-col :span="7">
            <a-select allowClear placeholder="Выберите филиал" style="width: 100%" v-model="filter.branch_id">
              <a-select-option v-for="item in branches" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-col>
          <a-col span="auto">
            <a-button :loading="btnLoader" @click="onSearch" type="primary">{{ $t('search') }}</a-button>
          </a-col>
          <a-col span="auto">
            <a-button v-if="isSearch" :loading="btnLoader" @click="clear" :type="isSearch ? 'danger' : ''" shape="circle" icon="delete"></a-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col span="auto">
        <a-button :loading="btnLoaderButton" @click="download" icon="download"></a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col v-if="branch_report" :span="24">
        <Chart :labels="labels" :months="months" :data="branch_report.reports" :title="branch_report.branch_name"/>
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
  props: ['branch_report', 'branches', 'getBranchReport'],
  components: {
    Chart
  },
  data () {
    return {
      btnLoader: false,
      btnLoaderButton: false,
      isSearch: false,
      filter: {
        month: [{ value: '' }],
        branch_id: undefined
      },
      months: [],
      labels: []
    }
  },
  // watch: {
  //   months () {
  //     console.log('MONTH ==>', this.months.length)
  //     if (this.months.length > 3) {
  //       this.months = []
  //     }
  //   }
  // },
  methods: {
    clear () {
      this.filter = {
        month: [{ value: '' }],
        branch_id: undefined
      }
      this.isSearch = false
      this.branch_report = null
      this.months = ['', '', '']
    },
    download () {
      this.btnLoaderButton = true
      const form = {
        start_date1: this.filter.month[0]?.value?.startOf('month').format('YYYY-MM-DD'),
        end_date1: this.filter.month[0]?.value?.endOf('month').format('YYYY-MM-DD'),
        id: this.filter.branch_id,
      }
      if (this.filter.month[1]?.value) {
        form.start_date2 = this.filter.month[1]?.value?.startOf('month').format('YYYY-MM-DD')
        form.end_date2 = this.filter.month[1]?.value?.endOf('month').format('YYYY-MM-DD')
      }
      if (this.filter.month[2]?.value) {
        form.start_date3 = this.filter.month[2]?.value?.startOf('month').format('YYYY-MM-DD')
        form.end_date3 = this.filter.month[2]?.value?.endOf('month').format('YYYY-MM-DD')
      }
      this.$store.dispatch('getBranchExcelComparisonReport', form).then(res => {
        console.log('1111', res)
        window.location.href = res.url
      }).finally(() => {
        this.btnLoaderButton = false
      })
    },
    onSearch () {
      this.months[0] = this.filter.month[0]?.value?.startOf('month').format('MMMM')
      this.months[1] = this.filter.month[1]?.value?.startOf('month').format('MMMM')
      this.months[2] = this.filter.month[2]?.value?.startOf('month').format('MMMM')
      if (!Object.values(this.filter).every(el => el)) {
        alert('please Provide all field')
        return
      }
      this.btnLoader = true
      this.isSearch = true
      const form = {
        start_date1: this.filter.month[0]?.value?.startOf('month').format('YYYY-MM-DD'),
        end_date1: this.filter.month[0]?.value?.endOf('month').format('YYYY-MM-DD'),
        branch_id: this.filter.branch_id,
        limit: 1000
      }
      this.labels = []
      for (let index = 1; index <= parseInt(this.filter.month[0]?.value?.endOf('month').format('D')); index++) {
        this.labels = [ ...this.labels, ('0' + index).slice(-2) ]
      }
      if (this.filter.month[1]?.value) {
        form.start_date2 = this.filter.month[1]?.value?.startOf('month').format('YYYY-MM-DD')
        form.end_date2 = this.filter.month[1]?.value?.endOf('month').format('YYYY-MM-DD')
      }
      if (this.filter.month[2]?.value) {
        form.start_date3 = this.filter.month[2]?.value?.startOf('month').format('YYYY-MM-DD')
        form.end_date3 = this.filter.month[2]?.value?.endOf('month').format('YYYY-MM-DD')
      }

      this.getBranchReport(form, this)
      // this.$router.replace({ query: { ...form } })
    },
    handleDateChange (date) {
      console.log(date)
      if (date) {
        if (this.filter.month.length < 3) {
          this.filter.month.push({ value: '' })
        }
      } else {
        this.filter.month.pop()
      }
    }
  }
}
</script>

<style>

</style>
