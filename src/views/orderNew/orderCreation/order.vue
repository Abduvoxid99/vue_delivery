<template>
  <div>
    <a-card size="small">
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$route.params.id ? $t('order.edit.page') : $t('order.create.page')"
        @back="() => $router.go(-1)"
      />
    </a-card>
    <a-card style="width: 100%">
<!--      <a slot="extra" href="#">more</a>-->
      <a-row>
        <a-col :span="11">
          <a-row>
<!--            PHONE NUMBER AUTOCOMPLETE-->
            <a-col style="margin: 5px 0;" :span="24">
              <a-col style="margin-top: 5px" :span="6">Номер:</a-col>
              <a-col :span="6">
                <a-select
                  allowClear
                  :placeholder="$t('aggregator')"
                  style="width: 100%"
                  v-model="orderData.aggregator_id"
                  @change="selectAgr($event); logChanges('Агрегатор')"
                >
                  <a-select-option :key="item.id" v-for="item of aggregators" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="12">
                <phone-autocomplete
                  ref="customer"
                  v-model="orderData.customer"
                  :disabled="isDisabled"
                  @change="logChanges('Клиент')"
                />
              </a-col>
            </a-col>
<!--            CLIENT NAME INPUT-->
            <a-col style="margin: 5px 0;" :span="24">
              <a-col style="margin-top: 5px" :span="6">Kлиент:</a-col>
              <a-col :span="18"><client-name-input ref="client" /></a-col>
            </a-col>
            <!-- EXTRA PHONE NUMBER -->
            <a-col style="margin: 5px 0;" :span="24">
              <a-col style="margin-top: 5px" :span="6">Доп. номер:</a-col>
              <a-col :span="18"><a-input :style="extraPhoneNumberError && 'border-color: red'" type="tel" :placeholder="$t('phone')" v-model="orderData.extra_phone_number" /></a-col>
            </a-col>
<!--            ADDRESS MAP AUTOCOMPLETE-->
            <a-col style="margin: 5px 0;" :span="24">
              <a-col style="margin-top: 5px" :span="6">Адрес:</a-col>
              <a-col :span="18">
                <location-autocomplete ref="location" v-model="orderData.location" @change="logChanges('Адрес')" @addressChangeHandler="addressChangeHandler" />
              </a-col>
            </a-col>
<!--            DESCRIPTION-->
            <a-col style="margin: 5px 0;" :span="24">
              <a-col style="margin-top: 5px" :span="6">Описание:</a-col>
              <a-col :span="18">
                <a-input :placeholder="$t('descriptionOrder')" v-model="orderData.description" @blur="logChanges('Описание')" />
              </a-col>
            </a-col>

<!--            IS COURIER CALL-->
            <a-col v-if="orderData.delivery_type !== 'self-pickup'" :span="24">
              <a-col style="margin-top: 8px" :span="6">Может ли курьер позвонить?</a-col>
              <a-col :span="1"></a-col>
              <a-col :span="17" style="margin-top: 10px">
                <a-radio-group v-model="orderData.is_courier_call">
                  <a-radio :value="true">Да</a-radio>
                  <a-radio :value="false">Нет</a-radio>
                </a-radio-group>
              </a-col>
            </a-col>

<!--            ADDITIONAL ADDRESS-->
            <a-col style="margin: 5px 0;" :span="24">
              <a-col style="margin-top: 5px" :span="6">Утч. адрес:</a-col>
              <a-col :span="18">
                <a-row>
                  <a-col :span="8" style="padding-right: 10px">
                    <a-input :placeholder="$t('home')" v-model="orderData.apartment" @blur="logChanges('Квартира')" />
                  </a-col>
                  <a-col :span="8" style="padding-right: 10px">
                    <a-input :placeholder="$t('level')" v-model="orderData.floor" @blur="logChanges('Этаж')" />
                  </a-col>
                  <a-col :span="8">
                    <a-input :placeholder="$t('entry')" v-model="orderData.building" @blur="logChanges('Подъезд')" />
                  </a-col>
                </a-row>
              </a-col>
            </a-col>
