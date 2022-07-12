<template>
  <!--  <div><a-page-header>Отчет по филиалам</a-page-header></div>-->
  <a-card>
    <!--    <div slot="title">-->
    <!--      <a-page-header>-->
    <!--        {{ $t('courierReport') }}-->
    <!--      </a-page-header>-->
    <!--    </div>-->
    <div slot="title">
      <a-form-model :rules="rules" :model="params" ref="ruleForm">
        <a-row type="flex" :gutter="[30,30]">
          <a-col >
            <a-range-picker @change="onChangeFromDate" style="margin-top: 5px" :placeholder="['От даты', 'До даты']">
            </a-range-picker>
          </a-col>
          <a-col >
            <a-form-model-item ref="from_time" prop="from_time">
              <a-time-picker
                allowClear
                v-model="params.from_time"
                @change="onTimePickerForm"
                :open.sync="open1"
                placeholder="От времени"
                valueFormat="hh:mm:ss"
              >
                <a-button slot="addon" size="small" type="primary" @click="handleClose">
                  Ok
                </a-button>
              </a-time-picker>
            </a-form-model-item>
          </a-col>
          <a-col style="margin-right: 10px">
            <a-form-model-item size="large" ref="to_time" prop="to_time">
              <a-time-picker
                allowClear
                v-model="params.to_time"
                @change="onTimePicerTo"
                :open.sync="open2"
                placeholder="До времени"
                valueFormat="hh:mm:ss"
              >
                <a-button slot="addon" size="small" type="primary" @click="handleClose">
                  Ok
                </a-button>
              </a-time-picker>
            </a-form-model-item>
          </a-col>
          <a-col :md="5">
            <!--                Выбрать филиал-->
            <a-select allowClear show-search style="width: 70%; margin-left: -20px; margin-top: 5px" @change="handleMenuClick" :placeholder="$t('seelctplaceholder')">
              <a-select-option
                v-for="(filayalname, index) in FilyalBranchlist"
                :key="index"
                :value="filayalname.id"
                :title="filayalname.name"
              >
                {{ filayalname.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :md="5">
            <!--                Выбрать филиал-->
            <a-select allowClear v-model="params.delivery_type" show-search style="width: 70%; margin-left: -40px; margin-top: 5px" :placeholder="$t('sortDelivery')">
              <a-select-option
                v-for="(filayalname, index) in sortDeleveryType"
                :key="index"
                :value="filayalname.id"
              >
                {{ filayalname.name }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row></a-row>
      </a-form-model>
    </div>
    <div slot="extra" style="margin-top: -20px">
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{ $t('reportBranch') }}</span>
        </template>
        <a-button @click="downloadExcel">
          <a-icon :type="buttonLoading ? 'loading' : 'download'" style="color: blue; font-size: 1.1rem; background-color: "></a-icon
        ></a-button>
      </a-tooltip>
    </div>
    <a-table
      style="cursor:pointer;"
      :columns="column"
      :dataSource="filteredBranches"
      :pagination="false"
      :rowKey="record => record.branch_id"
      :loading="loading"
      :scroll="{ x: 2500, y: 400 }"
      bordered
    >
<!--      Table header -->
                <span slot="name">
                  <div style="display: flex; width: 100%; align-items: center">
                    <span>Филиал</span>
                    <span style="margin-left: 20px">
                      <a-button @click="button('branch_name')" size="small" style="background-color: #FAFAFA">
                        <a-icon v-if="branch_name" :component="$myIcon.bxicons1"></a-icon>
                        <a-icon v-if="!branch_name" :component="$myIcon.bxicons2"></a-icon>
                      </a-button>
                    </span>
                  </div>
                </span>
                <span slot="total">
                  <div style="display: flex; width: 100%; align-items: center">
                    <span>Общее</span>
                    <span style="margin-left: 20px">
                      <a-button @click="button('total_count')" size="small" style="background-color: #FAFAFA">
                        <a-icon v-if="total_count" :component="$myIcon.bxicons1"></a-icon>
                        <a-icon v-if="!total_count" :component="$myIcon.bxicons2"></a-icon>
                      </a-button>
                    </span>
                  </div>
                </span>
                <span slot="over_60">
                  <div style="display: flex; width: 100%; align-items: center">
                    <span>Более 60 минут (кол-во)</span>
                    <span style="margin-left: 20px">
                      <a-button @click="button('over_60')" size="small" style="background-color: #FAFAFA">
                        <a-icon v-if="over_60" :component="$myIcon.bxicons1"></a-icon>
                        <a-icon v-if="!over_60" :component="$myIcon.bxicons2"></a-icon>
                      </a-button>
                    </span>
                  </div>
                </span>
                <span slot="percent_over_60">
                  <div style="display: flex; width: 100%; align-items: center">
                    <span>Более 60 минут (% от общего)</span>
                    <span style="margin-left: 20px">
                      <a-button @click="button('percent_over_60')" size="small" style="background-color: #FAFAFA">
                        <a-icon v-if="percent_over_60" :component="$myIcon.bxicons1"></a-icon>
                        <a-icon v-if="!percent_over_60" :component="$myIcon.bxicons2"></a-icon>
                      </a-button>
                    </span>
                  </div>
                </span>
                <span slot="range_35_60">
                  <div style="display: flex; width: 100%; align-items: center">
                    <span>Более 35 минут (кол-во)</span>
                    <span style="margin-left: 20px">
                      <a-button @click="button('range_35_60')" size="small" style="background-color: #FAFAFA">
                        <a-icon v-if="range_35_60" :component="$myIcon.bxicons1"></a-icon>
                        <a-icon v-if="!range_35_60" :component="$myIcon.bxicons2"></a-icon>
                      </a-button>
                    </span>
                  </div>
                </span>
                <span slot="percent_range_35_60">
                  <div style="display: flex; width: 100%; align-items: center">
                    <span>Более 35 минут (% от общего)</span>
                    <span style="margin-left: 20px">
                      <a-button @click="button('percent_range_35_60')" size="small" style="background-color: #FAFAFA">
                        <a-icon v-if="percent_range_35_60" :component="$myIcon.bxicons1"></a-icon>
                        <a-icon v-if="!percent_range_35_60" :component="$myIcon.bxicons2"></a-icon>
                      </a-button>
                    </span>
                  </div>
                </span>
                <span slot="under_35">
                  <div style="display: flex; width: 100%; align-items: center">
                    <span>Менее 35 минут (кол-во)</span>
                    <span style="margin-left: 20px">
                      <a-button @click="button('under_35')" size="small" style="background-color: #FAFAFA">
                        <a-icon v-if="under_35" :component="$myIcon.bxicons1"></a-icon>
                        <a-icon v-if="!under_35" :component="$myIcon.bxicons2"></a-icon>
                      </a-button>
                    </span>
                  </div>
                </span>
                <span slot="percent_under_35">
                  <div style="display: flex; width: 100%; align-items: center">
                    <span>Менее 35 минут (% от общего)</span>
                    <span style="margin-left: 20px">
                      <a-button @click="button('percent_under_35')" size="small" style="background-color: #FAFAFA">
                        <a-icon v-if="percent_under_35" :component="$myIcon.bxicons1"></a-icon>
                        <a-icon v-if="!percent_under_35" :component="$myIcon.bxicons2"></a-icon>
                      </a-button>
                    </span>
                  </div>
                </span>
                <span slot="text" slot-scope="text">{{ text }}</span>
<!--      Table body-->
      <span slot="name" slot-scope="text">
        <span>{{ text }}</span>
        <span v-if="!text">Итого</span>
      </span>
      <template slot="id" slot-scope="text"> <span>{{ updateIndex(text.branch_id) }}</span></template>
      <template slot="total_count" slot-scope="row">
        <a-tooltip>
          <span slot="title">{{ row.total_count }}</span>
          <a @click="SorTableItemRow('total_count', row)">{{ row.total_count }}</a>
        </a-tooltip>
      </template>
      <template slot="over_60" slot-scope="row">
        <a-tooltip>
          <span slot="title">{{ row.over_60 }}</span>
          <a @click="SorTableItemRow('over_60', row)">{{ row.over_60 }}</a>
        </a-tooltip>
      </template>
      <template slot="percent_over_60" slot-scope="row">
        <a-tooltip>
          <span slot="title">{{ row.percent_over_60 }}</span>
          <a @click="SorTableItemRow('percent_over_60', row)">{{ row.percent_over_60 }}</a>
        </a-tooltip>
      </template>
      <template slot="range_35_60" slot-scope="row">
        <a-tooltip>
          <span slot="title">{{ row.range_35_60 }}</span>
          <a @click="SorTableItemRow('range_35_60', row)">{{ row.range_35_60 }}</a>
        </a-tooltip>
      </template>
      <template slot="percent_range_35_60" slot-scope="row">
        <a-tooltip>
          <span slot="title">{{ row.percent_range_35_60 }}</span>
          <a @click="SorTableItemRow('percent_range_35_60', row)">{{ row.percent_range_35_60 }}</a>
        </a-tooltip>
      </template>
      <template slot="under_35" slot-scope="row">
        <a-tooltip>
          <span slot="title">{{ row.under_35 }}</span>
          <a @click="SorTableItemRow('under_35', row)">{{ row.under_35 }}</a>
        </a-tooltip>
      </template>
      <template slot="percent_under_35" slot-scope="row">
        <a-tooltip>
          <span slot="title">{{ row.percent_under_35 }}</span>
          <a @click="SorTableItemRow('percent_under_35', row)">{{ row.percent_under_35 }}</a>
        </a-tooltip>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
// import { jsontoexcel } from 'vue-table-to-excel'
import { mapGetters, mapActions } from 'vuex'
import { notification } from 'ant-design-vue'
export default {
  watch: {
    'params.delivery_type': function (value) {
      this.params.delivery_type = value
      this.BranchListGetReport()
    }
  },
  data () {
    return {
      buttonLoading: false,
      sortDeleveryType: [{ name: 'Все', id: '' }, { name: 'Доставка', id: 'delivery' }, { name: 'Самовывоз', id: 'self-pickup' }],
      params: {
        // page: { page: 1, pageSize: 10, total: null },
        to_date: moment().format('YYYY-MM-DD'),
        from_date: this.format(),
        branch_id: '',
        to_time: '',
        from_time: '',
        sort_by: '',
        sort_type: '',
        delivery_type: ''
      },
      rules: {
        to_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
        from_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }]
      },
      open1: false,
      open2: false,
      names: false,
      admin: false,
      bot: false,
      app: false,
      websiteorderscount: false,
      aggregators: false,
      allorders: false,
      totalSum: false,
      totaldeliverysum: false,
      freedelivery: false,
      totalsumcash: false,
      totalcashdeliverysum: false,
      totalsumpayme: false,
      totalpaymedeliverysum: false,
      totalsumtransfer: false,
      transferdeliverysum: false,
      clicksum: false,
      clickdeliverysum: false,
      givencashback: false,
      averagesum: false,
      loading: false,
      dateDay: '',
      dateMonth: '',
      startDay: '',
      endDay: '',
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      loadTable: false,
      loadExcel: false,
      currentDate: null,
      branch_name: false,
      total_count: false,
      over_60: false,
      percent_over_60: false,
      range_35_60: false,
      percent_range_35_60: false,
      under_35: false,
      percent_under_35: false
    }
  },
  computed: {
    ...mapGetters(['branchTimeReports', 'paginationBranchReports', 'FilyalBranchlist']),
    filteredBranches () {
      return (
        (this.branchTimeReports.length &&
          this.branchTimeReports) ||
        []
      )
    },
    column () {
      return [
        {
          title: this.$t('ordernumber'),
          fixed: 'left',
          // eslint-disable-next-line no-undef
          align: 'center',
          width: 60,
          // eslint-disable-next-line standard/object-curly-even-spacing
          scopedSlots: { customRender: 'id' }
        },
        {
          slots: { title: 'name' },
          scopedSlots: { customRender: 'name' },
          dataIndex: 'branch_name',
          name: 'Филиал'
        },
        {
          slots: { title: 'total' },
          scopedSlots: { customRender: 'total_count' },
          // dataIndex: 'total_count',
          align: 'center',
          name: 'Общее'
        },
        {
          slots: { title: 'over_60' },
          scopedSlots: { customRender: 'over_60' },
          // dataIndex: 'over_60',/**/
          align: 'center',
          name: 'Более 60 минут (кол-во)'
        },
        {
          slots: { title: 'percent_over_60' },
          scopedSlots: { customRender: 'percent_over_60' },
          // dataIndex: 'percent_over_60',
          align: 'center',
          name: 'Более 60 минут (% от общего)'
        },
        {
          slots: { title: 'range_35_60' },
          scopedSlots: { customRender: 'range_35_60' },
          // dataIndex: 'range_35_60',
          align: 'center',
          name: 'Более 35 минут (кол-во)'
        },
        {
          slots: { title: 'percent_range_35_60' },
          scopedSlots: { customRender: 'percent_range_35_60' },
          // dataIndex: 'percent_range_35_60',
          align: 'center',
          name: 'Более 35 минут (% от общего)'
        },
        {
          slots: { title: 'under_35' },
          scopedSlots: { customRender: 'under_35' },
          // dataIndex: 'under_35',
          align: 'center',
          name: 'Менее 35 минут (кол-во)'
        },
        {
          slots: { title: 'percent_under_35' },
          scopedSlots: { customRender: 'percent_under_35' },
          // dataIndex: 'percent_under_35',
          align: 'center',
          name: 'Менее 35 минут (% от общего)'
        }
      ]
    }
  },
  methods: {
    SorTableItemRow (type, value) {
      console.log(type, value)
      const query = {
        columname: type,
        branch_id: value.branch_id,
        from_date: this.params.from_time ? this.params.from_date + ' ' + this.params.from_time : this.params.from_date + ' ' + '05:00:00',
        to_date: this.params.to_time ? this.params.to_date + ' ' + this.params.to_time : moment(this.params.to_date).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00'
      }
      switch (type) {
        case 'over_60':
        case 'percent_over_60':
          query.range_time_from = 60
          query.range_time_to = 10000
          break
        case 'range_35_60':
        case 'percent_range_35_60':
          query.range_time_from = 35
          query.range_time_to = 60
          break
        case 'under_35':
        case 'percent_under_35':
          query.range_time_from = 0
          query.range_time_to = 35
          break
        default:
          query.range_time_from = ''
          query.range_time_to = ''
          break
      }
      console.log(query)
      this.$router.push({
        name: 'OrderReport',
        query: {
          start_date: query.from_date,
          end_date: query.to_date,
          range_time_to: query.range_time_to,
          range_time_from: query.range_time_from,
          branch_ids: query.branch_id,
          activTab: '4'
        }
      })
    },
    updateIndex (id) {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < this.branchTimeReports.length; i++) {
        // eslint-disable-next-line no-undef
        if (this.branchTimeReports[i].branch_id === id) return this.$route.query.page ? ((parseInt(this.$route.query.page) - 1) * 50 + (i + 1)) : (i + 1)
      }
    },
    BranchListGetReport () {
      this.loading = true
      this.$store.dispatch('getBranchTimeReports', this.params).finally(() => {
        this.loading = false
      })
    },
    BranchList () {
      this.loading = true
      this.$store
        .dispatch('BranchListGet')
        .then(res => {
          // console.log('branchList =>> ', res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('BranchTimeReportExcelDowlonds', this.params)
        .then(res => {
          console.log(res)
          notification.success({
            message: this.$t('Отчет по филиалам Excel файл готов'),
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
    ...mapActions(['getBranchReports']),
    moment,
    nowReport (type) {
      var date = new Date()
      if (type === 'day') {
        // this.params.start_date = moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        // this.params.end_date = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        var now = moment(date)
          .subtract({ hours: this.$diffDayHour })
          .format(this.dateFormat)
        var nextDay = moment(Date.now()).add({ hours: 24 - this.$diffDayHour })
        var tomorrow =
          moment(Date.now())
            .add({ hours: 24 - this.$diffDayHour })
            .format(this.dateFormat) +
          ' ' +
          '05:00:00'
        console.log(now, tomorrow)
        this.infoDate = now + ' ' + '--' + ' ' + moment(nextDay).format(this.dateFormat)
        return {
          start_date: now + ' ' + '05:00:00',
          end_date: tomorrow
        }
      }
      if (type === 'month') {
        var nowMonth = moment(date).format(this.monthFormat) + '-' + '01' + ' ' + '05:00:00'
        var nMonth = date.setMonth(date.getMonth() + 1)
        var nextMonth = moment(nMonth).format(this.monthFormat) + '-' + '01' + ' ' + '05:00:00'
        this.infoDate =
          moment(date).format(this.monthFormat) + ' ' + '--' + ' ' + moment(nMonth).format(this.monthFormat)
        return {
          start_date: nowMonth,
          end_date: nextMonth
        }
      }
    },
    onSubmit () {
      this.loading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('getBranchTimeReports', this.params).finally(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    format () {
      const dateFrom = moment()
        .subtract(5, 'd')
        .format('YYYY-MM-DD')
      return dateFrom
    },
    onChangeFromDate (value, dateString) {
      this.newarrayDate = dateString
      console.log('dateString', dateString)
      this.params.from_date = dateString[0]
      this.params.to_date = dateString[1]
      this.BranchListGetReport()
    },
    onTimePicerTo (value, pageTime) {
      console.log(value)
      this.params.to_time = pageTime
      // eslint-disable-next-line no-unused-expressions
      this.params.from_time === '' ? '' : this.params.from_time
      this.onSubmit()
    },
    onTimePickerForm (value, pageTime) {
      this.params.from_time = pageTime
      console.log(value)
      // eslint-disable-next-line no-unused-expressions
      this.params.to_time === '' ? '' : this.params.to_time
      this.onSubmit()
    },
    handleClose (value) {
      console.log(value)
      this.open1 = false
      this.open2 = false
    },
    handleMenuClick (val, key, sel) {
      this.loading = true
      this.params.branch_id = val
      console.log(val)
      this.BranchListGetReport()
      // console.log(val)
      // console.log(this.filayalId)
    },
    sortTableHearderIcons (headerName) {
      switch (headerName) {
        case 'branch_name': this.branch_name = !this.branch_name
              return this.branch_name
        case 'total_count': this.total_count = !this.total_count
              return this.total_count
        case 'over_60': this.over_60 = !this.over_60
              return this.over_60
        case 'percent_over_60': this.percent_over_60 = !this.percent_over_60
              return this.percent_over_60
        case 'range_35_60': this.range_35_60 = !this.range_35_60
              return this.range_35_60
        case 'percent_range_35_60': this.percent_range_35_60 = !this.percent_range_35_60
              return this.percent_range_35_60
        case 'under_35': this.under_35 = !this.under_35
              return this.under_35
        case 'percent_under_35': this.percent_under_35 = !this.percent_range_35_60
              return this.percent_under_35
      }
    },
    ParamsInsisdeSortType (value) {
      this.params.sort_type = this.sortTableHearderIcons(value) ? 'desc' : 'asc'
      this.params.sort_by = value
    },
    button (value) {
      this.ParamsInsisdeSortType(value)
      this.BranchListGetReport()
    }
  },
  mounted () {
    this.BranchList()
    this.loadTable = true
    this.BranchListGetReport()
  }
}
</script>

<style scoped>
.margenLeftTimes {
  margin-left: 10px;
}
</style>
