<template>
  <div>
    <a-row style="margin-bottom: 15px;">
      <a-col v-if="params.start_date && params.end_date" :span="6">{{ params.start_date.slice(0, 10) }} -
        {{ params.end_date.slice(0, 10) }}
      </a-col>
      <a-col v-if="!params.start_date && !params.end_date" :span="6">
        Все заказы. Нет фильтра по дате
      </a-col>
      <a-col :span="18">
        <div style="display: flex; float: right">
          <a-button @click="isShowFilter = !isShowFilter" style=" width: 100%" icon="filter">
            {{ !isShowFilter ? 'Oткрыть' : 'Закрыть' }} фильтры
          </a-button>
          <router-link v-action:get :to="{ name: 'OrderPayment' }">
            <a-button v-action:add style="float: right; margin-left:5px;" type="primary link" icon="plus">
              {{ $t('orderclentsearchbutton') }}
            </a-button>
          </router-link>
        </div>
      </a-col>
    </a-row>
    <transition name="slide">
      <filters v-if="isShowFilter"
               @customer="customerGet"
               @branches="onFilterChange"
               @courier="filterCourier"
               @status="filterStatus"
               @date="filterDate"
               @payment="onFilterChange"
               @extraOrder="onFilterChange"
               :params="params"
      />
    </transition>
    <a-table
      :columns="columns"
      :rowKey="record => record.id"
      :data-source="orders"
      :pagination="orderPagination"
      :loading="load_order"
      bordered
      :scroll="{ x:1600 }"
      @change="changeTablePagination"
      size="small"
      :rowClassName="(record) => record.is_preorder === true ? 'table-row-yellow' : record.isLate.length && `table-row-${record.isLate}`"
    >
      <div
        slot="filterDropdown"
        style="padding: 8px"
      >
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="external_order_id" slot-scope="text">
        <p class="clientView" @click="openPreviewModal(text)">{{ text.external_order_id }}</p>
        <a-tag style="margin: 3px" color="orange" v-if="beingEdited.includes(text.id)">
          {{ $t('being.edited') }}
        </a-tag>
      </template>
      <template slot="timer" slot-scope="item">
        <a-tag style="margin-bottom: 10px" :color="item.timer.color">
          {{ item.timer.time }}
        </a-tag>
        <a-tag v-if="item.status_id" :color="getStatusColor(item.status_id)">
          {{ getStatusName(item.status_id) }}
        </a-tag>
<!--        <template slot="timer" slot-scope="row">-->
<!--          <a-tag style="margin-bottom: 10px" :color="row.timer.color">-->
<!--            {{ row.timer.time }}-->
<!--          </a-tag>-->
<!--          <a-tag :color="getStatusColor(row.status_id)">-->
<!--            {{ getStatusName(row.status_id) }}-->
<!--          </a-tag>-->
<!--        </template>-->
      </template>
      <template slot="operator_accepted_at" slot-scope="item">
<!--          <a-tag :color="'#87d068'">-->
<!--                {{ acceptedTime(row.operator_accepted_at).time }}-->
<!--          </a-tag>-->
        <a-tag style="margin-bottom: 10px" :color="item.deadlineTimer === 0 ? item.courierTimer.color : item.deadlineTimer.color"> <!--"item.deadlineTimer === '0' ? item.timer.color : item.deadlineTimer.color"-->
          {{ item.courierTimer.time }}
        </a-tag>
      </template>
      <template slot="couier" slot-scope="text">
        <span class="clientView" @click="openPreviewClient(text)">{{ text.last_name }} {{ text.first_name }}</span>
        <p><a style="color: black" :href="'tel:' + text.phone">{{ text.phone }}</a></p>
      </template>
      <template slot="couier" slot-scope="text">
        <p><span class="clientView">{{ text.last_name }} {{ text.first_name }}</span> </p>
        <a style="color: black" :href="'tel:' + text.phone">{{ text.phone }}</a>
      </template>
      <template slot="couier" slot-scope="text">
        <p><span>{{ text.last_name }} {{ text.first_name }}</span></p>
        <span class="clientView" @click="openPreviewClient(text)">{{ text.phone }}</span>
      </template>
      <template slot="couier" slot-scope="text">
        <p class="clientView" @click="openPreviewClient(text)">
          <span>{{ text.last_name ? text.last_name : '' }} {{ text.first_name ? text.first_name : '' }}</span>
        </p>
        <a style="color: black" :href="'tel:' + text.phone">{{ text.phone }}</a>
        <!-- <span class="clientView" @click="openPreviewClient(text)">{{ text.phone }}</span> -->