<!--            PAYMENT TYPE RADIO-->
            <a-col style="margin: 5px 0;" :span="24">
              <a-col style="margin-top: 5px" :span="6">Виды оплаты:</a-col>
              <a-col :span="18">
                <a-row>
                  <a-radio-group
                    size="large"
                    button-style="solid"
                    v-model="orderData.payment_type"
                    @change="logChanges('Виды оплаты')"
                  >
                    <a-col :span="6" style="padding-right: 10px">
                      <a-radio-button value="cash">
                        <img src="../icons/cash.svg" style="height: 90%; width: 100%;">
                      </a-radio-button>
                    </a-col>

                    <a-col :span="6" style="padding-right: 10px">
                      <a-radio-button value="payme">
                        <img src="../icons/payme.svg" style="height: 80%; width: 100%">
                      </a-radio-button>
                    </a-col>
                    <a-col :span="6">
                      <a-radio-button value="click">
                        <img src="../icons/click.svg" style="height: 80%; width: 90%">
                      </a-radio-button>
                    </a-col>
                    <a-col :span="6" style="padding-right: 10px">
                      <a-radio-button value="transfer" style="text-align: center; margin-left: 8px" >
                        <img src="../icons/bank.svg" style="height: 90%; width: 70%;">
                      </a-radio-button>
                    </a-col>

                  </a-radio-group>
                </a-row>
              </a-col>
            </a-col>
<!--            TYPE DELIVERY-->
            <a-col style="margin: 5px 0;" :span="24">
              <a-col style="margin-top: 5px" :span="6">Тип доставки:</a-col>
              <a-col :span="18">
                <a-select style="width: 100%" @change="changeDeliverPrice" v-model="orderData.delivery_type" :disabled="isDisabled">
                  <a-select-option value="delivery">
                    Доставка
                  </a-select-option>
                  <a-select-option value="self-pickup">
                    Самовывоз
                  </a-select-option>
                </a-select>
              </a-col>
            </a-col>
