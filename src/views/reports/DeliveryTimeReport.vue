<template>
  <a-card :title="$t('reports.by.delivery.time')">
    <a-tabs type="card">
      <a-tab-pane key="1" :tab="$t('day_report')">
        <a-date-picker :defaultValue="dateRange[0]" :local="local" @change="onDateChange" />
       <div style="float:right;">
         <div>
           <a-tooltip placement="top">
             <template slot="title">
               <span>{{ $t('courierReport') }} Скачать файл</span>
             </template>
             <a-button @click="downloadExcel"> <a-icon :type="buttonLoading ? 'loading' : 'download'" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
           </a-tooltip>
         </div>
       </div>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('all_report')">
        <a-range-picker :defaultValue="dateRange" :local="local" @change="onDateChange" />
         <div style="float:right;">
         <div>
           <a-tooltip placement="top">
             <template slot="title">
               <span>{{ $t('courierReport') }} Скачать файл</span>
             </template>
             <a-button @click="downloadExcel"> <a-icon type="download" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
           </a-tooltip>
         </div>
       </div>
      </a-tab-pane>
      <div slot="tabBarExtraContent">
        <span>{{ moment(dateRange[0]).format('YYYY-MM-DD') }}</span> -
        <span>{{ moment(dateRange[1]).format('YYYY-MM-DD') }}</span>
      </div>
    </a-tabs>
    <a-table
      style="margin-top: 16px"
      :columns="columns"
      :loading="loading"
      bordered
      :data-source="items"
      :pagination="false"
      :scroll="{ y: 400 }"
      :row-key="(record, i) => i"
    >
      <template slot="over_60" slot-scope="text">
        <a-tooltip placement="topLeft">
          <span slot="title">{{ $t('over_60') }} {{ ' ' + text.over_60 }}</span>
          <a @click="ClickRowNewtCompanent(text, 'over_60')" style="color: blue">{{ text.over_60 }}</a>
        </a-tooltip>

      </template>
      <template slot="range_30_40" slot-scope="text">
        <a-tooltip placement="topLeft">
          <span slot="title">{{ $t('range_30_40') }} {{ ' ' + text.range_30_40 }}</span>
          <a @click="ClickRowNewtCompanent(text, 'range_30_40')" style="color: blue">{{ text.range_30_40 }}</a>
        </a-tooltip>

      </template>
      <template slot="range_40_60" slot-scope="text">
        <a-tooltip placement="topLeft">
          <span slot="title">{{ $t('range_40_60') }} {{ ' ' + text.range_40_60 }}</span>
          <a @click="ClickRowNewtCompanent(text, 'range_40_60')" style="color: blue">{{ text.range_40_60 }}</a>
        </a-tooltip>

      </template>
      <template slot="under_30" slot-scope="text">
        <a-tooltip placement="topLeft">
          <span slot="title">{{ $t('under_30') }} {{ ' ' + text.under_30 }}</span>
          <a @click="ClickRowNewtCompanent(text, 'under_30')" style="color: blue">{{ text.under_30 }}</a>
        </a-tooltip>

      </template>
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import dateLocal from '@/locales/datepicker'
import { notification } from 'ant-design-vue'
// import { jsontoexcel } from 'vue-table-to-excel'
export default {
  watch: {

  },
  name: 'DeliveryTime',
  data () {
    return {
      items: [],
      buttonLoading: false,
      local: dateLocal,
      loading: false,
      dateRange: [
        moment(new Date()), // today
        moment(new Date(new Date().setDate(new Date().getDate() + 1))), //  tomorrow
      ],
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'branch_name',
          key: 'branch_name',
        },
        {
          align: 'center',
          title: this.$t('under_30'),
          scopedSlots: { customRender: 'under_30' },
          // dataIndex: 'under_30',
          key: 'under_30',
          // width: 80,
        },
        {
          align: 'center',
          title: this.$t('range_40_60'),
          scopedSlots: { customRender: 'range_40_60' },
          // dataIndex: 'range_40_60',
          key: 'range_40_60',
          // width: 80,
        },
        {
          align: 'center',
          title: this.$t('range_30_40'),
          scopedSlots: { customRender: 'range_30_40' },
          // dataIndex: 'range_30_40',
          key: 'range_30_40',
          // width: 80,
        },
        {
          align: 'center',
          title: this.$t('over_60'),
          scopedSlots: { customRender: 'over_60' },
          // dataIndex: 'over_60',
          key: 'over_60',
          // width: 80,
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['FilyalBranchlist'])
  },
  methods: {
    selectColmuntNameFrom (value) {
      switch (value) {
        case 'over_60': return 60
        case 'range_30_40': return 30
        case 'range_40_60': return 40
        case 'under_30': return 0
      }
      return ''
    },
    selectColmuntNameTo (value) {
      switch (value) {
        case 'over_60': return 1000
        case 'range_30_40': return 40
        case 'range_40_60': return 60
        case 'under_30': return 30
      }
      return ''
    },
    downloadExcel () {
      const data = {
        start_date: moment(this.dateRange[0]).format('YYYY-MM-DD') + ' 05:00:00',
        end_date: moment(this.dateRange[1]).format('YYYY-MM-DD') + ' 05:00:00'
      }
      this.buttonLoading = true
      this.$store.dispatch('ExcelDeleviryTime', data)
        .then(res => {
          console.log(res)
          notification.success({
            message: this.$t('courierReport') + this.$t(' Excel файл готов'),
          })
          const elm = document.createElement('a')
          elm.setAttribute(
            'href',
            `${ res.url }`)
          elm.setAttribute('download', 'orderReport')
          elm.click()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.buttonLoading = false
        })
    },
    ClickRowNewtCompanent (type, columntype) {
      console.log(this.dateRange)
        const data = {
          start_date: moment(this.dateRange[0]).format('YYYY-MM-DD'),
          end_date: moment(this.dateRange[1]).format('YYYY-MM-DD'),
        range_time_from: this.selectColmuntNameFrom(columntype),
        range_time_to: this.selectColmuntNameTo(columntype)
      }
      console.log(this.dateRange[0]._d)
      const branchId = this.FilyalBranchlist.filter(e => e.name === type.branch_name ? e.id : '')[0].id
      console.log(type, columntype)
      this.$router.push({ name: 'ReportDelveryItem',
        query: { branchId: branchId, start_date: data.start_date, end_date: data.end_date, data: data } })
    },
    BranchList () {
      this.loading = true
      this.$store.dispatch('BranchListGet')
        .then(res => {
          // console.log('branchList =>> ', res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    moment,
    ...mapActions(['getDeliveryTimeReports']),
    onDateChange (val) {
      console.log(val)
      // console.log(moment(val[0]._d).format('YYYY-MM-DD hh:mm:ss'), moment(val[1]._i).format('YYYY-MM-DD hh:mm:ss'))
      if (Array.isArray(val)) {
        this.dateRange = [moment(val[0]._d), moment(val[1]._d)]
      } else {
        this.dateRange = [
          moment(val._d).format('YYYY-MM-DD'),
          moment(new Date(new Date().setDate(val._d.getDate() + 1))).format('YYYY-MM-DD')
        ]
      }
      this.getItems()
    },
    getItems () {
      this.loading = true
      const data = {
        start_date: moment(this.dateRange[0]).format('YYYY-MM-DD') + ' 05:00:00',
        end_date: moment(this.dateRange[1]).format('YYYY-MM-DD') + ' 05:00:00'
      }
      this.getDeliveryTimeReports(data)
        .then((res) => {
          this.items = res
          console.log(res)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted () {
    console.log(this.FilyalBranchlist)
  },
  created () {
    this.BranchList()
    this.getItems()
  },
}
</script>
