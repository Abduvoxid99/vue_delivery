<template>
<div class="client-report-table">
  <a-card :bordered="false">
    <div slot="extra">
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{ $t('Отчет по клиентам') }} </span>
        </template>
        <a-button @click="downloadExcel"> <a-icon type="download" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
      </a-tooltip>
    </div>
    <div slot="title">
      <a-form-model :rules="rules" :model="params" ref="ruleForm">
        <div class="title-row">
          <a-range-picker @change="onChangeFromDate" style="width: 170px" :placeholder="['От даты', 'До даты']" />
          <a-form-model-item ref="from_time" prop="from_time" style="margin-bottom: 0">
            <a-time-picker
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
          <a-form-model-item size="large" ref="to_time" prop="to_time" style="margin-bottom: 0">
            <a-time-picker
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
          <a-select allowClear show-search style="width: 126px" @change="handleMenuClick" :placeholder="$t('filterClientType')">
            <a-select-option
              v-for="(clientTtype, index) in ClientType"
              :key="index"
              :value="clientTtype.id"
              :title="clientTtype.name"
            >
              {{ clientTtype.name }}
            </a-select-option>
          </a-select>
          <a-select allowClear show-search style="width: 126px" @change="registrationFilter" :placeholder="$t('regerstratsiyaK')">
            <a-select-option
              v-for="(regis, index) in registration"
              :key="index"
              :value="regis.name"
              :title="regis.id"
            >
              {{ regis.id }}
            </a-select-option>
          </a-select>
          <a-input-search :placeholder="$t('to.search.client')" style="width: 150px" @search="onSearch" />
        </div>
        <!-- <a-row :gutter="16">
          <a-col :span="4">
            <a-range-picker @change="onChangeFromDate" style="margin-top: 5px; width: 80%" :placeholder="['От даты', 'До даты']">
            </a-range-picker>
          </a-col>
          <a-col :span="4">
            <a-form-model-item ref="from_time" prop="from_time">
              <a-time-picker
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
          <a-col :span="4" >
            <a-form-model-item size="large" ref="to_time" prop="to_time">
              <a-time-picker
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
          <a-col :span="4">
            <a-select allowClear show-search style="width: 60%" @change="handleMenuClick" :placeholder="$t('filterClientType')">
              <a-select-option
                v-for="(clientTtype, index) in ClientType"
                :key="index"
                :value="clientTtype.id"
                :title="clientTtype.name"
              >
                {{ clientTtype.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-select allowClear show-search style="width: 60%" @change="registrationFilter" :placeholder="$t('regerstratsiyaK')">
              <a-select-option
                v-for="(regis, index) in registration"
                :key="index"
                :value="regis.name"
                :title="regis.id"
              >
                {{ regis.id }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row> -->
      </a-form-model>
    </div>
    <div>
      <a-table
        :columns="column"
        :dataSource="data"
        :scroll="{ x: 2500, y: 450 }"
        bordered
        :rowKey="record => record.clinet_id"
        :loading="loading"
        @change="changeTablePagination"
        :customRow="customRowClik"
        :pagination="ClientPaginationRepeort"
        style="cursor: pointer"
      >
      <span slot="Имя">
          <div style="display: flex; width: 100%; align-items: center">
            <span>Имя</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('client_name')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.clientname" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.clientname" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
        </span>
        <span slot="Номер телефона">
          <div style="display: flex; width: 100%; align-items: center">
            <span>{{ $t('phone') }}</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('clinet_phone')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.numberphone" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.numberphone" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
        </span>
        <span slot="Дата рождения">
          <div style="display: flex; width: 100%; align-items: center">
            <span>Дата рождения</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('date_of_birth')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.datebirth" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.datebirth" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
        </span>
        <span slot="Дата регистрации">
          <div style="display: flex; width: 100%; align-items: center">
            <span>Дата регистрации</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('created_at')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.registrationdate" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.registrationdate" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
        </span>
        <span slot="Источник регистрации">
          <div style="display: flex; width: 100%; align-items: center">
            <span>Источник регистрации</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('date_of_birth')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.Source" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.Source" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
        </span>
        <span slot="Тип клиента">
          <div style="display: flex; width: 100%; align-items: center">
            <span>Тип клиента</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('client_type')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.clienttype" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.clienttype" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
        </span>
        <span slot="Количество заказов">
          <div style="display: flex; width: 100%; align-items: center">
            <span>Количество заказов</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('order_count')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.typeOrder" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.typeOrder" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
        </span>
        <span slot="Чек (Средний)">
          <div style="display: flex; width: 100%; align-items: center">
            <span>Чек (Средний)</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('avg_sum')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.avgcheck" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.avgcheck" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
        </span>
        <span slot="Чек(Самый большой)" >

          <div style="display: flex; width: 100%; align-items: center">
            <span>Чек(Самый большой)</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('max_sum')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.bigcheck" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.bigcheck" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
      </span>
        <span slot="Чек(Самый маленький)" >

          <div style="display: flex; width: 100%; align-items: center">
            <span>Чек(Самый маленький)</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('min_sum')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.mincheck" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.mincheck" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
      </span>
        <span slot="Итого сумма заказов" >

          <div style="display: flex; width: 100%; align-items: center">
            <span>Итого сумма заказов</span>
            <span style="margin-left: 20px">
              <a-button @click="SortColumn('total_sum')" size="small" style="background-color: #FAFAFA">
                <a-icon v-if="TableheaderIcons.allsumm" :component="$myIcon.bxicons1"></a-icon>
                <a-icon v-if="!TableheaderIcons.allsumm" :component="$myIcon.bxicons2"></a-icon>
              </a-button>
            </span>
          </div>
      </span>
        <template slot="text" slot-scope="row">
          <a-tag color="blue">{{ moment(row.created_at).format('YYYY-MM-DD') }}</a-tag>
        </template>
        <template slot="web" slot-scope="row">
          <div :style="{textAlign: 'center'}">
            <img v-if="row.platform === 'admin-panel'" src="../../orderNew/icons/consulting.svg" style="width: 70%; height: 35px" />
            <img v-if="row.platform === 'bot'" src="../../orderNew/icons/telegram.svg" style="width: 70%; height: 35px" />
            <img v-if="row.platform === 'android'" src="../../orderNew/icons/android.svg" style="width: 70%; height: 35px" />
            <img v-if="row.platform === 'ios'" src="../../orderNew/icons/ios.svg" style="width: 70%; height: 35px" />
            <img v-if="row.platform === 'website'" src="../../orderNew/icons/internet.png" style="width: 35px; height: 35px" />
            <!--          <img v-if="row.platform === 'web'" src="../../orderNew/icons/globe.svg" style="width: 70%; height: 35px" />-->
          </div>
          <!--          <p>{{ row.totalPrice }}</p>-->
          <!--            <p>{{ row.paid }}</p>-->
          <!--      <a-tag color="blue">{{ moment(row.created_at).format('YYYY-MM-DD') }}</a-tag>-->
          <!--    <span>{{row.platform}}</span>-->
        </template>
  <!--      <template slot="id" slot-scope="text"> <span>{{ updateIndex (text.clinet_id) }}</span></template>-->

      </a-table>
    </div>
  </a-card>
</div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import { notification } from 'ant-design-vue'
// import { jsontoexcel } from 'vue-table-to-excel'
export default {
data () {
  return {
    data: [],
    TableheaderIcons: {
      clientname: false,
      numberphone: false,
      datebirth: false,
      registrationdate: false,
      Source: false,
      typeOrder: false,
      buttonLoading: false,
      avgcheck: false,
      bigcheck: false,
      mincheck: false,
      allsumm: false,

    },
    registration: [
      { id: 'Админ', name: 'admin-panel' },
      { id: 'Бот  ', name: 'bot' },
      { id: 'Апп ', name: 'app' },
      { id: 'Веб сайть ', name: 'website' }],
    params: {
      registration_source: '',
      page: { current: 1, pageSize: 100, total: null },
      to_date: moment().format('YYYY-MM-DD'),
      from_date: this.format(),
      to_time: '23:59:00',
      from_time: '00:01:00',
      sort_by: '',
      sort_type: '',
      customer_type_id: '',
      search: ''
    },
    loading: false,
    open1: false,
    open2: false,
    rules: {
      to_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
      from_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }]
    },
  }
},
  methods: {
    ...mapActions(['getClientReportAllList', 'getAllCustomersType']),
    onSearch (val) {
      console.log(val)
      this.params.search = val
      this.getClientAllList()
    },
    changeTablePagination (pagination) {
      this.params.page = { ...pagination }
      this.$router.push({ name: this.$route.name, query: { page: pagination.current, limit: pagination.pageSize } })
      this.loading = true
      this.getClientReportAllList(this.params)
        .finally(() => {
          this.loading = false
        })
    },
    setIndexToData (list, page = 1, limit = 100) {
      this.data = list.map((val, index) => ({
        ...val,
        index: (page - 1) * limit + index + 1
      }))
      console.log(this.data)
    },
    customRowClik (record) {
      const formDatas = this.params.from_date
      const todata = this.params.to_date
      const data = {
        fromData: this.params.from_time ? formDatas + ' ' + this.params.from_time : `${formDatas}  05:00:00`,
        toDate: this.params.to_time ? `${todata}` + ' ' + this.params.to_time : moment(todata).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00'
      }
      return {
        on: {
          click: event => {
            this.$router.push({
              name: 'ReportClientItemTable',
              query: { clientId: record.clinet_id, from_date: data.fromData, to_date: data.toDate }
            })
          }
        }
      }
    },
    getClientAllList () {
      this.loading = true
      this.getClientReportAllList(this.params)
      .finally(() => {
        this.loading = false
      })
    },
    format () {
      const dateFrom = moment().subtract(2, 'd').format('YYYY-MM-DD')
      return dateFrom
    },
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('ClierntsReportExcel', this.params)
        .then(res => {
          notification.success({
            message: this.$t('Клиент Excel файл готов'),
          })
          const elm = document.createElement('a')
          elm.setAttribute('href', `${res.url}`)
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
    sortDescAsc (value) {
      this.params.sort_type = this.SortTableHeaderIcons(value) ? 'desc' : 'asc'
      this.params.sort_by = value
    },
    SortTableHeaderIcons (value) {
      switch (value) {
        case 'client_name': this.TableheaderIcons.clientname = !this.TableheaderIcons.clientname
          return this.TableheaderIcons.clientname
        case 'clinet_phone': this.TableheaderIcons.numberphone = !this.TableheaderIcons.numberphone
          return this.TableheaderIcons.numberphone
        case 'date_of_birth': this.TableheaderIcons.datebirth = !this.TableheaderIcons.datebirth
          return this.TableheaderIcons.datebirth
        case 'created_at': this.TableheaderIcons.registrationdate = !this.TableheaderIcons.registrationdate
          return this.TableheaderIcons.registrationdate
        case 'platform': this.TableheaderIcons.Source = !this.TableheaderIcons.Source
          return this.TableheaderIcons.Source
        case 'client_type': this.TableheaderIcons.typeOrder = !this.TableheaderIcons.typeOrder
          return this.TableheaderIcons.typeOrder
        case 'order_count': this.TableheaderIcons.clientname = !this.TableheaderIcons.clientname
          return this.TableheaderIcons.clientname
        case 'avg_sum': this.TableheaderIcons.avgcheck = !this.TableheaderIcons.avgcheck
          return this.TableheaderIcons.avgcheck
        case 'max_sum': this.TableheaderIcons.bigcheck = !this.TableheaderIcons.bigcheck
          return this.TableheaderIcons.bigcheck
        case 'min_sum': this.TableheaderIcons.mincheck = !this.TableheaderIcons.mincheck
          return this.TableheaderIcons.mincheck
        case 'total_sum': this.TableheaderIcons.allsumm = !this.TableheaderIcons.allsumm
          return this.TableheaderIcons.allsumm
      }
    },
    SortColumn (value) {
      this.sortDescAsc(value)
      this.getClientAllList()
    },
    BranchListGetReport () {
      this.loading = true
      this.$store.dispatch('getBranchTimeReports', this.params).finally(() => {
        this.loading = false
      })
    },
  moment,
    registrationFilter (value, key, sel) {
      // console.log(value)
      this.params.registration_source = value
      this.getClientAllList()
    },
    handleMenuClick (val, key, sel) {
      this.params.customer_type_id = val
      // console.log(val)
      this.getClientAllList()
      // console.log(val)
      // console.log(this.filayalId)
    },
    onChangeFromDate (value, dateString) {
      this.newarrayDate = dateString
      console.log('dateString', dateString)
      this.params.from_date = dateString[0]
      this.params.to_date = dateString[1]
      this.getClientAllList()
    },
    onTimePickerForm (value, pageTime) {
      this.params.from_time = pageTime
      // console.log(value)
      // eslint-disable-next-line no-unused-expressions
      this.params.to_time === '' ? '' : this.params.to_time
      this.onSubmit()
    },
    handleClose (value) {
      // console.log(value)
      this.open1 = false
      this.open2 = false
    },
    onSubmit () {
      this.loading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.getClientAllList()
        } else {
          this.loading = false
          return false
        }
      })
    },
    clientTypeList () {
      this.loading = true
      this.getAllCustomersType(this.params.page)
      .finally(() => {
        this.loading = false
      })
    },
    onTimePicerTo (value, pageTime) {
      // console.log(value)
      this.params.to_time = pageTime
      // eslint-disable-next-line no-unused-expressions
      this.params.from_time === '' ? '' : this.params.from_time
      this.onSubmit()
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    // format () {
    //   const dateFrom = moment()
    //     .subtract(5, 'd')
    //     .format('YYYY-MM-DD')
    //   return dateFrom
    // },
  },
  watch: {
    ClientRectList: {
      immediate: true,
      handler (newData) {
        console.log('data changed', newData)
        this.setIndexToData(newData, this.$route.query.page, this.$route.query.limit)
      }
    }
  },
  mounted () {
  this.getClientAllList()
    this.clientTypeList()
  },
  computed: {
    column () {
      return [
        {
          title: this.$t('ordernumber'),
          fixed: 'left',
          dataIndex: 'index',
          // eslint-disable-next-line no-undef
          align: 'center',
          width: 80,
          // eslint-disable-next-line standard/object-curly-even-spacing
          // scopedSlots: { customRender: 'id' }
        },
        {
          slots: { title: 'Имя' },
          // scopedSlots: { customRender: 'name' },
          dataIndex: 'client_name',
          name: 'Имя',
          align: 'center',
          width: '150px'
        },
        {
          slots: { title: 'Номер телефона' },
          // scopedSlots: { customRender: 'text' },
          dataIndex: 'clinet_phone',
          align: 'center',
          name: 'Номер телефона'
        },
        {
          slots: { title: 'Чек (Средний)' },
          // scopedSlots: { customRender: 'text' },
          dataIndex: 'avg_sum',
          align: 'center',
          width: '220px',
          name: 'Чек (Средний)'
        },
        {
          slots: { title: 'Чек(Самый большой)' },
          // scopedSlots: { customRender: 'text' },
          dataIndex: 'max_sum',
          align: 'center',
          width: '250px',
          name: 'Чек(Самый большой)'
        },
        {
          slots: { title: 'Чек(Самый маленький)' },
          // scopedSlots: { customRender: 'text' },
          dataIndex: 'min_sum',
          align: 'center',
          width: '250px',
          name: 'Чек(Самый маленький)'
        },
        {
          slots: { title: 'Количество заказов' },
          // scopedSlots: { customRender: 'text' },
          dataIndex: 'order_count',
          align: 'center',
          name: 'Количество заказов',
          width: '220px'
        },
        {
          slots: { title: 'Итого сумма заказов' },
          // scopedSlots: { customRender: 'text' },
          dataIndex: 'total_sum',
          align: 'center',
          width: '250px',
          name: 'Итого сумма заказов'
        },
        {
          slots: { title: 'Дата рождения' },
          scopedSlots: { customRender: 'text' },
          // dataIndex: 'date_of_birth',
          align: 'center',
          name: 'Дата рождения',
          width: '220px'
        },
        {
          slots: { title: 'Дата регистрации' },
          scopedSlots: { customRender: 'text' },
          // dataIndex: 'percent_over_60',
          align: 'center',
          name: 'Дата регистрации'
        },
        {
          slots: { title: 'Источник регистрации' },
          scopedSlots: { customRender: 'web' },
          // dataIndex: 'platform',
          align: 'center',
          name: 'Источник регистрации'
        },
        {
          slots: { title: 'Тип клиента' },
          // scopedSlots: { customRender: 'text' },
          dataIndex: 'client_type',
          align: 'center',
          width: '220px',
          name: 'Тип клиента'
        }
      ]
    },
    ...mapGetters(['ClientRectList', 'ClientPaginationRepeort', 'ClientType'])
  }
}
</script>

<style>
  .client-report-table {
    width: 100%;
  }
  .client-report-table .ant-card-head {
    padding: 0;
  }
  .client-report-table .ant-card-body {
    padding-left: 0;
    padding-right: 0;
  }
  .client-report-table .title-row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: 8px;
  }
</style>
