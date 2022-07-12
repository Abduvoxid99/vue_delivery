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
              <a-button @click="downloadExcelForecast">
                <a-icon :type="buttonLoading ? 'loading' : 'download'"
                  style="color: blue; font-size: 1.1rem; background-color: "></a-icon>
              </a-button>
            </a-tooltip>
          </div>
        </div>
        <a-table style="margin-top: 16px" :columns="columns" :loading="loading" bordered :data-source="items"
          :pagination="false" :scroll="{ x: 1300, y: 600 }" :row-key="(record, i) => i">
          <template slot="range_10_11" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_10_11') }} {{ ' ' + text.from10to11 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_10_11')" style="color: blue">{{ text.from10to11 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_11_12" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_11_12') }} {{ ' ' + text.from11to12 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_11_12')" style="color: blue">{{ text.from11to12 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_12_13" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_12_13') }} {{ ' ' + text.from12to13 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_12_13')" style="color: blue">{{ text.from12to13 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_13_14" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_13_14') }} {{ ' ' + text.from13to14 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_13_14')" style="color: blue">{{ text.from13to14 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_14_15" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_14_15') }} {{ ' ' + text.from14to15 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_14_15')" style="color: blue">{{ text.from14to15 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_15_16" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_15_16') }} {{ ' ' + text.from15to16 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_15_16')" style="color: blue">{{ text.from15to16 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_16_17" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_16_17') }} {{ ' ' + text.from16to17 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_16_17')" style="color: blue">{{ text.from16to17 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_17_18" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_17_18') }} {{ ' ' + text.from17to18 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_17_18')" style="color: blue">{{ text.from17to18 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_18_19" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_18_19') }} {{ ' ' + text.from18to19 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_18_19')" style="color: blue">{{ text.from18to19 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_19_20" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_19_20') }} {{ ' ' + text.from19to20 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_19_20')" style="color: blue">{{ text.from19to20 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_20_21" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_20_21') }} {{ ' ' + text.from20to21 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_20_21')" style="color: blue">{{ text.from20to21 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_21_22" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_21_22') }} {{ ' ' + text.from21to22 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_21_22')" style="color: blue">{{ text.from21to22 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_22_23" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_22_23') }} {{ ' ' + text.from22to23 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_22_23')" style="color: blue">{{ text.from22to23 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_23_00" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_23_00') }} {{ ' ' + text.from23to00 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_23_00')" style="color: blue">{{ text.from23to00 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_00_01" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_00_01') }} {{ ' ' + text.from00to01 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_00_01')" style="color: blue">{{ text.from00to01 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_01_02" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_01_02') }} {{ ' ' + text.from01to02 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_01_02')" style="color: blue">{{ text.from01to02 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_02_03" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_02_03') }} {{ ' ' + text.from02to03 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_02_03')" style="color: blue">{{ text.from02to03 }}</a>
            </a-tooltip>

          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('all_report')">
        <a-date-picker :defaultValue="dateRange[0]" :local="local" @change="onDateChangeProduct" />
        <a-select allowClear v-model="paramsProduct.branch_id" style="width: 200px; margin-left: 15px" @change="handleChangeProduct" :placeholder="$t('seelctplaceholder')">
            <a-select-option
              v-for="(item, index) in items"
              :key="index"
              :value="item.branch_id"
              :title="item.branch_name "
            >
              {{ item.branch_name }}
            </a-select-option>
        </a-select>
        <div style="float:right;">
          <div>
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ $t('courierReport') }} Скачать файл</span>
              </template>
              <a-button @click="downloadExcelForecastProduct">
                <a-icon type="download" style="color: blue; font-size: 1.1rem; background-color: "></a-icon>
              </a-button>
            </a-tooltip>
          </div>
        </div>
        <a-table style="margin-top: 16px" :columns="columnsProduct" :loading="loading" bordered :data-source="itemsProduct"
          :pagination="false" :scroll="{ x: 1300, y: 600 }" :row-key="(record, i) => i">
          <template slot="range_10_11" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_10_11') }} {{ ' ' + text.from10to11 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_10_11')" style="color: blue">{{ text.from10to11 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_11_12" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_11_12') }} {{ ' ' + text.from11to12 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_11_12')" style="color: blue">{{ text.from11to12 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_12_13" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_12_13') }} {{ ' ' + text.from12to13 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_12_13')" style="color: blue">{{ text.from12to13 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_13_14" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_13_14') }} {{ ' ' + text.from13to14 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_13_14')" style="color: blue">{{ text.from13to14 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_14_15" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_14_15') }} {{ ' ' + text.from14to15 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_14_15')" style="color: blue">{{ text.from14to15 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_15_16" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_15_16') }} {{ ' ' + text.from15to16 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_15_16')" style="color: blue">{{ text.from15to16 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_16_17" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_16_17') }} {{ ' ' + text.from16to17 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_16_17')" style="color: blue">{{ text.from16to17 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_17_18" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_17_18') }} {{ ' ' + text.from17to18 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_17_18')" style="color: blue">{{ text.from17to18 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_18_19" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_18_19') }} {{ ' ' + text.from18to19 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_18_19')" style="color: blue">{{ text.from18to19 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_19_20" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_19_20') }} {{ ' ' + text.from19to20 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_19_20')" style="color: blue">{{ text.from19to20 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_20_21" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_20_21') }} {{ ' ' + text.from20to21 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_20_21')" style="color: blue">{{ text.from20to21 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_21_22" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_21_22') }} {{ ' ' + text.from21to22 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_21_22')" style="color: blue">{{ text.from21to22 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_22_23" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_22_23') }} {{ ' ' + text.from22to23 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_22_23')" style="color: blue">{{ text.from22to23 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_23_00" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_23_00') }} {{ ' ' + text.from23to00 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_23_00')" style="color: blue">{{ text.from23to00 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_00_01" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_00_01') }} {{ ' ' + text.from00to01 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_00_01')" style="color: blue">{{ text.from00to01 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_01_02" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_01_02') }} {{ ' ' + text.from01to02 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_01_02')" style="color: blue">{{ text.from01to02 }}</a>
            </a-tooltip>

          </template>
          <template slot="range_02_03" slot-scope="text">
            <a-tooltip placement="topLeft">
              <span slot="title">{{ $t('range_02_03') }} {{ ' ' + text.from02to03 }}</span>
              <a @click="ClickRowNewtCompanent(text, 'range_02_03')" style="color: blue">{{ text.from02to03 }}</a>
            </a-tooltip>

          </template>
        </a-table>
      </a-tab-pane>
      <div slot="tabBarExtraContent">
        <span>{{ moment(dateRange[0]).format('YYYY-MM-DD') }}</span> -
        <span>{{ moment(dateRange[1]).format('YYYY-MM-DD') }}</span>
      </div>
    </a-tabs>
  </a-card>
