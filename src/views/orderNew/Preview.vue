<template>
  <a-modal width="70vw" centered v-model="previewModal" @ok="handleOk" :title="$t('info')">
    <template slot="footer">
      <a-button key="back" @click="handleOk">
        {{ $t('ok') }}
      </a-button>
    </template>
    <!--    MAXWAYYYYYYYYY-->
    <div v-if="is_Maxway">
      <a-steps v-if="order" progress-dot :current="status">
        <a-step :title="$t('operatorAccepted')" :description="getStatusCreatedTime(getStatusId('operatorAccepted'))" />
        <a-step :title="$t('courierAccepted')" :description="getStatusCreatedTime(getStatusId('courierAccepted'))"/>
        <a-step :title="$t('branchesAccepted')" :description="getStatusCreatedTime(getStatusId('branchAccepted'))" />
        <a-step :title="$t('branchesReady')" :description="getStatusCreatedTime(getStatusId('branchReady'))" />
        <a-step :title="$t('courierPickedUp')" :description="getStatusCreatedTime(getStatusId('courierPickedUp'))" />
        <a-step :title="$t('finished')" :description="getStatusCreatedTime(getStatusId('finished'))" />
      </a-steps>
    </div>
    <!--    MAXWAYYYYYYYYY-->

    <div v-else>
      <a-steps v-if="order" progress-dot :current="status">
        <a-step :title="$t('operatorAccepted')" :description="getStatusCreatedTime(getStatusId('operatorAccepted'))" />
        <a-step :title="$t('branchesAccepted')" :description="getStatusCreatedTime(getStatusId('branchAccepted'))" />
        <a-step :title="$t('branchesReady')" :description="getStatusCreatedTime(getStatusId('branchReady'))" />
        <a-step :title="$t('courierAccepted')" :description="getStatusCreatedTime(getStatusId('courierAccepted'))"/>
        <a-step :title="$t('courierPickedUp')" :description="getStatusCreatedTime(getStatusId('courierPickedUp'))" />
        <a-step :title="$t('finished')" :description="getStatusCreatedTime(getStatusId('finished'))" />
      </a-steps>
    </div>