<!--        <p><span style="color: blue">{{ text.courier_type ? text.courier_type.name : '' }}</span></p>-->
      </template>
      <template slot="client" slot-scope="item">
        <span class="clientView" @click="openPreviewClient(item)">{{ item.client_name }}</span><br>
        <p>        <a style="color: black" :href="'tel:' + item.client_phone_number">{{ item.client_phone_number }}</a>
        </p>
      </template>
      <template slot="id" slot-scope="row">
        <span>{{ updateIndex(row.id) }}</span>
      </template>
      <template slot="total" slot-scope="text, row">
        <div :style="row.paid ? 'background-color: #d0ffb8' : ''">
          <div :style="{textAlign: 'center'}">
            <img v-if="row.payment_type === 'cash'" src="./icons/money.svg" style="width: 70%; height: 35px" />
            <img v-if="row.payment_type === 'click'" src="./icons/click.svg" style="width: 70%; height: 35px" />
            <img v-if="row.payment_type === 'payme'" src="./icons/payme.svg" style="width: 70%; height: 35px" />
            <img v-if="row.payment_type === 'transfer'" src="./icons/bank.svg" style="width: 70%; height: 35px" />
          </div>
          <p>{{ row.totalPrice }}</p>
          <!--            <p>{{ row.paid }}</p>-->
        </div>
      </template>
      <template slot="source" slot-scope="text, row">
        <div :style="{textAlign: 'center'}">
          <img v-if="row.source === 'admin_panel'" src="./icons/consulting.svg" style="width: 70%; height: 35px" />
          <img v-if="row.source === 'bot'" src="./icons/telegram.svg" style="width: 70%; height: 35px" />
          <img v-if="row.source === 'android'" src="./icons/android.svg" style="width: 70%; height: 35px" />
          <img v-if="row.source === 'ios'" src="./icons/ios.svg" style="width: 70%; height: 35px" />
          <img v-if="row.source === 'website'" src="./icons/globe.svg" style="width: 70%; height: 35px" />
        </div>
      </template>
      <template slot="delivery_type" slot-scope="type">
        <div :style="{textAlign: 'center'}">
          <img v-if="type === 'delivery'" src="./icons/car.svg" style="width: 70%; height: 35px" />
          <img v-if="type === 'self-pickup'" src="./icons/running-man.svg" style="width: 70%; height: 35px" />
          <span v-if="type === 'delivery'">Доставка</span>
          <span v-if="type === 'self-pickup'">Самовывоз</span>
        </div>
      </template>
      <template slot="action" slot-scope="text, row">
