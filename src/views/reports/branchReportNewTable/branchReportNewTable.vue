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
          <a-row type="flex" :gutter="[20,20]">
            <a-col >
              <a-range-picker @change="onChangeFromDate" style="margin-top: 5px" :placeholder="['От даты' ,'До даты']">
              </a-range-picker>
            </a-col>
            <a-col>
              <a-form-model-item ref="from_time" prop="from_time">
                <a-time-picker v-model="params.from_time" @change="onTimePickerForm" :open.sync="open1" placeholder="От времени" valueFormat="hh:mm:ss">
                  <a-button slot="addon" size="small" type="primary" @click="handleClose">
                    Ok
                  </a-button>
                </a-time-picker>
              </a-form-model-item>
            </a-col>
            <a-col >
              <a-form-model-item size="large" ref="to_time" prop="to_time">
                <a-time-picker v-model="params.to_time" @change="onTimePicerTo" :open.sync="open2" placeholder="До времени" valueFormat="hh:mm:ss">
                  <a-button slot="addon" size="small" type="primary" @click="handleClose">
                    Ok
                  </a-button>
                </a-time-picker>
              </a-form-model-item>
            </a-col>
            <a-col :xs="12" :md="5" >
              <!--                Выбрать филиал-->
              <a-select show-search style="width: 100%" @change="handleMenuClick" :placeholder="$t('seelctplaceholder')">
                <a-select-option v-for="(filayalname, index) in FilyalBranchlist" :key="index" :value="filayalname.id" :title="filayalname.name">
                  {{ filayalname.name }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div slot="extra">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ $t('reportBranch') }}</span>
          </template>
          <a-button @click="downloadExcel"> <a-icon :type="buttonLoading ? 'loading' : 'download'" style="color: blue; font-size: 1.1rem; background-color: "></a-icon></a-button>
        </a-tooltip>
      </div>
  <a-table
    style="cursor:pointer;"
    :columns="column"
    :dataSource="filteredBranches"
    :pagination="false"
    :rowKey="record => record.name"
    :loading="loading"
    :scroll="{ x: 4200, y: 400 }"
    :customRow="customRowClik"
    bordered
  >
                  <span slot="name">
                    <div style="display: flex; width: 100%"><span>{{ $t('name') }}</span>
                      <span style="margin-left: 20px">
                        <a-button @click="button('branch_name')" size="small" style="background-color: #FAFAFA">
                                   <a-icon v-if="names" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!names" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="admin">
                    <div style="display: flex; width: 100%"><span>{{ $t('admin') }}</span>
                      <span style="margin-left: 20px">
                        <a-button @click="button('admin_panel_orders_count')" size="small" style="background-color: #FAFAFA">
                                   <a-icon v-if="admin" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!admin" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="admin_avg">
                    <div style="display: flex; width: 100%"><span>{{ $t('Админка ср. чек') }}</span>
                      <span style="margin-left: 20px">
                        <a-button @click="button('admin_average_sum')" size="small" style="background-color: #FAFAFA">
                                   <a-icon v-if="admin" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!admin" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="bot">
                    <div style="display: flex; width: 100%"><span>{{ $t('bot') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('bot_orders_count')">
                                   <a-icon v-if="bot" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!bot" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                      </span>
                    </div>
                  </span>
                  <span slot="bot_avg">
                    <div style="display: flex; width: 100%"><span>{{ $t('Бот ср. чек') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('bot_average_sum')">
                                   <a-icon v-if="bot" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!bot" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                      </span>
                    </div>
                  </span>
                  <span slot="app">
                    <div style="display: flex; width: 100%"><span>{{ $t('app') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('app_orders_count')">
                                   <a-icon v-if="app" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!app" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="app_avg">
                    <div style="display: flex; width: 100%"><span>{{ $t('Программа ср. чек') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('app_average_sum')">
                                   <a-icon v-if="app" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!app" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="website_orders_count">
                    <div style="display: flex; width: 100%"><span>{{ $t('Заказы на сайте') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('website_orders_count')">
                                   <a-icon v-if="websiteorderscount" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!websiteorderscount" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
<!--                  <span slot="aggregators">-->
<!--                    <div style="display: flex; width: 100%"><span>{{ $t('aggregators') }}</span>-->
<!--                      <span style="margin-left: 20px">-->
<!--                        <a-button size="small" style="background-color: #FAFAFA" @click="button('aggregator')">-->
<!--                                   <a-icon v-if="aggregators" :component="$myIcon.bxicons1"></a-icon>-->
<!--                                   <a-icon v-if="!aggregators" :component="$myIcon.bxicons2"></a-icon>-->
<!--                        </a-button>-->
<!--                  </span>-->
<!--                  </div>-->
<!--                  </span>-->
                  <span slot="all_orders">
                    <div style="display: flex; width: 100%"><span>{{ $t('all_orders') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('total_orders_count')">
                                   <a-icon v-if="allorders" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!allorders" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="totalSum">
                    <div style="display: flex; width: 100%"><span>{{ $t('totalSum') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('total_sum')">
                                   <a-icon v-if="totalSum" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!totalSum" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="delevery">
                    <div style="display: flex; width: 100%"><span>{{ $t('delevery') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('total_delivery_sum')">
                                   <a-icon v-if="totaldeliverysum" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!totaldeliverysum" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="total_self_pick_up">
                    <div style="display: flex; width: 100%"><span>{{ $t('Общая сумма самовывоза') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('total_self_pick_up_sum')">
                                   <a-icon v-if="totalselfpickupsum" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!totalselfpickupsum" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="free_delivery">
                    <div style="display: flex; width: 100%"><span>{{ $t('Бесплатная доставка') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('free_delivery')">
                                   <a-icon v-if="freedelivery" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!freedelivery" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="total_sum_cash">
                    <div style="display: flex; width: 100%"><span>{{ $t('Общая сумма наличные') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('cash_sum')">
                                   <a-icon v-if="totalsumcash" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!totalsumcash" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="total_cash_delivery_sum">
                    <div style="display: flex; width: 100%"><span>{{ $t('Общая сумма доставки(наличные)') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('cash_delivery_sum')">
                                   <a-icon v-if="totalcashdeliverysum" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!totalcashdeliverysum" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="total_sum_payme">
                    <div style="display: flex; width: 100%"><span>{{ $t('Общая сумма Payme') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('total_sum_payme')">
                                   <a-icon v-if="totalsumpayme" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!totalsumpayme" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="total_payme_delivery_sum">
                    <div style="display: flex; width: 100%"><span>{{ $t('Общая сумма доставки (Payme)') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('total_payme_delivery_sum')">
                                   <a-icon v-if="totalpaymedeliverysum" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!totalpaymedeliverysum" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="total_sum_transfer">
                    <div style="display: flex; width: 100%"><span>{{ $t('Общая сумма по перечислению') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('transfer_sum')">
                                   <a-icon v-if="totalsumtransfer" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!totalsumtransfer" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="total_transfer_delivery_sum">
                    <div style="display: flex; width: 100%"><span>{{ $t('Общая сумма доставки(перечисление)') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('transfer_delivery_sum')">
                                   <a-icon v-if="transferdeliverysum" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!transferdeliverysum" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="Click">
                    <div style="display: flex; width: 100%"><span>{{ $t('Click') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('click_sum')">
                                   <a-icon v-if="clicksum" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!clicksum" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="total_click_delivery_sum">
                    <div style="display: flex; width: 100%"><span>{{ $t('Общая сумма доставки (Click)') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('click_delivery_sum')">
                                   <a-icon v-if="clickdeliverysum" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!clickdeliverysum" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="given_cash_back">
                    <div style="display: flex; width: 100%"><span>{{ $t('Отдано Кэшбек') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('given_cash_back')">
                                   <a-icon v-if="givencashback" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!givencashback" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
                  <span slot="sredniy">
                    <div style="display: flex; width: 100%"><span>{{ $t('average_sum') }}</span>
                      <span style="margin-left: 20px">
                        <a-button size="small" style="background-color: #FAFAFA" @click="button('average_sum')">
                                   <a-icon v-if="averagesum" :component="$myIcon.bxicons1"></a-icon>
                                   <a-icon v-if="!averagesum" :component="$myIcon.bxicons2"></a-icon>
                        </a-button>
                  </span>
                  </div>
                  </span>
    <template slot="name" slot-scope="text">
      <span>
<!--          <span slot="title">{{ $t('name') }} {{ ' ' }} {{ text.name }}</span>-->
          <a style="color: black">{{ text.name }}</a>
          <span v-if="!text.name">Итого</span>
      </span>
    </template>
    <template slot="admin" slot-scope="text">
      <span>
        <a-tooltip placement="topLeft">
          <span slot="title">{{ $t('admin') }} {{ ' ' }} {{ text.admin_panel_orders_count }}</span>
          <a style="color: blue" @click.stop="NameClick('admin_panel', text)">{{ text.admin_panel_orders_count }}</a>

        </a-tooltip>
      </span>
    </template>
    <template slot="bot_orders_count" slot-scope="text">
      <span>
        <a-tooltip placement="topLeft">
          <span slot="title">{{ $t('bot') }} {{ ' ' }} {{ text.bot_orders_count }}</span>
          <a style="color: blue" @click.stop="NameClick('bot', text)">{{ text.bot_orders_count }}</a>
        </a-tooltip>
      </span>
    </template>
    <template slot="app_orders_count" slot-scope="text">
      <span>
        <a-tooltip placement="topLeft">
          <span slot="title">{{ $t('app') }} {{ ' ' }} {{ text.app_orders_count }}</span>
          <a style="color: blue" @click.stop="NameClick('app', text)">{{ text.app_orders_count }}</a>
        </a-tooltip>
      </span>
    </template>
    <template slot="website_orders_count" slot-scope="text">
      <span>
        <a-tooltip placement="topLeft">
          <span slot="title">{{ $t('Заказы на сайте') }} {{ ' ' }} {{ text.website_orders_count }}</span>
          <a style="color: blue" @click.stop="NameClick('website', text)">{{ text.website_orders_count }}</a>
        </a-tooltip>
      </span>
    </template>
<!--    <template slot="aggregators" slot-scope="text">-->
<!--      <span>-->
<!--        <a-tooltip placement="topLeft">-->
<!--          <span slot="title">{{ $t('Агрегаторы') }} {{ ' ' }} {{ text.aggregator }}</span>-->
<!--          <a style="color: blue" @click.stop="NameClick('aggergattor', text)">{{ text.aggregator }}</a>-->
<!--        </a-tooltip>-->
<!--      </span>-->
<!--    </template>-->
  </a-table>
    </a-card>
</template>

<script>
import moment from 'moment'
// import { jsontoexcel } from 'vue-table-to-excel'
import { mapGetters, mapActions } from 'vuex'
import { notification } from 'ant-design-vue'
export default {
 data () {
   return {
     buttonLoading: false,
     params: {
       // page: { page: 1, pageSiz: 10, totle: null },
       to_date: moment().format('YYYY-MM-DD'),
       from_date: this.format(),
       branch_id: '',
       to_time: '',
       from_time: '',
       sort_by: '',
       sort_type: ''
     },
     rules: {
       to_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
       from_time: [{ required: true, message: 'Пожалуйста, заполните это поле', trigger: 'change' }],
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
   }
},
  computed: {
    ...mapGetters(['branchReportsList', 'paginationBranchReports', 'FilyalBranchlist']),
    filteredBranches () {
      return this.branchReportsList && this.branchReportsList.length && this.branchReportsList.map(e => {
        return {
          admin_panel_orders_count: e.admin_panel_orders_count,
          admin_average_sum: new Intl.NumberFormat().format(Math.round(e.admin_average_sum)),
          app_orders_count: e.app_orders_count,
          app_average_sum: new Intl.NumberFormat().format(Math.round(e.app_average_sum)),
          bot_orders_count: e.bot_orders_count,
          bot_average_sum: new Intl.NumberFormat().format(Math.round(e.bot_average_sum)),
          name: e.branch_name,
          aggregator: e.aggregator,
          given_cash_back: e.given_cash_back,
          total_delivery_sum: new Intl.NumberFormat().format(e.total_delivery_sum),
          total_orders_count: e.total_orders_count,
          total_self_pick_up_sum: new Intl.NumberFormat().format(e.total_self_pick_up_sum),
          total_sum: new Intl.NumberFormat().format(e.total_sum),
          total_sum_cash: new Intl.NumberFormat().format(e.cash_sum),
          total_cash_delivery_sum: new Intl.NumberFormat().format(e.total_delivery_sum),
          total_sum_click: new Intl.NumberFormat().format(e.click_sum),
          total_click_delivery_sum: new Intl.NumberFormat().format(e.click_delivery_sum),
          total_sum_transfer: new Intl.NumberFormat().format(e.transfer_sum),
          total_transfer_delivery_sum: new Intl.NumberFormat().format(e.transfer_delivery_sum),
          // total_sum_click_paid: new Intl.NumberFormat().format(e.total_sum_click_paid),
          free_delivery: e.free_delivery,
          total_sum_payme: new Intl.NumberFormat().format(e.payme_sum),
          total_payme_delivery_sum: new Intl.NumberFormat().format(e.payme_delivery_sum),
          sredniy: new Intl.NumberFormat().format(Math.round(e.average_sum)),
          // payme_invoices: new Intl.NumberFormat().format(e.total_sum_payme_invoices),
          // payme_paid: new Intl.NumberFormat().format(e.total_sum_payme_paid),
          website_orders_count: e.website_orders_count,
          branch_id: e.branch_id
        }
      }) || []
    },
    column () {
      return [
        {
          slots: { title: 'name' },
          scopedSlots: { customRender: 'name' },
          // dataIndex: 'name',
          width: 150,
          fixed: 'left',
          name: 'Название'
        },
        {
          // title: this.$t('admin'),
          slots: { title: 'admin' },
          scopedSlots: { customRender: 'admin' },
          width: 130,
          // dataIndex: 'admin_panel_orders_count',
          align: 'center',
          name: 'Админ'
        },
        {
          // title: this.$t('admin'),
          slots: { title: 'admin_avg' },
          // scopedSlots: { customRender: 'admin_avg' },
          width: 190,
          dataIndex: 'admin_average_sum',
          align: 'center',
          name: 'Админ'
        },
        {
          // title: this.$t('bot'),
          slots: { title: 'bot' },
          scopedSlots: { customRender: 'bot_orders_count' },
          // dataIndex: 'bot_orders_count',
          width: 110,
          align: 'center',
          name: 'Бот'
        },
        {
          // title: this.$t('bot'),
          slots: { title: 'bot_avg' },
          // scopedSlots: { customRender: 'bot_orders_count' },
          dataIndex: 'bot_average_sum',
          width: 190,
          align: 'center',
          name: 'Бот'
        },
        {
          // title: this.$t('app'),
          slots: { title: 'app' },
          scopedSlots: { customRender: 'app_orders_count' },
          // dataIndex: 'app_orders_count',
          align: 'center',
          width: 110,
          name: 'Апп'
        },
        {
          // title: this.$t('app'),
          slots: { title: 'app_avg' },
          // scopedSlots: { customRender: 'app_average_sum' },
          dataIndex: 'app_average_sum',
          align: 'center',
          width: 190,
          name: 'Апп'
        },
        {
          // title: 'Заказы на сайте',
          slots: { title: 'website_orders_count' },
          scopedSlots: { customRender: 'website_orders_count' },
          // dataIndex: 'website_orders_count',
          align: 'center',
          width: 190,
          name: 'Заказы на сайте'
        },
        // {
        //   // title: this.$t('aggregators'),
        //   slots: { title: 'aggregators' },
        //   scopedSlots: { customRender: 'aggregators' },
        //   width: 160,
        //   // dataIndex: 'aggregator',
        //   align: 'center',
        //   name: 'Агрегаторы'
        // },
        {
          // title: this.$t('all_orders'),
          slots: { title: 'all_orders' },
          dataIndex: 'total_orders_count',
          align: 'center',
          name: 'Общие заказы',
          width: 190
        },
        {
          // title: this.$t('totalSum'),
          slots: { title: 'totalSum' },
          dataIndex: 'total_sum',
          align: 'center',
          name: 'Общая сумма',
          width: 180
        },
        {
          // title: this.$t('delevery'),
          slots: { title: 'delevery' },
          dataIndex: 'total_delivery_sum',
          name: this.$t('delevery'),
          width: 190,
          align: 'center'
        },
          {
          // title: this.$t('Общая сумма самовывоза'),
          slots: { title: 'total_self_pick_up' },
          dataIndex: 'total_self_pick_up_sum',
          name: this.$t('total_self_pick_up_sum'),
          width: 220,
          align: 'center'
        },
        {
          // title: 'Бесплатная доставка',
          slots: { title: 'free_delivery' },
          dataIndex: 'free_delivery',
          align: 'center',
          name: 'Бесплатная доставка',
          width: 250
        },
        {
          // title: 'Общая сумма наличные',
          slots: { title: 'total_sum_cash' },
          dataIndex: 'total_sum_cash',
          align: 'center',
          name: 'Общая сумма наличные',
          width: 250
        },
        {
          // title: 'Общая сумма доставки(наличные)',
          slots: { title: 'total_cash_delivery_sum' },
          dataIndex: 'total_cash_delivery_sum',
          align: 'center',
          width: 320,
          name: 'Общая сумма доставки(наличные)'
        },
        {
          // title: 'Общая сумма Payme',
          slots: { title: 'total_sum_payme' },
          dataIndex: 'total_sum_payme',
          align: 'center',
          name: 'Общая сумма Payme',
          width: 220
        },
        {
          // title: 'Общая сумма доставки (Payme)',
          slots: { title: 'total_payme_delivery_sum' },
          dataIndex: 'total_payme_delivery_sum',
          align: 'center',
          name: 'Общая сумма доставки (Payme)',
          width: 300
        },

        {
          // title: 'Общая сумма по перечислению',
          slots: { title: 'total_sum_transfer' },
          dataIndex: 'total_sum_transfer',
          align: 'center',
          name: 'Общая сумма по перечислению',
          width: 300
        },
        {
          // title: 'Общая сумма доставки(перечисление)',
          slots: { title: 'total_transfer_delivery_sum' },
          dataIndex: 'total_transfer_delivery_sum',
          align: 'center',
          name: 'Общая сумма доставки(перечисление)',
          width: 350
        },
        {
          // title: 'Click',
          slots: { title: 'Click' },
          dataIndex: 'total_sum_click',
          align: 'center',
          width: 190
        },
        {
          // title: 'Общая сумма доставки (Click)',
          slots: { title: 'total_click_delivery_sum' },
          dataIndex: 'total_click_delivery_sum',
          align: 'center',
          name: 'Общая сумма доставки (Click)',
          width: 300
        },
        {
          // title: 'Отдано Кэшбек',
          slots: { title: 'given_cash_back' },
          dataIndex: 'given_cash_back',
          align: 'center',
          name: 'Отдано Кэшбек',
          width: 200
        },
        {
          // title: 'Средний чек',
          slots: { title: 'sredniy' },
          dataIndex: 'sredniy',
          align: 'center',
          name: 'Средний чек',
          fixed: 'right',
          width: 200
        }
      ]
    }
  },
  methods: {
    NameClick (type, value) {
      console.log(type, value)
      const formDatas = this.params.from_date
      const todata = this.params.to_date
      console.log(formDatas, todata)
      const data = {
        fromData: this.params.from_time ? formDatas + ' ' + this.params.from_time : `${formDatas} 05:00:00`,
        toDate: this.params.to_time ? `${todata}` + ' ' + this.params.to_time : moment(todata).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00'
      }
      this.$router.push({
        name: 'BranchReportNews',
        query: { branch_id: value.branch_id, from_date: data.fromData, to_date: data.toDate, columname: type }
      })
    },
    customRowClik (record) {
      const formDatas = this.params.from_date
      const todata = this.params.to_date
      const data = {
        fromData: this.params.from_time ? formDatas + ' ' + this.params.from_time : `${formDatas} 05:00:00`,
        toDate: this.params.to_time ? `${todata}` + this.params.to_time : moment(todata).add('days', 1).format('YYYY-MM-DD') + ' ' + '05:00:00'
      }
      return {
        on: {
          click: (event) => {
            this.$router.push({
              name: 'BranchReportNews',
              query: { branch_id: record.branch_id, from_date: data.fromData, to_date: data.toDate }
            })
          }
        }
      }
    },
    BranchListGetReport () {
      this.loading = true
      this.$store.dispatch('BranchListGetALLReport', this.params)
      .finally(() => {
        this.loading = false
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
    downloadExcel () {
      this.buttonLoading = true
      this.$store.dispatch('ExcelBranchReports', this.params)
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
        var now = moment(date).subtract({ hours: this.$diffDayHour }).format(this.dateFormat)
        var nextDay = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) })
        var tomorrow = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format(this.dateFormat) + ' ' + '05:00:00'
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
        this.infoDate = moment(date).format(this.monthFormat) + ' ' + '--' + ' ' + moment(nMonth).format(this.monthFormat)
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
          this.$store.dispatch('BranchListGetALLReport', this.params)
            .finally(() => {
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
      const dateFrom = moment().subtract(5, 'd').format('YYYY-MM-DD')
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
    button (value) {
      console.log(value)
      switch (value) {
        case 'branch_name': this.names = !this.names
          this.params.sort_type = this.names ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'admin_panel_orders_count': this.admin = !this.admin
          this.params.sort_type = this.admin ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'bot_orders_count': this.bot = !this.bot
          this.params.sort_type = this.bot ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'app_orders_count': this.app = !this.app
          this.params.sort_type = this.app ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'website_orders_count': this.websiteorderscount = !this.websiteorderscount
          this.params.sort_type = this.websiteorderscount ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'aggregator': this.aggregator = !this.aggregator
          this.params.sort_type = this.aggregator ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'total_orders_count': this.allorders = !this.allorders
          this.params.sort_type = this.allorders ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'total_sum': this.totalSum = !this.totalSum
          this.params.sort_type = this.totalSum ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'total_delivery_sum': this.totaldeliverysum = !this.totaldeliverysum
          this.params.sort_type = this.totaldeliverysum ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'total_self_pick_up_sum': this.totalselfpickupsum = !this.totalselfpickupsum
          this.params.sort_type = this.totalselfpickupsum ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'free_delivery': this.freedelivery = !this.freedelivery
          this.params.sort_type = this.freedelivery ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'cash_sum': this.totalsumcash = !this.totalsumcash
          this.params.sort_type = this.totalsumcash ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'cash_delivery_sum': this.totalcashdeliverysum = !this.totalcashdeliverysum
          this.params.sort_type = this.totalcashdeliverysum ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'total_payme_delivery_sum': this.totalpaymedeliverysum = !this.totalpaymedeliverysum
          this.params.sort_type = this.totalpaymedeliverysum ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'transfer_sum': this.totalsumtransfer = !this.totalsumtransfer
          this.params.sort_type = this.totalsumtransfer ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'transfer_delivery_sum': this.transferdeliverysum = !this.transferdeliverysum
          this.params.sort_type = this.transferdeliverysum ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'click_sum': this.clicksum = !this.clicksum
          this.params.sort_type = this.clicksum ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'click_delivery_sum': this.clickdeliverysum = !this.clickdeliverysum
          this.params.sort_type = this.clickdeliverysum ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'given_cash_back': this.givencashback = !this.givencashback
          this.params.sort_type = this.givencashback ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
        case 'average_sum': this.averagesum = !this.averagesum
          this.params.sort_type = this.averagesum ? 'desc' : 'asc'
          this.params.sort_by = value
          this.loading = true
          this.$store.dispatch('BranchListGetALLReport', this.params)
          .finally(() => {
            this.loading = !this.loading
          })
          break
      }
    }
 },
  mounted () {
    this.BranchList()
    this.loadTable = true
    this.BranchListGetReport()
    // this.loading = true
    // this.$store.dispatch('BranchListGetALLReport', this.params)
    //   .finally(() => {
    //     this.loading = false
    //   })
    // this.getBranchReports(
    //   this.nowReport('day')
    // ).then(res => {
    //   this.loadTable = false
    // })
  }
}
</script>

<style scoped>
</style>