<!--    <span style="position: relative;bottom: -43px;left: 155px"></span>-->
    <h3 style="margin: 20px 0"><strong>{{ $t('alldiffStatus') }}</strong> {{ formatime ? (':' + formatime) : '' }}</h3>

    <a-table v-if="is_Maxway" :columns="columnStatusMaxway" :rowKey="() => Math.random()" :data-source="statusDifferentMaxway" bordered :pagination="false"></a-table>

        <a-table v-else :columns="columnStatusOqtepa" :data-source="statusDifferent" bordered :pagination="false"></a-table>

    <a-divider />
    <h3 style="margin: 20px 0" >{{ $t('previewClient') }}</h3>
    <a-descriptions bordered>
      <a-descriptions-item :span="2" style="font-size:16px" :label="$t('customerName')">
        {{ order ? order.client_name : '' }}
      </a-descriptions-item>
      <a-descriptions-item :span="2" :label="$t('customerPhone')">
        {{ order ? order.client_phone_number : '' }}
      </a-descriptions-item>
    </a-descriptions>

    <h3 style="margin: 20px 0">{{ $t('address') }}</h3>
    <a-descriptions bordered>
      <a-descriptions-item :span="2" :label="$t('address')">
        {{ order ? order.to_address : '' }}
      </a-descriptions-item>
      <a-descriptions-item :span="2" :label="$t('home')">
        {{ order ? order.apartment : ' - ' }}
      </a-descriptions-item>
      <a-descriptions-item :span="2" :label="$t('level')">
        {{ order ? order.floor : ' - ' }}
      </a-descriptions-item>
      <a-descriptions-item :span="2" :label="$t('entry')">
        {{ order ? order.building : ' - ' }}
      </a-descriptions-item>
      <a-descriptions-item :span="3" :label="$t('distance')" >
                {{ order ? order.distance /1000 +' '+ 'km': '' }}
      </a-descriptions-item>
    </a-descriptions>
    <h3 style="margin: 20px 0">{{ $t('preview_order') }}</h3>
    <a-descriptions bordered>
      <a-descriptions-item :span="2" :label="$t('operator')">
        {{ order && order.shipper_user ? order.shipper_user.name : ' - ' }}
      </a-descriptions-item>
      <a-descriptions-item :span="2" :label="$t('operatorPhone')">
        {{ order && order.shipper_user ? order.shipper_user.phone : ' - ' }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order && order.courier" :span="2" :label="$t('courier')">
        {{ order && order.courier ? order.courier.first_name : '' }} {{ order && order.courier ? order.courier.last_name : '' }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order && order.courier" :span="2" :label="$t('courierPhone')">
        {{ order && order.courier ? order.courier.phone : '' }}
      </a-descriptions-item>
      <a-descriptions-item :span="2" v-if="order && order.steps[0] ? order.steps[0].branch_name : ''" :label="$t('branchName')">
        {{ order ? order.steps[0] ? order.steps[0].branch_name : '' : '' }}
      </a-descriptions-item>
      <a-descriptions-item :span="2" :label="$t('status')" >
        <a-tag :color="order ? getStatusColor(order.status_id) : ''">
          {{ order ? getStatusName(order.status_id) : '' }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item :span="2" :label="$t('description')">
        {{ order ? order.description : '' }}
      </a-descriptions-item>
    </a-descriptions>
    <!-- <a-row align="middle" type="flex" justify="start" style="margin-top: 7px" :gutter="[8, 8]">
      <a-col span="auto">
        <h3>Статус платежа: </h3>
      </a-col>
      <a-col span="auto">
        <a-icon v-if="!loader" theme="filled" :style="{fontSize: '21px', color: order.paid ? '#87D068' : 'orange' }" :type="order.paid ? 'check-circle' : 'warning'" />
        <a-icon v-else :style="{fontSize: '21px'}" :type="'loading'" />
      </a-col>
      <a-col span="auto" v-if="order.jowi_id !== null && order !== null">
        <a-button v-if="!loader" @click="orderPayment(order.id)" type="link" size="small" icon="reload" shape="circle"></a-button>
      </a-col>
    </a-row> -->
    <h3 v-if="order && order.payment_type !== 'cash'" style="margin: 20px 0">{{ $t('payment_status') }} - <img width="32px" height="32px" :src="order && order.paid ? success : error" /></h3>
    <a-table v-if="order && order.transactions.length" :columns="columnPayment" :data-source="order.transactions" :rowKey="item => item.create_time + Math.random()" bordered :pagination="false">
      <template slot="time" slot-scope="time">
        {{ moment(parseInt(time)).format('HH:mm DD-MM-YYYY') }}
      </template>
      <template slot="state" slot-scope="state">
        {{ paymentStatus(parseInt(state), 'state') }}
      </template>
    </a-table>
    <!--    <a-descriptions v-if="order && order.transactions && order.transactions.length" bordered>-->
    <!--      <a-descriptions-item :span="2" :label="$t('status')" v-for="item in order.transactions" :key="item.create_time">-->
    <!--        {{ paymentStatus(parseInt(item.state), 'state') }}.-->
    <!--        {{ paymentStatus(parseInt(item.reason), 'reason') }}.-->
    <!--      </a-descriptions-item>-->
    <!--    </a-descriptions>-->
    <h3 style="margin: 20px 0">{{ $t('infoProduct') + ' ' + $t('and') + ' ' + $t('price') }}</h3>
    <a-descriptions bordered layout="vertical">
      <a-descriptions-item v-if="order && order.steps[0].products" :label="$t('products')" :span="3">
        <a-table :columns="columns" :data-source="order.steps[0].products" :rowKey="item => item.name + Math.random()" bordered :pagination="false">
        </a-table>
      </a-descriptions-item>
      <a-descriptions-item :span="2" :label="$t('deliveryPrice')">
        {{ order ? order.co_delivery_price : '' }} {{ $t('sum') }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order && order.steps[0].products" :label="$t('totalPrice')" :span="2">
        {{ getTotalPrice(order.steps[0].products, order.delivery_price) ? getTotalPrice(order.steps[0].products, order.delivery_price) : '' }} {{ $t('sum') }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order" :span="3" :label="$t('rating_order')">
        {{ order.rating ? order.rating : '' }}
      </a-descriptions-item>
    </a-descriptions>

    <h3 v-if="userLogs.length" style="margin: 20px 0">{{ $t('change.history') }}</h3>
    <a-table
      bordered
      v-if="userLogs.length"
      :columns="columnUserLogs"
      :data-source="userLogs"
      :rowKey="item => item.create_time + Math.random()"
      :pagination="false"
    >
      <template slot="editor" slot-scope="row">
        <div v-if="row.operator_name">
          <h3>{{ $t('operator.name') }}</h3>
          <p>{{ row.operator_name }}</p>
        </div>
        <div v-else-if="row.vendor_name">
          <h3>{{ $t('branchName') }}</h3>
          <p>{{ row.vendor_name }}</p>
        </div>
        <div v-else-if="row.courier_name">
          <h3>{{ $t('courier') }}</h3>
          <p>{{ row.courier_name }}</p>
        </div>
      </template>
      <template slot="description" slot-scope="val">
        <a-tooltip>
          <template slot="title">
            {{ val }}
          </template>
          <p>{{ $truncate(val ? val : '', 20) }}</p>
        </a-tooltip>
      </template>
      <template slot="time" slot-scope="time">
        {{ moment(time).subtract(5, 'h').format('DD-MM-YYYY HH:mm') }}
      </template>
    </a-table>
    <a-descriptions v-if="integReqRes" bordered layout="vertical" style="margin-top: 1rem">
      <a-descriptions-item :label="$t('integration.request')">
        <a-tooltip>
          <template slot="title">
            {{ integReqRes.integration_request }}
          </template>
          <p>{{ $truncate(integReqRes.integration_request, 30) }}</p>
        </a-tooltip>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('integration.response')">
        <a-tooltip>
          <template slot="title">
            {{ integReqRes.integration_response }}
          </template>
          <p>{{ $truncate(integReqRes.integration_response, 30) }}</p>
        </a-tooltip>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('time')">
        {{ moment(integReqRes.time).subtract(5, 'h').format('DD-MM-YYYY HH:mm') }}
      </a-descriptions-item>
    </a-descriptions>

    <yandex-map
      :coords="location"
      :zoom="15"
      :key="location.length"
      style="height:250px; padding-top: 24px"
      :controls="['zoomControl']"
      searchControlProvider="yandex#search"
    >
      <ymap-marker
        marker-type="placemark"
        :coords="location"
        marker-id="123"
        hint-content="some hint"
      />
      <ymap-marker
        marker-id="branch.id"
        :coords="branchLoaction.location"
        marker-type="placemark"
        :icon="{color: 'red', content: branchLoaction.name}"
      />
      <ymap-marker
        v-if="CourierLocationis"
        marker-id="124"
        marker-type="placemark"
        :coords="CourierLoaction.location"
        :icon="{color: 'yellow', content: CourierLoaction.name}"
      />

    </yandex-map>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
import error from '../../assets/error.png'
import success from '../../assets/success.png'
import request from '@/utils/request'
import moment from 'moment'

export default {
  data () {
    return {
      is_Maxway: JSON.parse(localStorage.getItem('shipper_id')) === 'd0d0c7c9-e047-4ad8-9674-a94a27e3da73',
      success: success,
      error: error,
      loader: true,
      loading: false,
      CourierLocationis: true,
      previewModal: false,
      order: null,
      vendor: null,
      courier: null,
      formatime: null,
      userLogs: [],
      integReqRes: null,
      statusDifferent: [],
      statusDifferentMaxway: [],
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('price'),
          dataIndex: 'price'
        },
        {
          title: this.$t('quantity'),
          dataIndex: 'quantity'
        },
        {
          title: this.$t('description'),
          dataIndex: 'description'
        },
        {
          title: this.$t('total'),
          dataIndex: 'total_amount'
        }
      ],
      columnsMaxway: [
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('price'),
          dataIndex: 'price'
        },
        {
          title: this.$t('quantity'),
          dataIndex: 'quantity'
        },
        {
          title: this.$t('description'),
          dataIndex: 'description'
        },
        {
          title: this.$t('total'),
          dataIndex: 'total_amount'
        }
      ],
      columnPayment: [
        {
          title: this.$t('time'),
          dataIndex: 'create_time',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: this.$t('status'),
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        },
        // {
        //   title: this.$t('reason'),
        //   dataIndex: 'reason',
        //   scopedSlots: { customRender: 'reason' }
        // },
      ],
      columnStatusOqtepa: [
        {
          title: this.$t('operatorAccepted') + '->' + this.$t('branchesAccepted'),
          dataIndex: 'status1',
          align: 'center'
        },
        {
          title: this.$t('branchesAccepted') + '->' + this.$t('branchesReady'),
          dataIndex: 'status2',
          align: 'center'
        },
        {
          title: this.$t('branchesReady') + '->' + this.$t('courierPickedUp'),
          dataIndex: 'status3',
          align: 'center'
        },
        {
          title: this.$t('courierPickedUp') + '->' + this.$t('finished'),
          dataIndex: 'status4',
          align: 'center'
        },
      ],
      columnStatusMaxway: [
        {
          title: this.$t('operatorAccepted') + '->' + this.$t('courierAccepted'),
          dataIndex: 'status1',
          align: 'center'
        },
        {
          title: this.$t('courierAccepted') + '->' + this.$t('branchesAccepted'),
          dataIndex: 'status2',
          align: 'center'
        },
        {
          title: this.$t('branchesAccepted') + '->' + this.$t('branchesReady'),
          dataIndex: 'status3',
          align: 'center'
        },
        {
          title: this.$t('branchesReady') + '->' + this.$t('courierPickedUp'),
          dataIndex: 'status4',
          align: 'center'
        },
        {
          title: this.$t('courierPickedUp') + '->' + this.$t('finished'),
          dataIndex: 'status5',
          align: 'center'
        },
      ],
      columnUserLogs: [
        {
          title: this.$t('action'),
          dataIndex: 'action',
          align: 'center'
        },
        {
          title: this.$t('editor'),
          align: 'center',
          scopedSlots: { customRender: 'editor' }
        },
        {
          title: this.$t('description'),
          align: 'center',
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: this.$t('time'),
          align: 'center',
          dataIndex: 'time',
          scopedSlots: { customRender: 'time' }
        },
      ]
    }
  },
  computed: {
    location () {
      if (this.order) {
        return [this.order.to_location.lat, this.order.to_location.long]
      } else return [41.309022097090235, 69.24136827883606]
    },
    // eslint-disable-next-line vue/return-in-computed-property
    branchLoaction () {
      if (this.order) {
        console.log('order =>>>', this.order)
        return {
          location: [this.order.steps[0].location.lat, this.order.steps[0].location.long],
          name: this.order.steps[0].branch_name
        }
      } else return []
    },
    CourierLoaction () {
      // console.log(this.order)
      if (this.order?.courier?.location?.lat) {
        return {
          location: [this.order.courier.location.lat, this.order.courier.location.long],
          name: `${this.order.courier.first_name}${this.order.courier.last_name}`
        }
      } else {
        return {
          location: {
            'long': null,
            'lat': null
          },
          name: ''
        }
      }
    },
    status () {
      // fsdfsdfsdfsfsdfsdfsdfs
      if (this.order) {
        switch (this.order.status_id) {
          case 'ccb62ffb-f0e1-472e-bf32-d130bea90617':
            return 0
          case '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3':
            return 1
          case 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd':
            return 2
          case '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0':
            return 3
          case '84be5a2f-3a92-4469-8283-220ca34a0de4':
            return 4
          case 'e665273d-5415-4243-a329-aee410e39465':
            return 5
          default:
            return 0
        }
      } else return 0
    }
  },
  methods: {
    ...mapActions(['getUserLogs']),
    fetchUserLogs () {
      this.getUserLogs({ order_id: this.order?.id })
        .then(res => {
          this.userLogs = res.user_logs.filter(elm => {
            if (elm.integration_request || elm.integration_response) {
              this.integReqRes = elm
              return false
            }
            return true
          })
        })
        .catch(err => console.log(err))
    },
    paymentStatus (val, type) {
      if (type === 'reason') {
        switch (val) {
          case 0: return ''
          case 1: return 'Один или несколько получателей не найдены или неактивны в Payme Business'
          case 2: return 'Ошибка при выполнении дебетовой операции в процессинговом центре'
          case 3: return 'Ошибка выполнения транзакции'
          case 4: return 'Транзакция отменена по таймауту'
          case 5: return 'Возврат денег'
          case 10: return 'Неизвестная ошибка'
          default: break
        }
      }
      if (type === 'state') {
        switch (val) {
          case 1: return 'Транзакция создана и ожидает подтверждения'
          case 2: return 'Транзакция успешно завершена'
          case -1: return 'Транзакция отменена'
          case -2: return 'Транзакция отменена после завершения'
          default: break
        }
      }
    },
    async openModal (order) {
       const created = order.created_at
       const finished = order.finished_at
     if (created && finished) {
       const diffTime = moment(finished).diff(moment(created))

        this.formatime = this.timeFormat(diffTime)
     } else {
        this.formatime = ''
     }
      this.loader = true
      await request({
        url: '/order/' + (order.id ? order.id : order)
      }).then(res => {
        console.log(res)
        // res.courier.location.lat ? this.CourierLoactionis = true : this.CourierLoactionis = false
        console.log('order courer =>>', res)
        this.order = res
        this.statusDifferent = [
          {
            status1: this.findTime(this.order.status_notes, '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3', 'ccb62ffb-f0e1-472e-bf32-d130bea90617'),
            status2: this.findTime(this.order.status_notes, this.branchReadytoCourierPickUp(this.order.status_notes, 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd'), '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3'),
            status3: this.findTime(this.order.status_notes, '84be5a2f-3a92-4469-8283-220ca34a0de4', this.branchReadytoCourierPickUp(this.order.status_notes, 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd')),
            status4: this.findTime(this.order.status_notes, 'e665273d-5415-4243-a329-aee410e39465', '84be5a2f-3a92-4469-8283-220ca34a0de4'),
            // status1: this.findTime(this.getStatusId('branchAccepted'), this.getStatusId('operatorAccepted')),
            // status2: this.findTime(this.getStatusId('branchReady'), this.getStatusId('branchAccepted')),
            // status3: this.findTime(this.getStatusId('courierAccepted'), this.getStatusId('branchReady')),
            // status4: this.findTime(this.getStatusId('courierPickedUp'), this.getStatusId('courierAccepted')),
            // status5: this.findTime(this.getStatusId('finished'), this.getStatusId('courierPickedUp'))
          }
        ]

        this.statusDifferentMaxway = [
            {
              status1: this.findTime(this.order.status_notes, 'ccb62ffb-f0e1-472e-bf32-d130bea90617', '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'),
              // status2: this.findTime(this.order.status_notes, this.branchReadytoCourierPickUp(this.order.status_notes, '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3'), '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3'),
              status2: this.findTime(this.order.status_notes, this.branchReadytoCourierPickUp(this.order.status_notes, '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'), '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3'),
              status3: this.findTime(this.order.status_notes, '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3', this.branchReadytoCourierPickUp(this.order.status_notes, '84be5a2f-3a92-4469-8283-220ca34a0de4')),
              status4: this.findTime(this.order.status_notes, '84be5a2f-3a92-4469-8283-220ca34a0de4', '84be5a2f-3a92-4469-8283-220ca34a0de4'),
              status5: this.findTime(this.order.status_notes, '84be5a2f-3a92-4469-8283-220ca34a0de4', 'e665273d-5415-4243-a329-aee410e39465'),
              // status1: this.findTime(this.getStatusId('branchAccepted'), this.getStatusId('operatorAccepted')),
              // status2: this.findTime(this.getStatusId('branchReady'), this.getStatusId('branchAccepted')),
              // status3: this.findTime(this.getStatusId('courierAccepted'), this.getStatusId('branchReady')),
              // status4: this.findTime(this.getStatusId('courierPickedUp'), this.getStatusId('courierAccepted')),
              // status5: this.findTime(this.getStatusId('finished'), this.getStatusId('courierPickedUp'))
            }
        ]
      }).finally(() => {
        this.loader = false
      })
      if (this.order.vendor_id) {
        await request('/vendors/' + this.order.vendor_id).then(res => {
          this.vendor = res
        })
      }

      this.fetchUserLogs()

      this.previewModal = true
    },
    handleOk (e) {
      this.order = null
      this.previewModal = false
    },
    getTotalPrice (products, deliveryPrice) {
      let totalPrice = 0
      products.forEach(p => {
        totalPrice += p.price * p.quantity
      })
      return totalPrice + parseInt(deliveryPrice)
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
        default:
          break
      }
    },
    getStatusId (statusName) {
      switch (statusName) {
        case 'operatorAccepted': return 'ccb62ffb-f0e1-472e-bf32-d130bea90617'
        case 'branchAccepted': return '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3'
        case 'branchReady': return 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd'
        case 'courierAccepted': return '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'
        case 'courierPickedUp': return '84be5a2f-3a92-4469-8283-220ca34a0de4'
        case 'finished': return 'e665273d-5415-4243-a329-aee410e39465'
        default: break
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
        default:
          break
      }
    },
    // =========================== edition ===================================== //
    // orderPayment (id) {
    //   this.loader = true
    //   this.$store.dispatch('getCrmOrderPayment', id).then(res => {
    //     console.log(res)
    //     this.order.paid = res.paid
    //   }).finally(() => {
    //     this.loader = false
    //   })
    // },
    // checkStatus (ord) {
    //   if (ord.jowi_id !== null) {
    //     this.orderPayment(ord.id)
    //   }
    // },
    timeFormat (value) {
      if (value !== 0) {
        var h, m, s
        if (value >= 1000) s = value / 1000
        else s = 0
        if (s > 0) {
          m = Math.floor(s / 60)
          s = s - m * 60
        } else m = 0
        if (m > 0) {
          h = Math.floor(m / 60)
          m = m - h * 60
        } else h = 0
        return (h !== 0 ? (h + ' ' + this.$t('hour')) : '') + ' ' + (m !== 0 ? (m + ' ' + this.$t('minut')) : '') + ' ' + (s + ' ' + this.$t('sec'))
      } else return '0' + ' ' + this.$t('sec')
    },
    findTime (array, id2, id1) {
      var time1 = null
      var time2 = null
      for (var i = 0; i < array.length; i++) {
        if (array[i].status_id === id1) {
          time1 = array[i].created_at
        }
        if (array[i].status_id === id2) {
          time2 = array[i].created_at
        }
      }
      if (time1 && time2) {
        return this.timeFormat(Math.abs(moment(time2).diff(moment(time1))))
      } else return '-'
    },
    branchReadytoCourierPickUp (array, id) {
      for (var i = 0; i < array.length; i++) {
        if (id === array[i].status_id) return id
      }
      return '84be5a2f-3a92-4469-8283-220ca34a0de4'
    },
    getStatusCreatedTime (id) {
      if (this.order) {
        const statuses = this.order.status_notes
        for (var i = 0; i < statuses.length; i++) {
          if (id === statuses[i].status_id) {
            return statuses[i].created_at.slice(0, -3)
          }
        }
        // return 'Not ID'
      }
    },
    moment
  },
  watch: {
    order (val) {
      console.log(val)
    }
  },
  mounted () {
    // console.log(typeof localStorage.getItem('shipper_id'))
  }
}
</script>
<style>
.ant-descriptions-bordered .ant-descriptions-item-label {
  background-color: #f1f1f19a;
  font-size: 16px;
  font-weight: 600;
}
.ant-descriptions-item-content {
  font-size: 16px;
}
</style>