<!--            <a-dropdown :trigger="['click']">-->
<!--      <a class="ant-dropdown-link" @click="e => e.preventDefault()">-->
<!--        <a-icon type="menu" />-->
<!--      </a>-->
<!--      <a-menu slot="overlay">-->
<!--        <a-menu-item key="0" style="width: 100%; display: flex">-->
          <a-tooltip>
            <template slot="title" style="background-color: #02f6dc">{{ $t('paymentType') }} {{ 'Click' }}</template>
                 <span v-if="row.payment_type === 'click'||row.payment_type === 'payme'"> <a-button style="margin:2px" @click="PaymeType(row, 'click')" size="small">
                    <a-icon :component="$myIcon.click"></a-icon>
                  </a-button> </span>
          </a-tooltip>
          <a-tooltip>
            <template slot="title" style="background-color: #02f6dc">{{ $t('paymentType') }} {{ 'Payme' }}</template>
            <span v-if="row.payment_type === 'payme'||row.payment_type === 'click'"> <a-button style="margin:2px" @click="PaymeType(row, 'payme')" size="small">
                    <a-icon :component="$myIcon.payme"></a-icon>
                  </a-button>
                   </span>
        </a-tooltip>
        <a-tooltip style="background-color: mediumvioletred; color: white">
          <template slot="title">{{ $t('ordernewadd') }}</template>
                  <a-button style="margin:2px" v-if="getNewOrderAddStautsId(row.status_id)" @click="newOrderCreateAdd(row)" size="small">
                   <a-icon type="retweet"></a-icon>
                  </a-button>
        </a-tooltip>
        <a-tooltip>
          <template slot="title">{{ $t('read') }}</template>
          <a-button size="small" style="margin: 2px"
                    v-if="row.status_id !== '986a0d09-7b4d-4ca9-8567-aa1c6d770505' && row.status_id !=='ccb62ffb-f0e1-472e-bf32-d130bea90617' && row.status_id !== 'bf9cc968-367d-4391-93fa-f77eda2a7a99'"
                    type="default" icon="eye" @click="openPreviewModal(row)"></a-button>
        </a-tooltip>
        <a-tooltip>
          <template slot="title">{{ $t('read') }}</template>
          <a-button v-if="isShipper" size="small" v-action:get style="margin: 0 2px" type="primary" icon="file-pdf"
                    @click="printAsPDF(row)"></a-button>
        </a-tooltip>
        <router-link :to="{ name: 'OrderEditNew', params: { id: row.id }, query: { status_id: row.status_id } }">
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button size="small" style="margin: 2px" v-action:update
                      v-if="row.status_id === '986a0d09-7b4d-4ca9-8567-aa1c6d770505' || row.status_id ==='ccb62ffb-f0e1-472e-bf32-d130bea90617' || row.status_id === 'bf9cc968-367d-4391-93fa-f77eda2a7a99'"
                      type="primary" icon="edit"></a-button>
          </a-tooltip>
        </router-link>
        <a-popconfirm
          placement="topRight"
          v-if="row.status_id === 'ccb62ffb-f0e1-472e-bf32-d130bea90617'"
          :title="$t('printCheck') + ' ?'"
          @confirm="crmSendHandler(row.id)"
          :okText="$t('yes')"
          :cancelText="$t('no')"
        >
          <a-tooltip>
              <template slot="title">{{ $t('printCheck') }}</template>
              <a-button size="small" style="margin: 2px"
                        type="primary" icon="printer"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip>
          <template slot="title">{{ $t('reason') }}</template>
          <a-button size="small" style="margin: 2px" v-action:delete
                    v-if="row.status_id === 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1' || row.status_id === 'd39cb255-6cf5-4602-896d-9c559d40cbbe'"
                    type="primary" icon="exclamation-circle" @click="$refs.reason.show(row)"></a-button>
        </a-tooltip>
        <a-tooltip>
          <template slot="title">{{ $t('finishReason') }}</template>
          <a-button size="small" style="background-color: #52c41a; margin: 2px" v-action:delete
                    v-if="row.status_id === 'e665273d-5415-4243-a329-aee410e39465'"
                    type="primary" icon="exclamation-circle" @click="$refs.reason.show(row, true)"></a-button>
        </a-tooltip>
        <a-tooltip>
          <template slot="title">{{ $t('leavingComment') }}</template>
          <a-button size="small" style="margin: 2px"
                    v-if="row.status_id === 'e665273d-5415-4243-a329-aee410e39465'"
                    type="primary" icon="message" @click="$refs.commentModal.showModal(row)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="topRight"
          v-if="row.courier_id !== '' && row.status_id !== 'e665273d-5415-4243-a329-aee410e39465' && row.status_id !== '84be5a2f-3a92-4469-8283-220ca34a0de4' && row.status_id !== 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1'"
          :title="$t('courierCancelledOrder')"
          @confirm="removeCourier(row.id)"
          :okText="$t('yes')"
          :cancelText="$t('no')"
        >
          <a-tooltip>
            <template slot="title">{{ $t('courierCancelled') }}</template>
            <a-button size="small" style="margin: 2px" v-action:delete type="danger" icon="car"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip>
          <template slot="title">{{ $t('cancelled') }}</template>
          <a-button size="small" style="margin:2px" v-action:delete
                    v-if="row.status_id !== 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1' && row.status_id !== 'c4227d1b-c317-46f8-b1e3-a48c2496206f' && row.status_id !== 'e665273d-5415-4243-a329-aee410e39465' && row.status_id !== 'd39cb255-6cf5-4602-896d-9c559d40cbbe'"
                    type="danger" icon="issues-close"
                    @click="$refs.changeStatusModal.show(row.id, row, 'cancel', 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1')"></a-button>
        </a-tooltip>