<!--            CourierType-->
            <a-col style="margin: 5px 0;" :span="24">
              <a-col style="margin-top: 5px" :span="6">{{ $t('couriers_type') }}:</a-col>
              <a-col :span="18">
                <a-select style="width: 100%" v-model="orderData.courier_type_id" :disabled="isDisabledCourierType" @change="CourierTypeSelect" :placeholder="$t('couriers_type')">
                  <a-select-option v-for="coierselect in courierTypeLIst" :value="coierselect.id" :key="coierselect.id">
                   {{ coierselect.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-col>
<!--            Повторно оформленный-->
            <a-col :span="24">
              <a-col style="margin-top: 8px" :span="6">Повторно оформленный</a-col>
              <a-col :span="1"></a-col>
              <a-col :span="17" style="margin-top: 10px">
                <a-radio-group v-model="orderData.is_reissued" @change="onchangeRadio">
                  <a-radio :value="true">Да</a-radio>
                  <a-radio :value="false">Нет</a-radio>
                </a-radio-group>
              </a-col>
            </a-col>
            <a-col :span="24" v-if="orderData.delivery_type === 'delivery'">
              <a-col style="margin-top: 8px" :span="6">Временной диапазон: </a-col>
              <a-col :span="17" style="margin-top: 10px">
                  <!-- <a-time-picker
                    v-model="orderData.future_time"
                    :minuteStep="5"
                    format="YYYY-MM-DD HH:mm"
                    show-date
                    :disabledMinutes="getDisabledMinutes"
                    :disabledHours="getDisabledHours" @change="onChange" /> -->
                    <a-date-picker
                    v-model="orderData.future_time"
                    :minuteStep="5"
                    format="YYYY-MM-DD HH:mm"
                    valueFormat="YYYY-MM-DD HH:mm"
                    defaultPickerValue="YYYY-MM-DD"
                    :showTime="{ format: 'HH:mm' }"
                    :mode="mode1"
                    @openChange="handleOpenChange1"
                    @panelChange="handlePanelChange1"
                    :disabledHours="getDisabledHours" @change="onChange" />
              </a-col>
            </a-col>

            <div v-if="customerComments.length">
              <a-col :span="24">
                <p style="margin-bottom: 0; margin-top: 10px">Комментарий({{ customerComments[0].creator_name }}): {{ customerComments[0].comment }}</p>
              </a-col>
              <a-col :span="24" style="margin-top: 10px">
                <a-dropdown >
                  <span style="cursor: pointer">
                    Все комментарии <a-icon type="down" />
                  </span>
                  <a-menu style="max-height: 150px; overflow-y: auto" slot="overlay">
                    <a-menu-item v-for="(item, index) in customerComments" :key="item.comment_id + index">
                      <span>({{ item.creator_name }}): {{ item.comment }}</span>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </a-col>
            </div>
<!--            <a-col>-->
<!--              <a-select :default-value="provinceData[0]" style="width: 120px" @change="handleProvinceChange">-->
<!--                <a-select-option v-for="courierType in courierTypeLIst" :key="courierType>id" :value="courierType.id">-->
<!--                  {{ province }}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
<!--            </a-col>-->
          </a-row>
        </a-col>
        <a-col :span="1"></a-col>
        <!-- YANDEX MAP -->
        <a-col :span="12">
          <a-row>
            <a-col :span="24">
    <yandex-map style="height: 400px" :coords="orderData.coords" v-model="orderData.location" @clickMap="changeMapByClick"/>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 50px"><strong>Филиалы</strong></a-divider>
      <branch-row :distance="distance" :orderList="orderData" ref="branch" @update="updateBranch"/>
      <a-divider style="margin-top: 50px"><strong>Продукты</strong></a-divider>
      <product-row
        :distance="distance"
        v-model="orderData.products"
        :orderList="orderData"
        :sours="sorser"
        ref="product"
        @update="logChanges('Продукт')"
      />
      <a-divider/>
      <div>
        <a-button @click="() => { $router.push({ name: 'MainNewOrders', query: { status_id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617' } }) }" icon="close" style="margin: 0 5px" type="danger" ghost>
          {{ $t('cancel') }}
        </a-button>
        <a-button v-if="!$route.params.id" @click="clear" icon="undo" style="margin: 0 5px" type="primary" ghost>
          {{ $t('clear') }}
        </a-button>
        <a-button v-if="canEdit" icon="save" style="margin: 0 5px" :loading="loading" @click="showConfirm" type="primary">
          {{ $route.params.id ? $t('accept') : $t('save') }}
        </a-button>
        <a-button v-else icon="save" style="margin: 0 5px" :loading="loading" @click="save" type="primary">
          {{ $route.params.id ? $t('accept') : $t('Сохранить') }}
        </a-button>
        <!-- <a-button style="margin: 0 5px" @click="logHistory" type="primary" ghost>
          Log history
        </a-button> -->
      </div>
    </a-card>
    <a-modal v-model="visibleConfirm" title="Изменение заказа" on-ok="reCreateOrder">
      <template slot="footer">
        <a-button key="back" @click="save">
          Нет
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="reCreateOrder">
          Да
        </a-button>
      </template>
      <p>Хотите удалить старый заказ?</p>
    </a-modal>
    <pdfGenerator :order="selectedOrder" :routeTo="routeTo"/>
  </div>
</template>

<script>
import '../icons/cash.svg'
// import socket from '@/utils/socket'
import phoneAutoComplete from './PhoneAutoComplete'
import ClientNameInput from './ClientNameInput'
import LocationAutoComplete from './LocationAutoComplete'
import YandexMap from './YandexMap'
import BranchesRow from './BranchesRow'
import ProductsRow from './ProductsRow'
import { mapActions, mapGetters } from 'vuex'
import pdfGenerator from '../template/pdfGenerator.vue'
import moment from 'moment'
export default {
  components: {
    pdfGenerator,
    'phone-autocomplete': phoneAutoComplete,
    'client-name-input': ClientNameInput,
    'location-autocomplete': LocationAutoComplete,
    'yandex-map': YandexMap,
    'branch-row': BranchesRow,
    'product-row': ProductsRow,
  },
  data () {
    return {
      currentUser: {},
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
      mode1: 'time',
      value: [],
      start: null,
      end: null,
      sorser: '',
      params: {
        page: { page: 1, limit: 1000, totle: null },
        search: '',
      },
      extraPhoneNumberError: false,
      isDisabledCourierType: false,
      valueradio: 2,
      loading: false,
      client_phone_number: '',
      socketInterval: null,
      distance: { price: 0, range: null },
      aggregators: [],
      // aggregatorValue: null,
      client_name_item: {},
      userLogs: {
        action: 'Изменить заказ',
        courier_id: '',
        courier_name: '',
        description: '',
        operator_id: '',
        operator_name: '',
        order_id: '',
        vendor_id: '',
        vendor_name: '',
        integration_request: '',
        integration_response: '',
      },
      selectedOrder: { data: {}, visible: false },
      orderData: {
        aggregator_id: null,
        customer: {},
        extra_phone_number: null,
        is_reissued: this.$route.query.inputId === 25,
        is_courier_call: true,
        location: null,
        coords: [],
        co_delivery_price: 9000,
        branch: {},
        products: [],
        delivery_type: 'delivery',
        payment_type: 'cash',
        apartment: '',
        building: '',
        floor: '',
        description: '',
        courier_type_id: '',
        future_time: null,
        is_cancel_old_order: false,
        id: '',
      },
      expandedComments: false,
      canEdit: false,
      visibleConfirm: false
    }
  },
  watch: {
    'distance.price': function (val) {
      console.log('price =>> prop', val)
    },
    'orderData.aggregator_id': function (text) {
      console.log('aggregator =>>', text)
      if (text) {
        const aggregator = this.aggregators.filter(({ id }) => id === text)[0]
        // this.aggregatorValue = aggregator.phone_number.split('+998')[1]
        this.$refs.customer.searchCustomer(aggregator.phone_number.slice(4))
        this.orderData.delivery_type = 'self-pickup'
      } else {
        // this.aggregatorValue = ''
        this.client_phone_number ? this.$refs.customer.searchCustomer(this.client_phone_number) : this.$refs.customer.searchCustomer('')
        this.orderData.delivery_type = 'delivery'
      }
    },
    'orderData.customer': function (val) {
      console.log('customer changed =>>>', val)
      if (val.value && val.value.length === 9 && val.data) {
        // console.log('User Data:', val.data)
        // this.$refs.client.userData = this.client_name_item[0]
        this.$refs.client.userData = val.data
        this.$refs.client.newName = val.data.name
        // this.$refs.client.newName = this.client_name_item[0].name
        this.$refs.client.isHaveNumber = true
        this.$refs.location.getHistoryPhone('+998' + val.value)
      } else {
        this.$refs.client.userData = {}
        this.$refs.client.isHaveNumber = false
      }
      this.getCustomerComments(val?.data?.id)
    },
    'orderData.location': function (val) {
      console.log('LOCATIONNNN', val)
      this.$refs.location.location = val.value || null
      // if (val && val.buildingHistory) {
      //   this.orderData.building = val.buildingHistory.building !== 'null' ? val.buildingHistory.building : ''
      //   this.orderData.apartment = val.buildingHistory.apartment !== 'null' ? val.buildingHistory.apartment : ''
      //   this.orderData.floor = val.buildingHistory.floor !== 'null' ? val.buildingHistory.floor : ''
      // }
      if (val && val.value) {
        this.orderData.coords = val.coords
        this.orderData.branch = val.branch_info
        console.log('@@@@@@@@@@@@', val)
        this.$refs.branch.branch = val.branch_info
      } else this.orderData.location = null
    },
    'orderData.branch': function (val, old) {
      // console.log('Branchchchchchchchch', val, old)
    },
    'orderData.products': function (val) {
      // console.log(val)
    },
    'orderData.delivery_type': function (val) {
      if (val === 'self-pickup') this.orderData.is_courier_call = true
    },
    orderData (val) {
      // console.log('Order Data =====>>>>>>>>>>>>>', val)
    },
  },
  computed: {
    ...mapGetters(['courierTypeLIst', 'customerComments']),
    isShipper () {
      return this.shipperList.map(el => `"${el.id}"`).includes(localStorage.getItem('shipper_id'))
    },
    isDisabled () {
      return Boolean(this.orderData.aggregator_id)
    }
  },
  methods: {
    ...mapActions(['customerCreate', 'saveNewOrder', 'getOrderById', 'getBranchByLocation', 'updateNewOrder', 'getAggregators', 'getCourierTypesList', 'postUserLogs', 'getCustomerComments']),
    onchangeRadio (e) {
      this.logChanges('Повторно оформленный')
      this.orderData.is_reissued = e.target.value
    },
    moment,
    handleOpenChange1 (e) {
      if (open) {
        this.mode1 = 'time'
        console.log('sss', e)
      }
    },
    handleChange (val) {
      this.value = val
      console.log('val', val)
    },
    handlePanelChange1 (val, mode) {
      this.mode1 = mode
      console.log('mode', mode, val)
    },
    selectAgr (e) {
      // if (!e) return
      // const num = this.aggregators.filter(el => el.id == e)[0]
      // this.orderData.customer = { phone: num.phone_number }
      // console.log(this.orderData.customer)
    },
    addressChangeHandler ({ apartment, building, floor }) {
      // console.log('DATA22222 ======> ', apartment, building, floor)
      this.orderData.apartment = apartment
      this.orderData.building = building
      this.orderData.floor = floor
    },
    onChange (e) {
      // console.log('111', moment(e).format('YYYY-MM-DD HH:mm:ss'))
      this.orderData.future_time = moment(e).format('YYYY-MM-DD HH:mm:ss')
      if (e == null) {
        this.orderData.future_time = ''
      }
    },
//   onChange (value, dateString) {
//  console.log('Selected Time: ', value)
//  console.log('Formatted Selected Time: ', dateString)
//  },
    onOk (value) {
      console.log('onOk: ', value)
    },
      range (start, end) {
      const result = []
      for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
    },
      disabledDate (current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    disabledDateTime () {
    return {
    disabledHours: () => this.range(0, 24).splice(4, 20),
    disabledMinutes: () => this.range(30, 60),
    disabledSeconds: () => [55, 56]
    }
    },
    getDisabledHours () {
      var hours = []
      for (var i = 0; i < moment().hour(); i++) {
          hours.push(i)
      }
      return hours
    },
    getDisabledMinutes (selectedHour) {
      var minutes = []
      if (selectedHour === moment().hour()) {
          for (var i = 0; i < moment().minute(); i++) {
              minutes.push(i)
          }
      }
    return minutes
    },
    logChanges (elm) {
      // console.log(elm)
      this.userLogs.description = this.userLogs.description + elm + ' изменен, '
    },
    // logHistory () {
      //   console.log(this.orderData)
    //   console.log(this.userLogs.description)
    // },
    handlePostUserLogs () {
      // console.log('USER_LOGS====>', this.userLogs)
      this.postUserLogs({
        ...this.userLogs,
        courier_id: this.orderData.courier_id,
        courier_name: this.orderData.courier,
        operator_id: this.orderData.shipper_id,
        operator_name: this.orderData.shipper_name,
        order_id: this.$route.params.id,
        vendor_id: this.orderData.branch.value,
        vendor_name: this.orderData.branch.name,
      })
        .then(res => console.log('log-res====>', res))
        .catch(err => console.log('error-res====>', err))
        .finally(err => console.log('final-res====>', err))
    },
    changeMapByClick (e) {
      this.logChanges('Карта')
      console.log('yaxdex karta ==>>', e)
      this.orderData.location = e
      this.$refs.location.location = e.value
      this.$refs.location.coordinates = e.coords
    },
    CourierTypeSelect (e) {
      this.$refs.product.selectDelivery(e)
      // this.$refs.product.selectDelivery(e)
      this.logChanges('Тип курьера')
      console.log(e)
    },
    changeDeliverPrice (e) {
      console.log(e)
      this.logChanges('Тип доставки')
    if (e === 'self-pickup') {
      this.isDisabledCourierType = true
      this.isDisabled = true
      this.orderData.courier_type_id = null
    } else {
      this.isDisabledCourierType = false
    }
      this.$refs.product.send()
      if (e === 'self-pickup') {
        this.distance.price = 0
        this.distance.range = null
      } else {
        this.$store.dispatch('calcultePrice', {
          branch_id: this.orderData.branch.value,
          lat: this.orderData.coords[0],
          long: this.orderData.coords[1]
        }).then(res => {
          console.log('res', res)
        this.distance.price = res.price
        this.distance.range = res.hasOwnProperty('distance') ? res.distance : null
      })
      }
    },
    updateBranch (e) {
      console.log('UpdateBranch', e)
      this.logChanges('Филиал')
      this.orderData.branch = e
    },
    validCustomer () {
      console.log(this.orderData.customer.data)
      return new Promise((resolve, reject) => {
        if (!this.orderData.customer.data) {
          const phone = '+998' + this.orderData.customer.value
          const name = this.$refs.client.userData.name
          if (name) {
            this.customerCreate({
              name: name,
              phone: phone
            }).then(res => {
              this.orderData.customer.data = {}
              this.orderData.customer.data.id = res.id
              this.orderData.customer.data.phone = phone
              this.orderData.customer.data.name = name
              resolve(res)
            })
              .catch(error => {
                console.log(error)
                reject(error)
              })
          } else {
            this.$message.error('New Client name not entered')
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('error')
          }
        } else resolve('success')
      })
    },
    sender () {
      // eslint-disable-next-line
      let _data = {}
      const _order = this.orderData
      _data.aggregator_id = _order.aggregator_id
      _data.apartment = _order.apartment
      _data.building = _order.building
      _data.client_id = _order.customer.data.id
      _data.client_id = _order.customer.data.id
      _data.co_delivery_price = _order.co_delivery_price
      _data.delivery_type = _order.delivery_type
      _data.description = _order.description
      _data.courier_type_id = _order.courier_type_id
      _data.is_reissued = _order.is_reissued
      _data.is_courier_call = _order.is_courier_call
      _data.extra_phone_number = _order.extra_phone_number
      _data.future_time = _order.future_time
      _data.floor = _order.floor
      _data.payment_type = _order.payment_type
      _data.to_address = _order.location && _order.location.value ? _order.location.value : ''
      _data.to_location = {
        lat: _order.coords[0],
        long: _order.coords[1]
      }
      _data.source = 'admin_panel'
      _data.steps = [{
        branch_id: _order.branch.value,
        description: _order.description,
        products: _order.products.filter(e => (e.product_id !== null))
      }]
      _data.id = _order.id
      _data.is_cancel_old_order = _order.is_cancel_old_order
      return _data
    },
    validationData () {
      console.log('DATA ======> ', this.orderData)
      if (/^[+][9][9][8]\d{9}$/.test(this.orderData.extra_phone_number)) {
          console.log('Valid Number')
      } else if (!this.orderData.extra_phone_number) {
          console.log('Empty Number')
      } else {
        this.extraPhoneNumberError = true
        return this.$message.error('Enter valid phone number')
      }
      if (!this.orderData.is_courier_call) {
        if (!this.orderData.apartment) return this.$message.error('Вы должны указать номер квартиры, потому что курьер не может позвонить')
        if (!this.orderData.floor) return this.$message.error('Вы должны указать этаж, потому что курьер не может позвонить')
        if (!this.orderData.building) return this.$message.error('Вы должны указать подъезд, потому что курьер не может позвонить')
      }
      if (this.$refs.customer.validation()) {
        if (this.$refs.client.validation()) {
          if (this.orderData.delivery_type === 'self-pickup' || this.orderData.location) {
            if (this.orderData.delivery_type === 'self-pickup' || this.orderData.coords !== [41.309022097090235, 69.24136827883606]) {
              if (this.$refs.product.isValid()) {
                this.loading = true
                this.validCustomer().then(res => {
                  if (!this.$route.params.id) {
                    console.log('senderid', this.sender())
                    this.saveNewOrder(this.sender()).then(res => {
                      // console.log(res)
                      if (this.isShipper) {
                      this.selectedOrder = { data: { ...res.order }, visible: true }
                      } else this.$router.push({ name: 'MainNewOrders', query: { status_id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617' } })
                      this.$message.success(this.$t('orderSuccess'))
                    }).finally(() => {
                      this.loading = false
                    })
                  } else {
                    if (this.$route.query.inputId === 25) {
                      console.log('this new add order', this.sender())
                      this.$store.dispatch('NewOrderChangeAdd', this.sender())
                      .then(res => {
                        this.$router.go(-1)
                      })
                      return true
                    }
                    this.updateNewOrder({
                      id: this.$route.params.id,
                      data: this.sender()
                    }).then(res => {
                      console.log('ORDER UPDATED')
                      this.handlePostUserLogs()
                      this.$router.push({ name: 'MainNewOrders', query: { status_id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617' } })
                      this.$message.success(this.$t('orderSuccess'))
                    }).finally(() => {
                      this.loading = false
                    })
                  }
                }).catch(err => {
                  console.log(err)
                  this.loading = false
                })
              }
            } else this.$message.error('Location not Selected')
          } else this.$message.error('Not Location')
        } else this.$message.error('Client Name Empty')
      } else this.$message.error('Error phone number')
    },
    save () {
      this.validationData()
    },
    routeTo () {
        this.$router.push({ name: 'MainNewOrders', query: { status_id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617' } })
    },
    clear () {
      this.$refs.customer.clear()
      this.$refs.client.clear()
      this.$refs.location.clear()
      this.$refs.branch.clear()
      this.$refs.product.clear()
      this.orderData = {
        aggregator_id: '',
        customer: {},
        location: null,
        coords: [41.309022097090235, 69.24136827883606],
        branch: {},
        products: [],
        delivery_type: 'delivery',
        payment_type: 'cash',
        apartment: '',
        building: '',
        floor: '',
        description: ''
      }
      this.$message.success('All fields was cleared')
    },
    getOrder (id) {
      this.getOrderById(id).then(res => {
        // this.$router.push({
        //   name: 'OrderEditNew',
        //   params: {
        //     id: id
        //   },
        //   query: {
        //     status_id: res.status_id
        //   }
        // })
        this.orderData.aggregator_id = res.aggregator_id
        const _data = this.orderData
        _data.apartment = res.apartment
        _data.co_delivery_price = res.co_delivery_price
        _data.delivery_type = res.delivery_type
        _data.extra_phone_number = res.extra_phone_number
        _data.description = res.description
        _data.floor = res.floor
        _data.courier_type_id = res.courier_type_id
        _data.courier_id = res.courier_id
        _data.courier = res.courier
        _data.shipper_name = res.shipper_user?.name ?? null
        _data.shipper_id = res.shipper_user?.id ?? null
        _data.payment_type = res.payment_type
        _data.building = res.building
        _data.is_courier_call = res.is_courier_call
        _data.future_time = res.future_time ? moment(res.future_time).add(-5, 'hours').format('YYYY-MM-DD HH:mm:ss') : null
        _data.id = res.id
        this.sorser = res.source
        this.client_phone_number = res.client_phone_number.slice(4)
        this.$refs.customer.searchCustomer(res.client_phone_number.slice(4))
        const oldBranch = {
          value: res.steps[0].branch_id,
          phone: res.steps[0].phone_number,
          address: res.steps[0].address,
          name: res.steps[0].branch_name
        }
        console.log(oldBranch)
        if (_data.delivery_type === 'self-pickup') {
          this.orderData.branch = oldBranch
          this.$refs.branch.branch = oldBranch
        }
        this.$refs.location.location = res.to_address
        this.$refs.location.coordinates = [res.to_location.lat, res.to_location.long]
        this.$refs.location.send(oldBranch)
        this.$refs.product.source = res.source
        this.$refs.product.products = res.steps[0].products.map(e => {
          return {
            product_id: e.product_id,
            quantity: e.quantity,
            price: e.price,
            description: e.description
          }
        })
        this.$refs.product.send()
      })
    },
    showAllComments () {
      this.expandedComments = !this.expandedComments
    },
    showConfirm () {
      this.visibleConfirm = true
    },
    reCreateOrder () {
      this.orderData.is_cancel_old_order = true
      this.save()
    }
  },
  mounted () {
    console.log('<========= MOUNTED =========>')
    if (this.$route.params.id) {
      this.getOrder(this.$route.params.id)
    }
    if (this.$route.query.phone) {
      this.$refs.customer.number = this.$route.query.phone
      this.$refs.customer.searchCustomer(this.$route.query.phone)
    }
    this.socketInterval = setInterval(() => {
      this.$store.state.webSocket.socket.send(JSON.stringify({
        action: 'order-viewed',
        message: this.$route.params.id
      }))
    }, 2000)
    // this.$store.state.webSocket.socket.onopen = () => {
    // }
    if (this.$route.query.inputId) {
      this.canEdit = true
    }

    const userId = JSON.parse(localStorage.getItem('user_id'))
    if (userId) {
      this.currentUser = {
        name: localStorage.getItem('username'),
        shipperId: localStorage.getItem('shipper_id'),
        userId: localStorage.getItem('user_id')
      }
      if (JSON.parse(this.currentUser.shipperId) == '48dbaa52-cf12-4fad-b258-15f29392aabd') {
        this.orderData.coords = [41.50000000000006, 60.50000000000006]
      } else {
        this.orderData.coords = [41.309022097090235, 69.24136827883606]
      }
    } else {
      this.currentUser = {
        name: 'Admin'
      }
    }
  },
  created () {
    this.getCourierTypesList(this.params)
    this.getAggregators({ limit: 1000 })
      .then(res => {
        this.aggregators = res.aggregators
      }).catch(err => { console.log(err) })
  },
  destroyed () {
    this.$route.query.inputId === 25 ? this.orderData.is_reissued = true : this.orderData.is_reissued = false
    clearInterval(this.socketInterval)
    this.getCustomerComments()
  }
}
</script>

<style lang="less" scoped>
.hegihtYandexMap{
  height: 400px !important;
}
</style>