</template>

<script>
  import moment from 'moment'
  import {
    mapActions,
    mapGetters
  } from 'vuex'
  import dateLocal from '@/locales/datepicker'
  import {
    notification
  } from 'ant-design-vue'
  // import { jsontoexcel } from 'vue-table-to-excel'
  export default {
    watch: {

    },
    name: 'DeliveryTime',
    data () {
      return {
        items: [],
        itemsProduct: [],
        buttonLoading: false,
        local: dateLocal,
        loading: false,
        dateRange: [
          moment(new Date()), // today
        ],
        paramsProduct: {
          branch_id: '',
          dateRange: [
        moment(new Date()), // today
        moment(new Date(new Date().setDate(new Date().getDate() + 1))), //  tomorrow
        ],
        },
        columns: [{
            title: this.$t('name'),
            dataIndex: 'branch_name',
            key: 'branch_name',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 10 до 11'),
            scopedSlots: {
              customRender: 'range_10_11'
            },
            // dataIndex: 'under_30',
            key: 'range_10_11',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 11 до 12'),
            scopedSlots: {
              customRender: 'range_11_12'
            },
            // dataIndex: 'under_30',
            key: 'range_11_12',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 12 до 13'),
            scopedSlots: {
              customRender: 'range_12_13'
            },
            key: 'range_12_13',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 13 до 14'),
            scopedSlots: {
              customRender: 'range_13_14'
            },
            key: 'range_13_14',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 14 до 15'),
            scopedSlots: {
              customRender: 'range_14_15'
            },
            key: 'range_14_15',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 15 до 16'),
            scopedSlots: {
              customRender: 'range_15_16'
            },
            key: 'range_15_16',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 16 до 17'),
            scopedSlots: {
              customRender: 'range_16_17'
            },
            key: 'range_16_17',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 17 до 18'),
            scopedSlots: {
              customRender: 'range_17_18'
            },
            key: 'range_17_18',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 18 до 19'),
            scopedSlots: {
              customRender: 'range_18_19'
            },
            key: 'range_18_19',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 19 до 20'),
            scopedSlots: {
              customRender: 'range_19_20'
            },
            key: 'range_19_20',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 20 до 21'),
            scopedSlots: {
              customRender: 'range_20_21'
            },
            key: 'range_20_21',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 21 до 22'),
            scopedSlots: {
              customRender: 'range_21_22'
            },
            key: 'range_21_22',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 22 до 23'),
            scopedSlots: {
              customRender: 'range_22_23'
            },
            key: 'range_22_23',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 23 до 00'),
            scopedSlots: {
              customRender: 'range_23_00'
            },
            key: 'range_23_00',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 0 до 01'),
            scopedSlots: {
              customRender: 'range_00_01'
            },
            key: 'range_00_01',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 01 до 02'),
            scopedSlots: {
              customRender: 'range_01_02'
            },
            key: 'range_01_02',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 02 до 03'),
            scopedSlots: {
              customRender: 'range_02_03'
            },
            key: 'range_02_03',
            width: 150
          },
        ],
        columnsProduct: [{
            title: this.$t('name'),
            dataIndex: 'product_name',
            key: 'product_name',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 10 до 11'),
            scopedSlots: {
              customRender: 'range_10_11'
            },
            // dataIndex: 'under_30',
            key: 'range_10_11',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 11 до 12'),
            scopedSlots: {
              customRender: 'range_11_12'
            },
            // dataIndex: 'under_30',
            key: 'range_11_12',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 12 до 13'),
            scopedSlots: {
              customRender: 'range_12_13'
            },
            key: 'range_12_13',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 13 до 14'),
            scopedSlots: {
              customRender: 'range_13_14'
            },
            key: 'range_13_14',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 14 до 15'),
            scopedSlots: {
              customRender: 'range_14_15'
            },
            key: 'range_14_15',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 15 до 16'),
            scopedSlots: {
              customRender: 'range_15_16'
            },
            key: 'range_15_16',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 16 до 17'),
            scopedSlots: {
              customRender: 'range_16_17'
            },
            key: 'range_16_17',
            width: 150,
          },
          {
            align: 'center',
            title: this.$t('От 17 до 18'),
            scopedSlots: {
              customRender: 'range_17_18'
            },
            key: 'range_17_18',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 18 до 19'),
            scopedSlots: {
              customRender: 'range_18_19'
            },
            key: 'range_18_19',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 19 до 20'),
            scopedSlots: {
              customRender: 'range_19_20'
            },
            key: 'range_19_20',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 20 до 21'),
            scopedSlots: {
              customRender: 'range_20_21'
            },
            key: 'range_20_21',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 21 до 22'),
            scopedSlots: {
              customRender: 'range_21_22'
            },
            key: 'range_21_22',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 22 до 23'),
            scopedSlots: {
              customRender: 'range_22_23'
            },
            key: 'range_22_23',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 23 до 00'),
            scopedSlots: {
              customRender: 'range_23_00'
            },
            key: 'range_23_00',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 0 до 01'),
            scopedSlots: {
              customRender: 'range_00_01'
            },
            key: 'range_00_01',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 01 до 02'),
            scopedSlots: {
              customRender: 'range_01_02'
            },
            key: 'range_01_02',
            width: 150
          },
          {
            align: 'center',
            title: this.$t('От 02 до 03'),
            scopedSlots: {
              customRender: 'range_02_03'
            },
            key: 'range_02_03',
            width: 150
          },
        ]
      }
    },
    computed: {
      ...mapGetters(['FilyalBranchlist'])
    },
    methods: {
      selectColmuntNameFrom (value) {
        switch (value) {
          case 'over_60':
            return 60
          case 'range_30_40':
            return 30
          case 'range_40_60':
            return 40
          case 'under_30':
            return 0
        }
        return ''
      },
      selectColmuntNameTo (value) {
        switch (value) {
          case 'over_60':
            return 1000
          case 'range_30_40':
            return 40
          case 'range_40_60':
            return 60
          case 'under_30':
            return 30
        }
        return ''
      },
      downloadExcel () {
        const data = {
          start_date: moment(this.dateRange[0]).format('YYYY-MM-DD'),
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
      downloadExcelForecast () {
        const data = {
          date: moment(this.dateRange[0]).format('YYYY-MM-DD'),
        }
        this.buttonLoading = true
        this.$store.dispatch('ExcelForecastDelivery', data)
          .then(res => {
            console.log(res)
            notification.success({
              message: this.$t('courierReport') + this.$t('Excel файл готов'),
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
       downloadExcelForecastProduct () {
        const data = {
          branch_id: this.paramsProduct.branch_id,
          date: moment(this.paramsProduct.dateRange[0]).format('YYYY-MM-DD'),
        }
        this.buttonLoading = true
        this.$store.dispatch('ExcelForecastProduct', data)
          .then(res => {
            console.log(res)
            notification.success({
              message: this.$t('courierReport') + this.$t('Excel файл готов'),
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
        this.$router.push({
          name: 'ReportDelveryItem',
          query: {
            branchId: branchId,
            start_date: data.start_date,
            end_date: data.end_date,
            data: data
          }
        })
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
      ...mapActions(['getForecastDeliveryReports', 'getForecastProductReports']),
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
      onDateChangeProduct (val) {
        console.log(val)
        // console.log(moment(val[0]._d).format('YYYY-MM-DD hh:mm:ss'), moment(val[1]._i).format('YYYY-MM-DD hh:mm:ss'))
        if (Array.isArray(val)) {
          this.paramsProduct.dateRange = [moment(val[0]._d), moment(val[1]._d)]
        } else {
          this.paramsProduct.dateRange = [
            moment(val._d).format('YYYY-MM-DD'),
            moment(new Date(new Date().setDate(val._d.getDate() + 1))).format('YYYY-MM-DD')
          ]
        }
        this.getItemsBranch()
        this.getItems()
      },
      handleChangeProduct () {
        this.getItemsProduct()
      },
      getItems () {
        this.loading = true
        const data = {
          start_date: moment(this.dateRange[0]).format('YYYY-MM-DD'),
        }
        this.getForecastDeliveryReports(data)
          .then((res) => {
            this.items = res
            console.log('111', res)
          })
          .finally(() => {
            this.loading = false
          })
      },
      getItemsBranch () {
        this.loading = true
        const data = {
          start_date: moment(this.paramsProduct.dateRange[0]).format('YYYY-MM-DD'),
        }
        this.getForecastDeliveryReports(data)
          .then((res) => {
            this.items = res
            console.log('111', res)
          })
          .finally(() => {
            this.loading = false
          })
      },
      getItemsProduct () {
        this.loading = true
        console.log('111', this.paramsProduct.branch_id)
        const data = {
          branch_id: this.paramsProduct.branch_id,
          start_date: moment(this.paramsProduct.dateRange[0]).format('YYYY-MM-DD'),
        }
        this.getForecastProductReports(data)
          .then((res) => {
            this.itemsProduct = res
            console.log('1112', res)
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
      this.getItemsProduct()
    },
  }
</script>