<!--        <a-tooltip>-->
<!--          <template slot="title">{{ $t('Курьер на карту') }}</template>-->
<!--          <a-button style="margin:2px" v-if="row.courier_id" size="small" @click="CourierPutMap(row.courier_id)">-->
<!--            <a-icon :component="$myIcon.mapIcon"></a-icon>-->
<!--          </a-button>-->
<!--        </a-tooltip>-->
        <a-tooltip>
          <template slot="title">{{ $t('finished') }}</template>
          <a-button size="small" v-action:delete
                    v-if="row.status_id !== 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1' && row.status_id !== 'c4227d1b-c317-46f8-b1e3-a48c2496206f' && row.status_id !== 'e665273d-5415-4243-a329-aee410e39465' && row.status_id !== 'd39cb255-6cf5-4602-896d-9c559d40cbbe'"
                    style="border-color: #52c41a; color: #52c41a; margin: 0 2px" type="primary" ghost
                    icon="issues-close"
                    @click="$refs.changeStatusModal.show(row.id, row, 'finish', 'e665273d-5415-4243-a329-aee410e39465')"></a-button>
        </a-tooltip>
<!--      </a-menu-item>-->
<!--      </a-menu>-->
<!--      </a-dropdown>-->
      </template>
    </a-table>
    <!--    MODALS-->
    <preview ref="previewModal" />
    <finish ref="changeStatusModal" />
    <reason ref="reason" />
    <pdfGenerator :order="selectedOrder" />
    <preview-client ref="PreviewClient" />
    <comment-modal ref="commentModal" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import timer from '@/utils/timer'
// import socket from '@/utils/socket'
import Preview from './Preview'
import FinishModal from './modal'
import Filters from '@/views/orderNew/Filters'
import ReasonModal from '@/views/orderNew/ReasonModal'
import pdfGenerator from '@/views/orderNew/template/pdfGenerator'
import CommentModal from '@/views/orderNew/commentModal.vue'
import PreviewClient from '@/views/customers/PreviewCustomer'
import moment from 'moment'
import i18n from '@/locales'
export default {
  components: {
    'finish': FinishModal,
    'preview': Preview,
    'filters': Filters,
    'reason': ReasonModal,
    'comment-modal': CommentModal,
    PreviewClient,
    pdfGenerator,
  },
  data () {
    return {
      // isShipper: localStorage.getItem('shipper_id') == '"19d96f2a-7808-4c69-b8ca-79310a29bfab"',
      shipperList: [
        {
          shipperName: 'regiosh',
          id: '19d96f2a-7808-4c69-b8ca-79310a29bfab'
        },
        {
          shipperName: 'delever',
          id: 'd4b1658f-3271-4973-8591-98a82939a664'
        },
        {
          shipperName: 'ploff_kebab',
          id: 'ac414d49-ff36-463e-b701-95fc09386e25'
        }
      ],
      selectedOrder: { visible: false, data: null },
      beingEdited: [],
      loading: false,
      isShowFilter: false,
      realTimeInterval: null,
      params: {
        pagination: {
          current: 1,
          pageSize: 50,
          total: null
        },
        sort_by: undefined,
        external_order_id: this.$route.query.external_order_id ?? '',
        payment_type: this.$route.query.payment_type,
        status_id: undefined,
        customer_id: undefined,
        courier_id: undefined,
        branch_ids: this.$route.query.branch_ids,
        status_ids: undefined,
        start_date: moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00',
        end_date: moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00',
      },
      free_delevery_time: '',
    }
  },
  methods: {
    CourierPutMap (e) {
      this.$router.push({ name: 'Tracking', query: { uicId: 33, couierId: e } })
    },
    ...mapActions(['getShipper']),
    newOrderCreateAdd (row) {
      this.$router.push({ name: 'OrderEditNew', params: { id: row.id }, query: { status_id: row.status_id, inputId: 25 } })
      this.$store.dispatch('setPraducktDisablet', false)
    },
    PaymeType (rowObject, type) {
      console.log(rowObject)
      const form = {
        order_id: rowObject.id,
        payment_type: rowObject.payment_type,
        phone: rowObject.client_phone_number
    }
      this.setSmsPamentSend(form)
      this.$store.dispatch('updateOrderPaymentType', {
        id: rowObject.id,
        payment_type: type
      }).then(res => {
        if (res) {
          this.getAllOrder(this.params)
        }
      })
    },
    updateIndex (id) {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < this.order.length; i++) {
        // eslint-disable-next-line no-undef
        if (this.order[i].id === id) return this.$route.query.page ? ((parseInt(this.$route.query.page) - 1) * 50 + (i + 1)) : (i + 1)
      }
    },
    formatTime (value) {
      if (value !== 0) {
        let h, m, s
        // const staticTime = 45 * 60 * 1000
        if (value >= 1000) s = Math.floor(Math.abs((value) / 1000))
        else s = 0
        if (s > 0) {
          m = Math.floor(s / 60)
          s = s - m * 60
        } else m = 0
        if (m > 0) {
          h = Math.floor(m / 60)
          m = m - h * 60
        } else h = 0
        return {
          time: (h !== 0 ? h : '0') + ' : ' + (m !== 0 ? ((m < 10) ? ('0' + m) : m) : '0') + ' : ' + ((s < 10) ? ('0' + s) : s),
          isLate: value,
          // color: this.colorTime(value)
        }
      } else return '0' + ' ' + i18n.t('sec')
    },
    acceptedTime (time) {
      const unixTime = Math.abs(Date.now() - Date.parse(time))
      return this.formatTime(unixTime)
    },
    ...mapActions(['getCustomerById', 'getAllOrder', 'getAllOrderNotLoader', 'removeCourierOrder', 'crmSend', 'getPhoneCustomers', 'getOrderByCountStatuses', 'setSmsPamentSend']),
    openPreviewModal (id) {
      console.log('roeeeee=>>', id)
      this.$refs.previewModal.openModal(id)
    },
    openPreviewClient (item) {
      // const _review = this.$refs.PreviewClient
      console.log(this.$refs.PreviewClient)
      this.getCustomerById(item.client_id).then(res => {
        this.$refs.PreviewClient.item.name = item.client_name
        this.$refs.PreviewClient.item.phone = item.client_phone_number
        this.$refs.PreviewClient.item.created_at = item.created_at
        this.$refs.PreviewClient.item.average_sum = res.average_sum
        this.$refs.PreviewClient.item.registration_source = item.registration_source
        this.$refs.PreviewClient.show()
      })
      console.log(item)
    },
    printAsPDF (data) {
      console.log(data)
      this.selectedOrder.visible = true
      this.$store.dispatch('getOrder', data.id).then(res => {
        console.log('resssss', res)
        this.selectedOrder.data = res
      })
    },
    getNewOrderAddStautsId (id) {
      switch (id) {
        case 'ccb62ffb-f0e1-472e-bf32-d130bea90617' : return true
        case '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3' : return true
        case 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd' : return true
        case '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0' : return true
      }
      return false
    },
    getCount () {
      this.getOrderByCountStatuses({
        ids: '986a0d09-7b4d-4ca9-8567-aa1c6d770505,' +
          'ccb62ffb-f0e1-472e-bf32-d130bea90617,' +
          '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3,' +
          'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd,' +
          '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0,' +
          '84be5a2f-3a92-4469-8283-220ca34a0de4,' +
          'e665273d-5415-4243-a329-aee410e39465,' +
          'bf9cc968-367d-4391-93fa-f77eda2a7a99',
        start: this.params.start_date ? this.params.start_date : moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00',
        end: this.params.end_date ? this.params.end_date : moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
      })
    },
    changeTablePagination (pagination, filter, sorter) {
      // console.log('filter', filter)
      // console.log('sorter', sorter)
      this.sorterColumn(sorter)
      this.params.pagination = pagination
      this.$router.push({
        name: 'MainNewOrders',
        query: {
          status_id: this.$route.query.status_id,
          page: pagination.current,
          limit: pagination.pageSize
        }
      })
      this.getAllOrder(this.params)
    },
    sorterColumn (sorter) {
      console.log(sorter)
      const _sorter = sorter.columnKey
      if (_sorter === 'order_amount') {
        const _type = sorter.order
        if (!_type) this.params.sort_by = undefined
        if (_type === 'ascend') this.params.sort_by = 'order_amount'
        if (_type === 'descend') this.params.sort_by = '-order_amount'
      }
      if (_sorter === 'timer') {
        const _type = sorter.order
        if (!_type) this.params.sort_by = undefined
        if (_type === 'ascend') this.params.sort_by = 'created_at'
        if (_type === 'descend') this.params.sort_by = '-created_at'
      }
    },
    getStatusName (statusId) {
      switch (statusId) {
        case '986a0d09-7b4d-4ca9-8567-aa1c6d770505':
          return this.$t('new')
        case '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3':
          return this.$t('branchesAccepted')
        case 'c4227d1b-c317-46f8-b1e3-a48c2496206f':
          return this.$t('branchesCancelled')
        case 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd':
          return this.$t('branchesReady')
        case '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0':
          return this.$t('courierAccepted')
        case '6ba783a3-1c2e-479c-9626-25526b3d9d36':
          return this.$t('courierCancelled')
        case '84be5a2f-3a92-4469-8283-220ca34a0de4':
          return this.$t('courierPickedUp')
        case '79413606-a56f-45ed-97c3-f3f18e645972':
          return this.$t('delivered')
        case 'ccb62ffb-f0e1-472e-bf32-d130bea90617':
          return this.$t('operatorAccepted')
        case 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1':
          return this.$t('operatorCancelled')
        case 'e665273d-5415-4243-a329-aee410e39465':
          return this.$t('finished')
        case 'd39cb255-6cf5-4602-896d-9c559d40cbbe':
          return this.$t('serverCancelled')
        case 'bf9cc968-367d-4391-93fa-f77eda2a7a99':
          return this.$t('future_order')
        default:
          break
      }
    },
    getStatusColor (status) {
      switch (status) {
        case '986a0d09-7b4d-4ca9-8567-aa1c6d770505':
          return '#2db7f5'
        case '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0':
          return '#108ee9'
        case '84be5a2f-3a92-4469-8283-220ca34a0de4':
          return '#13c2c2'
        case '79413606-a56f-45ed-97c3-f3f18e645972':
          return '#722ed1'
        case '6ba783a3-1c2e-479c-9626-25526b3d9d36':
          return '#bf3939'
        case 'e665273d-5415-4243-a329-aee410e39465':
          return '#87d068'
        case '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3':
          return '#001529'
        case 'c4227d1b-c317-46f8-b1e3-a48c2496206f':
          return '#ed2d2d'
        case 'd39cb255-6cf5-4602-896d-9c559d40cbbe':
          return '#ed2d2d'
        case 'ccb62ffb-f0e1-472e-bf32-d130bea90617':
          return '#42f5d7'
        case 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1':
          return '#e36464'
        case 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd':
          return '#51EC7C'
        case 'bf9cc968-367d-4391-93fa-f77eda2a7a99':
          return '#108ee9'
        default:
          break
      }
    },
    getStatusData (key) {
      this.params.status_id = key
      this.getAllOrder(this.params)
    },
    realTime () {
      this.realTimeInterval = setInterval(() => {
        this.getAllOrderNotLoader(this.params)
        this.getCount()
      }, 10000)
    },
    showReason (item) {
      console.log(item)
    },
    removeCourier (id) {
      this.removeCourierOrder(id)
    },
    crmSendHandler (id) {
      this.crmSend(id)
    },
    customerGet (e) {
      this.params.customer_id = e
    },
    onFilterChange ({ val, name }) {
      this.params[name] = val ? val.toString() : undefined
      if (val) {
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            [name]: this.params[name]
          }
        })
      } else {
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            [name]: this.params[name]
          }
        })
      }
    },
    // filterBranch (e) {
    //   this.params.branch_ids = e ? e.toString() : undefined
    // },
    filterCourier (e) {
      this.params.courier_id = e
    },
    filterStatus (e) {
      this.params.status_ids = e ? e.toString() : undefined
    },
    // filterOrder (e) {
    //   this.params.external_order_id = e
    //   console.log(this.params)
    // },
    // filterPayment (e) {
    //   this.params.payment_type = e
    //   this.getAllOrder(this.params)
    // },
    filterDate (e, key) {
      if (e) {
        console.log(e, key)
        // const _status = this.$route.query.status_id || key
        if (key && key === 'all') {
          this.params.start_date = undefined
          this.params.end_date = undefined
        } else {
          this.params.start_date = e[0]
          this.params.end_date = e[1]
        }
        this.$router.push({
          name: this.$route.name,
          query: {
            status_id: this.$route.query.status_id,
            start_date: this.params.start_date,
            end_date: this.params.end_date
          }
        })
        this.getAllOrder(this.params)
      }
    },
    computeIsLateValue (time) {
      if (!time) return false
      const timeConvert = time.split(' : ')
      const lastTime = (parseInt(timeConvert[0]) * 3600) + (parseInt(timeConvert[1]) * 60) + parseInt(timeConvert[2])
      return (this.lateInterval - lastTime) < 0 ? this.getColor : ''
    },
    moment
  },
  watch: {
      isShowFilter: function (value) {
        localStorage.setItem('isShowFilter', JSON.stringify(value))
      }
    },
  computed: {
    isShipper () {
      return this.shipperList.map(el => `"${el.id}"`).includes(localStorage.getItem('shipper_id'))
    },
    ...mapGetters(['order', 'load_order', 'orderPagination', 'orders_count']),
    lateInterval () {
      return Number(localStorage.getItem('time')) * 60
    },
    getColor () {
      return localStorage.getItem('color').replace('"', '').replace('"', '')
    },
    orders () {
      return (
        this.order && this.order.length ? this.order.map(order => {
          const computedTimer = timer.timer(order.created_at, order.status_notes)
          const courierTimer = timer.acceptedTimer(order.operator_accepted_at, order.status_notes, order.finished_at)
          const computedDeadlineTimer = order.free_delevery_time !== 0 ? timer.deadlineTimer(order.operator_accepted_at, order.status_notes, order.finished_at, order.free_delevery_time) : 0
          return {
            ...order,
            courierPhoneAndName: (order.courier ? order.courier.first_name : '') + '\n' + (order.courier ? order.courier.phone : ''),
            branch: order.steps ? order.steps[0].branch_name + '\n' + this.$phoneFormatter(order.steps[0].phone_number) : '',
            totalPrice: new Intl.NumberFormat().format(order.order_amount + order.co_delivery_price) + ' ' + this.$t('sum'),
            timer: computedTimer,
            deadlineTimer: computedDeadlineTimer,
            courierTimer,
            isLate: this.computeIsLateValue(computedTimer.time)
          }
        }) : []
      )
    },
    columns () {
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
          title: this.$t('orderId'),
          // dataIndex: 'external_order_id',
          scopedSlots: { customRender: 'external_order_id' },
          align: 'center',
          width: 150,
        },
        {
          title: this.$t('duration'),
          key: 'timer',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'timer' },
          sorter: (a, b) => {},
        },
        {
          title: this.$t('client'),
          width: 150,
          scopedSlots: { customRender: 'client' }
        },

        {
          title: this.$t('courier'),
          dataIndex: 'courier',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'couier' },
        },
        {
          title: this.$t('Оператор принял таймер'),
          key: 'operator_accepted_at',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'operator_accepted_at' },
        },
        {
          title: this.$t('branch'),
          dataIndex: 'branch',
          width: 150
        },
        {
          title: this.$t('delivery_type'),
          align: 'center',
          dataIndex: 'delivery_type',
          width: 100,
          scopedSlots: { customRender: 'delivery_type' }
        },
        {
          title: this.$t('price.order'),
          width: 100,
          align: 'center',
          key: 'order_amount',
          scopedSlots: { customRender: 'total' },
          sorter: (a, b) => {},
          // sortOrder: this.params.sort_by === 'order_amount' || this.params.sort_by === '-order_amount'
        },
        {
          title: this.$t('address.client'),
          dataIndex: 'to_address',
          ellipsis: true,
          width: 200
        },
        {
          title: this.$t('Source'),
          dataIndex: 'source',
          width: 90,
          scopedSlots: { customRender: 'source' }
        },
        {
          title: this.$t('createdAt'),
          dataIndex: 'created_at',
          key: 'created_at',
          // width: 200,
          // sorter: (a, b) => {},
          // sortOrder: this.params.sort_by === 'created_at' || this.params.sort_by === '-created_at'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: 120,
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        },
      ]
    }
  },
  beforeDestroy () {
    clearInterval(this.realTimeInterval)
  },
  created () {
    this.updateIndex()
    console.log(this.isSamosh, localStorage.getItem('shipper_id'), '19d96f2a-7808-4c69-b8ca-79310a29bfab')
  },
  destroyed () {
    console.log('component has died')
  },
  mounted () {
    this.$store.state.webSocket.socket.onmessage = (mes) => {
      try {
        // console.log('MESSAGE-ORDER: ', JSON.parse(mes.data))
        this.beingEdited = Object.keys(JSON.parse(mes.data))
      } catch (e) {}
    }
    if (localStorage.getItem('isShowFilter')) {
      this.isShowFilter = localStorage.getItem('isShowFilter') === 'true'
    }
    if (this.$route.query.status_id != 'all') {
      this.params.start_date = moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00'
      this.params.end_date = moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
    //   this.filterDate([
    //     moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00',
    //     moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
    //   ])
    } else {
      this.params.end_date = undefined
      this.params.start_date = undefined
    }
    if (this.$route.query.status_id) {
      if (this.$route.query.page && this.$route.query.limit) {
        this.params.pagination.current = parseInt(this.$route.query.page)
        this.params.pagination.pageSize = parseInt(this.$route.query.limit)
      }
      this.params.status_id = this.$route.query.status_id
    } else {
      this.params.status_id = '986a0d09-7b4d-4ca9-8567-aa1c6d770505'
      this.$router.push({
        name: 'MainNewOrders',
        query: {
          status_id: this.$route.query.status_id,
          start_date: moment(Date.now()).subtract({ hours: this.$diffDayHour }).format('YYYY-MM-DD') + ' ' + '05:00:00',
          end_date: moment(Date.now()).add({ hours: (24 - this.$diffDayHour) }).format('YYYY-MM-DD') + ' ' + '05:00:00'
        }
      })
    }
    console.log(this.params)
    this.getAllOrder(this.params)
    this.getCount()
    this.realTime()
    this.getShipper().then((res) => {
      this.free_delevery_time = res.free_delevery_time
      console.log('res', res)
    })
  }
}
</script>

<style lang="less" scoped>

.clientView {
  font-size: 16px;
  color: #0ea2e7;
}

.clientView:hover {
  cursor: pointer;
  text-decoration: underline;
}

.ant-table-row-cell-ellipsis {
  white-space: normal !important;
}

ul {
  cursor: pointer;
}

.slide-enter-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-in;
  -webkit-transition-timing-function: ease-in;
  -o-transition-timing-function: ease-in;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter, .slide-leave-to {
  overflow: hidden;
  max-height: 0;
}</style>
