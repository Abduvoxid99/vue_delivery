
<template>
  <a-page-header :title="$t('createOrder')" @back="() => { $router.push({ name: 'MainNewOrders', query: { status_id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617' } }) }">
    <a-form-model
      class="form-row"
      :gutter="16"
      ref="orderForm"
      layout="vertical"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-card class="card" :title="$t('client')" :bordered="false">
        <a-button v-if="bools.history" slot="extra" @click="clearHistory" icon="history">{{ $t('clearHistory') }}</a-button>
        <a-row>
          <a-col :span="10">
            <a-card class="card" :bordered="false" style="padding-top: 0">
              <a-row>
                <a-col :md="24" :sm="24" :lg="24">
                  <a-form-model-item labelAlign="left" :label="$t('phone')+':'" prop="phone">
                    <a-row>
                      <a-col v-if="bools.showCode" :md="4" :sm="4">
                        <p style="margin-top: 4px"><strong>+998</strong></p>
                      </a-col>
                      <a-col :md="bools.visibleAutoComplete ? 21 : 17" :sm="bools.visibleAutoComplete ? 21 : 17">
                        <a-row>
                          <a-col :md="24" :sm="24">
                            <a-auto-complete
                              v-model="orderData.phone"
                              :data-source="users"
                              style="width: 100%"
                              :placeholder="$t('phone')"
                              @select="selectUser"
                            />
                            <a-spin v-if="bools.fetchUserSpin" size="small" />
                          </a-col>
                        </a-row>
                      </a-col>
                      <a-col :md="3" :sm="3" :style="{padding: '0 0 0 10px'}">
                        <a-button
                          id="copyButton"
                          type="primary"
                          icon="copy"
                          v-clipboard:copy="(orderData.phone && orderData.phone.length > 13) ? orderData.phone.split(':')[2] : orderData.phone"
                          v-clipboard:success="copySuccess"
                        />
                      </a-col>
                      <a-col v-if="users.length == 0 && (orderData.phone.length === 13)" :md="24" :sm="24" style="padding: 10px 0 0 0">
                        <div>
                          <a-alert :message="$t('noEnteredClient')" type="warning" />
                        </div>
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </a-col>
                <a-col :md="24" :sm="24" :lg="24">
                  <a-form-model-item
                    labelAlign="left"
                    :label="$t('customerName')+':'"
                    prop="client_id"
                  >
                    <a-row>
                      <a-col :md="colName" :sm="colName" :lg="colName">
                        <a-input id="inputName" v-model=" orderData.name" :disabled="bools.disableClientName" />
                      </a-col>
                      <a-col
                        :md="colButton"
                        :sm="colButton"
                        :lg="colButton"
                        :style="{padding: '0 0 0 15px'}"
                      >
                        <a-button @click="openChangeName" type="primary" icon="edit" />
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </a-col>
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-model-item labelAlign="left" :label="$t('address')+':'">
                    <a-row>
                      <a-col :md="24" :sm="24">
                        <a-auto-complete
                          v-model="orderData.location"
                          style="width: 100%"
                          @search="searchMap"
                          option-label-prop="name"
                          :placeholder="$t('address')"
                          @select="selectMap"
                        >
                          <template slot="dataSource">
                            <a-select-opt-group v-if="mapHistory.length > 0">
                                <span slot="label" style="padding: 5px; border-bottom: 1px solid #c7c9ca; color: #87bce7; font-size:14px;">
                                  <strong>
                                    {{ $t('history_location') }}
                                  </strong>
                                </span>
                              <a-select-option v-for="map in mapHistory" :key="'history' + ':' + map.location.lat + ':' + map.location.long" :value="map.address" :name="map.address">
                                <a-row>
                                  <a-col :span="2">
                                    <a-icon style="font-size: 22px" type="environment" />
                                  </a-col>
                                  <a-col :span="19" :offset="2">
                                    <p style="font-size: 14px; margin: 0">{{ map.address }}</p>
                                    <!--                                    <p style="font-size: 12px; margin: 0"><strong>{{ map.address_name }}</strong></p>-->
                                  </a-col>
                                </a-row>
                              </a-select-option>
                            </a-select-opt-group>
                            <a-select-opt-group v-if="mapPoint.length > 0 || mapPlace.length > 0">
                              <span slot="label" style="padding: 5px; border-bottom: 1px solid #c7c9ca; color: #87bce7; font-size:14px;">
                                  <strong>
                                    {{ $t('new_location') }}
                                  </strong>
                                </span>
                              <a-select-option
                                v-for="map in mapPlace"
                                :key="'mapPlace' + ':' + map.name + ':' + map.latlong.lat + ':' + map.latlong.lon"
                                :value="map.name"
                                :name="map.name"
                              >
                                <a-row>
                                  <a-col :span="2">
                                    <a-icon style="font-size: 26px; margin-top: 8px" type="bank" />
                                  </a-col>
                                  <a-col :span="19" :offset="2">
                                    <p style="font-size: 14px; margin: 0">{{ map.name }}</p>
                                    <p style="font-size: 12px; margin: 0"><strong>{{ map.description }}</strong></p>
                                  </a-col>
                                </a-row>
                              </a-select-option>
                              <a-select-option
                                v-for="map in mapPoint"
                                :key="'mapPoint' + ':' + map.name + ':' + map.latlong.lat + ':' + map.latlong.lon"
                                :value="map.name"
                                :name="map.name"
                              >
                                <a-row>
                                  <a-col :span="2">
                                    <a-icon style="font-size: 26px; margin-top: 8px" type="environment" />
                                  </a-col>
                                  <a-col :span="19" :offset="2">
                                    <p style="font-size: 14px; margin: 0">{{ map.name }}</p>
                                    <p style="font-size: 12px; margin: 0"><strong>{{ map.description }}</strong></p>
                                  </a-col>
                                </a-row>
                              </a-select-option>
                            </a-select-opt-group>
                          </template>
                        </a-auto-complete>
                        <a-spin v-if="bools.locationSpin" size="small" />
                      </a-col>
                      <a-col v-if="orderData.location && bools.notfoundAddress.map1 && bools.notfoundAddress.map2" :md="24" :sm="24" style="padding: 10px 0 0 0">
                        <div>
                          <a-alert :message="$t('noValidAddress')" type="error" />
                        </div>
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </a-col>
                <a-col :md="24" :sm="24" :lg="24">
                  <a-form-model-item labelAlign="left" :label="$t('descriptionOrder')+':'">
                    <a-input id="orderDescription" v-model="orderData.description"/>
                  </a-form-model-item>
                </a-col>
                <a-col :md="6" :sm="6">
                  <label style="color: rgba(0, 0, 0, 0.85);">{{ $t('verifiedAddress') }}</label>
                </a-col>
                <a-col :md="18" :sm="18">
                  <a-row>
                    <a-col :md="8" :sm="8">
                      <a-form-model-item :wrapperCol="{ span: 22 }" prop="apartment">
                        <a-input :placeholder="$t('home')" id="inputApartment" v-model="orderData.apartment"/>
                      </a-form-model-item>
                    </a-col>

                    <a-col :md="8" :sm="8" :style="{paddingLeft: '15px'}">
                      <a-form-model-item :wrapperCol="{ span: 22 }" prop="floor">
                        <a-input :placeholder="$t('level')" id="inputFloor" v-model="orderData.floor"/>
                      </a-form-model-item>
                    </a-col>

                    <a-col :md="8" :sm="8" :style="{paddingLeft: '15px'}">
                      <a-form-model-item :wrapperCol="{ span: 22 }" prop="building">
                        <a-input :placeholder="$t('entry')" id="inputBuilding" v-model="orderData.building"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <!--                <a-col v-if="orderData.phone.length >= 9" :span="24">-->
                <!--                  <a-form-model-item labelAlign="left" :label="$t('clientAddress')+':'" >-->
                <!--                    <a-select-->
                <!--                      id="selectAddress"-->
                <!--                      label-in-value-->
                <!--                      :placeholder="$t('clientAddress')"-->
                <!--                      @select="historyMapSelect"-->
                <!--                    >-->
                <!--                      <a-select-option v-for="(map,i) in mapHistory" :key="map.address + i + i*i" :value="i + ',' + map.location.lat + ',' + map.location.long">-->
                <!--                        {{ map.address }}-->
                <!--                      </a-select-option>-->
                <!--                    </a-select>-->
                <!--                  </a-form-model-item>-->
                <!--                </a-col>-->
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-model-item labelAlign="left" :label="$t('paymentType')+':'" prop="payment_type">
                    <a-radio-group
                      name="radioGroup"
                      v-model="orderData.payment_type"
                      default-value="cash"
                      size="large"
                      button-style="solid">
                      <a-row>
                        <a-col :lg="8" :md="8" :sm="8" :style="{padding: '0 4px'}">
                          <a-radio-button id="buttonCash" value="cash">
                            <img src="./icons/cash.svg" style="height: 90%; width: 100%;">
                          </a-radio-button>
                        </a-col>
                        <a-col :lg="8" :md="8" :sm="8" :style="{padding: '0 4px'}">
                          <a-radio-button id="buttonPayme" value="payme">
                            <img src="./icons/payme.svg" style="height: 80%; width: 100%">
                          </a-radio-button>
                        </a-col>
                        <a-col :lg="8" :md="8" :sm="8" :style="{padding: '0 4px'}">
                          <a-radio-button id="buttonClick" value="click">
                            <img src="./icons/click.svg" style="height: 80%; width: 100%">
                          </a-radio-button>
                        </a-col>
                      </a-row>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
                <a-col :lg="24" :md="24" :sm="24">
                  <a-form-model-item labelAlign="left" :label="$t('delivery_type') + `:`">
                    <a-select v-model="delivery_type">
                      <a-select-option value="delivery">
                        Доставка
                      </a-select-option>
                      <a-select-option value="self-pickup">
                        Самовывоз
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-card>
          </a-col>
          <a-col :span="14">
            <a-card :bordered="false">
              <a-row>
                <a-col :lg="24" :md="24" :sm="24" :style="{padding: '0 10px', marginTop: '-30px'}">
                  <yandex-map
                    @click="onClickMap"
                    zoom="15"
                    ref="myRef"
                    :coords="coordinates"
                    :controls="['zoomControl']"
                    searchControlProvider="yandex#search"
                    style="height:406px; padding-top: 24px">
                    <ymap-marker
                      v-for="coords in newcoords"
                      :key="coords.id"
                      marker-id="123"
                      :coords="coords.coordinates"
                      :icon="{color: 'red',
                              content: coords.name}"
                    />
                    <ymap-marker
                      marker-id="124"
                      :coords="coordinates"
                    />
                  </yandex-map>
                </a-col>
              </a-row>
            </a-card>
          </a-col>
        </a-row>

        <a-card class="card" :title="$t('branches')" :bordered="false">
          <a-row>
            <a-col :md="8" :sm="12">
              <a-form-model-item labelAlign="left" prop="branch_id">
                <a-row>
                  <a-col :span="5">
                    <a-icon type="shop" :style="{ fontSize: '30px' }"/>
                  </a-col>
                  <a-col :span="19">
                    <a-auto-complete
                      v-model="orderData.branch_id"
                      :data-source="branches"
                      style="width: 100%"
                      :placeholder="$t('branchName')"
                      @select="selectBranch"
                    />
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="12" style="paddingLeft: 15px">
              <a-form-model-item>
                <a-row>
                  <a-col :span="5">
                    <a-icon type="environment" :style="{ fontSize: '30px' }"/>
                  </a-col>
                  <a-col :span="19">
                    <a-input type="input" readOnly id="addBranchAddress" v-model="orderData.branch_address"/>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="12" style="paddingLeft: 15px">
              <a-form-model-item>
                <a-row>
                  <a-col :span="5">
                    <a-icon type="phone" :style="{ fontSize: '30px' }"/>
                  </a-col>
                  <a-col :span="19">
                    <a-input type="input" readOnly id="brachPhone" v-model="orderData.branch_phone_number"/>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
      </a-card>
      <!-- <div v-for="(step, stepIndex) in order.steps" :key="stepIndex"></div> -->
      <div>
        <a-card
          class="card"
          :title="$t('products')"
          style="margin: 10px 0"
        >
          <p slot="extra"> {{ $t('totalPrice') }}: {{ totalPriceProduct }} </p>
          <a-row>
            <a-row v-for="(item,i) in products" :key="i*i*i">
              <a-col :md="5" :sm="12">
                <a-form-model-item :wrapperCol="{ xl: 24, xxl: 17 }" :labelCol="{ xl: 24, xxl: 7 }" labelAlign="left" :label="$t('name')+':'" prop="product_name">
                  <a-select
                    id="selectProduct"
                    show-search
                    :placeholder="$t('products')"
                    v-model="products[i].value"
                    :filter-option="filterOption"
                    @select="selectProduct(products[i].value, i)"
                  >
                    <a-select-option v-for="(p,index) in productsMenu" :key="p.id+index" :value="p.id">
                      {{ p.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :md="3" :sm="12" :style="{padding: '0 0 0 20px'}">
                <a-form-model-item labelAlign="left" :label="$t('price')+':'" :wrapperCol="{ xl: 24, xxl: 17 }" :labelCol="{ xl: 24, xxl: 7 }">
                  <a-input readOnly id="inputPrice" v-model="products[i].price"/>
                </a-form-model-item>
              </a-col>

              <a-col :md="3" :sm="12" :style="{padding: '0 0 0 20px'}">
                <a-form-model-item labelAlign="left" :label="$t('quantity')+':'" :wrapperCol="{ xl: 24, xxl: 9 }" :labelCol="{ xl: 24, xxl: 15 }">
                  <a-input readOnly id="productQuantity" :min="1" v-model="products[i].amount"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="6" :sm="12" :style="{padding: '0 0 0 20px'}">
                <a-form-model-item labelAlign="left" :label="$t('description')+':'" :wrapperCol="{ xl: 24, xxl: 9 }" :labelCol="{ xl: 24, xxl: 15 }">
                  <a-input v-model="products[i].description"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="2" :sm="12" :style="{padding: '0 0 0 20px'}">
                <a-button
                  id="addProduct"
                  type="primary"
                  shape="circle"
                  icon="plus"
                  @click="incrementAmount(i)"
                />
                <a-button
                  type="danger"
                  shape="circle"
                  icon="minus"
                  v-if="products[i].amount > 1"
                  @click="decrementAmount(i)"
                />
              </a-col>
              <a-col :md="3" :sm="12">
                <a-form-model-item :labelCol="{ xl: 24, xxl: 6 }" labelAlign="left" :label="$t('total')+': '">
                  <span>
                    {{ products[i].price * products[i].amount }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col :md="2" :sm="12">
                <a-button
                  id="deleteProduct"
                  type="danger"
                  shape="circle"
                  icon="close"
                  @click="removeProduct(i)"
                />
              </a-col>
            </a-row>
          </a-row>
          <a-row>
            <a-col :md="24" :sm="24">
              <a-form-model-item :wrapperCol="{ span: 24 }" labelAlign="left">
                <a-button id="addField" type="dashed" style="width:100%" @click="addProduct()">
                  <a-icon type="plus" /> {{ $t('addField') }}
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :sm="24" :style="{padding: '10px 10px'}">
              <a-form-model-item labelAlign="left">
                <a-button id="buttonSubmit" :loading="bools.saveButton" type="primary" html-type="submit" @click="saveOrder">
                  {{ $t('save') }}
                </a-button>
                <a-button style="margin-left: 10px" type="primary" ghost @click="clearData">
                  {{ $t('clear') }}
                </a-button>
                <!-- <a-button id="buttonSubmit" type="primary" html-type="submit" @click="click">
                  orderData
                </a-button> -->
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
        <!-- MODALS -->
        <a-modal
          v-model="bools.nameChangeModal"
          :title="$t('clientNewName')"
          footer=""
        >
          <a-form-model @submit.prevent="changeName">
            <a-form-model-item prop="newName">
              <a-input
                v-model="orderData.newName"
              />
            </a-form-model-item>
            <a-form-model-item>
              <a-button key="back" html-type="submit" type="primary">
                {{ $t('save') }}
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-modal>
        <!-- MODALS -->
      </div>
    </a-form-model>
  </a-page-header>
</template>
<script>
import { AutoComplete } from 'ant-design-vue'
import request from '@/utils/request'
import debounce from 'lodash/debounce'
import { mapActions, mapGetters } from 'vuex'
import { placeSearch, pointSearch } from '@/utils/yandexMap'
// import { geo2gisSearch, getById, geoCode2gis } from '../../utils/2gisMap'
var regExp = new RegExp('^\\d+$')
export default {
  components: {
    'a-auto-complete': AutoComplete
  },
  data () {
    // this.fetchUser = debounce(this.fetchUser, 1000)
    this.searchMap = debounce(this.searchMap, 1000)
    return {
      mapPlace: [],
      mapPoint: [],
      mapHistory: [],
      result: [],
      users: [],
      icon: 'new',
      newcoords: [],
      branches: [],
      allProducts: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      nameDisabled: false,
      colName: 24,
      delivery_type: 'delivery',
      colButton: 0,
      bools: {
        fetchUserSpin: false,
        disableClientName: false,
        addressSpin: false,
        notfoundAddress: {},
        nameChangeModal: false,
        saveButton: false,
        history: false,
        locationSpin: false,
        showCode: true,
        visibleAutoComplete: false,
        numberSelected: false
      },
      coordinates: [41.309022097090235, 69.24136827883606],
      orderData: {
        phone: '',
        payment_type: 'cash'
      },
      products: [{
        price: 0,
        amount: 1,
        value: null,
        description: ''
      }],
      hexTokens: {
      }
    }
  },
  methods: {
    ...mapActions(['getProductsMenu']),
    fetchUser (value) {
      return new Promise((resolve, reject) => {
        this.bools.fetchUserSpin = true
        request({
          url: `/search-customers`,
          params: { 'phone': value }
        }).then(res => {
          resolve(res)
          if (res.customers.length > 0) {
            this.bools.fetchUserSpin = false
            this.users = res.customers.map(e => {
              return {
                text: e.phone,
                value: e.name + ':' + e.id + ':' + e.phone
              }
            })
            console.log(this.users)
          } else {
            this.bools.fetchUserSpin = false
            this.users = []
            // this.orderData.name = undefined
            this.colName = 24
            this.colButton = 0
            this.bools.disableClientName = false
          }
        })
      })
    },
    selectUser (value) {
      console.log(value)
      this.orderData.name = value.split(':')[0]
      this.orderData.client_id = value.split(':')[1]
      this.colName = 21
      this.colButton = 3
      this.bools.disableClientName = true
      this.bools.showCode = false
      this.bools.visibleAutoComplete = true
      this.getHistoryMap()
      localStorage.setItem('sendData', JSON.stringify(this.orderData))
      this.bools.numberSelected = true
    },
    searchMap (value) {
      if (value.length > 0) {
        this.bools.locationSpin = true
        placeSearch(value).then(result => {
          if (result.length === 0) {
            this.bools.notfoundAddress.map1 = true
          } else this.bools.notfoundAddress.map1 = false
          this.mapPlace = result
          this.bools.locationSpin = false
        })
        pointSearch(value).then(result => {
          if (result.length === 0) {
            this.bools.notfoundAddress.map2 = true
          } else this.bools.notfoundAddress.map2 = false
          this.bools.locationSpin = false
          this.mapPoint = result
        })
      } else this.orderData.location = undefined

      // if (value) {
      //   // this.bools.locationSpin = true
      //   // geoMapSearch(value).then(result => {
      //   //   console.log(result, 'result')
      //   //   if (result.length === 0) {
      //   //     this.bools.notfoundAddress.map2 = true
      //   //   } else this.bools.notfoundAddress.map2 = false
      //   //   this.bools.locationSpin = false
      //   //   this.mapPlace = result
      //   // })
      //   geo2gisSearch(value).then(result => {
      //     this.mapPoint = result
      //   })
      // }
    },
    copySuccess: function (e) {
      this.$message.success(this.$t('numberCopied') + ':  ' + e.text)
    },
    onClickMap (e) {
      this.coordinates = e.get('coords')
      const coords = e.get('coords')
      const searchCoord = [coords[0], coords[1]]
      console.log(searchCoord)
      // placeSearch(searchCoord).then(result => {
      //   this.mapPoint = result
      // })
      pointSearch(searchCoord.toString()).then(result => {
        // this.orderData.location = [result[0].name, result[0].latlong[1], result[0].latlong[0]]
        this.orderData.location = result[0].name
        // this.mapPlace = result
      })

      // geoCode2gis(searchCoord).then(location => {
      //   this.orderData.location = location
      // })
    },
    selectMap (value, option) {
      if (option.key.includes('history')) {
        const a = option.key.split(':')
        this.coordinates = [a[1], a[2]]
      }
      if (option.key.includes('mapPoint')) {
        const b = option.key.split(':')
        this.coordinates = [b[2], b[3]]
      }
      if (option.key.includes('mapPlace')) {
        const c = option.key.split(':')
        this.coordinates = [c[2], c[3]]
      }
    },
    openChangeName () {
      this.bools.nameChangeModal = true
      this.orderData.newName = this.orderData.name
    },
    changeName () {
      const id = this.orderData.client_id
      const data = {
        name: this.orderData.newName,
        phone: this.orderData.phone.length > 13 ? this.orderData.phone.split(':')[2] : '+998' + this.orderData.phone
      }
      if (this.orderData.newName) {
        request({
          url: `/customers/${id}`,
          data: data,
          method: 'put'
        }).then(res => {
          console.log(res)
          this.orderData.name = res.name
          this.bools.nameChangeModal = false
        })
      } else this.$message.error(this.$t('invalidName'))
    },
    getAllBranches () {
      request({
        url: '/branches',
        method: 'get',
        params: { page: 1, limit: 1000 }
      })
        .then(result => {
          if (result.branches) {
            this.newcoords = result.branches.map(branch => {
              return {
                coordinates: [branch.location.lat, branch.location.long],
                id: branch.id,
                name: branch.name
              }
            })
            console.log(this.newcoords, 'newcoords')
          }
        })
    },
    getHistoryMap () {
      if (this.orderData.phone) {
        if (this.orderData.phone.length > 13) {
          var phone = this.orderData.phone.split(':')[2]
          request({
            url: `/customer-addresses/${phone}`,
            method: 'get'
          }).then(result => {
            this.mapHistory = result.addresses
            console.log(result)
          })
        } else if (this.orderData.phone.length === 9) {
          var phoneNew = '+998' + this.orderData.phone
          if (this.verifyUser(this.users, phoneNew)) {
            request({
              url: `/customer-addresses/${phoneNew}`,
              method: 'get'
            }).then(result => {
              this.mapHistory = result.addresses
              console.log(result)
            })
          } else {
            this.mapHistory = []
            this.$message.warning(this.$t('newUserNoHistory'))
          }
        }
      } else {
        this.mapHistory = []
      }
    },
    verifyUser (array, item) {
      if (array.length === 0) {
        return false
      } else {
        for (var i = 0; i < array.length; i++) {
          if (array[i].text === item) {
            return true
          } else return false
        }
      }
    },
    historyMapSelect (value) {
      const map = value.key.split(',')
      this.coordinates = [map[1], map[2]]
      this.orderData.location = value.label.trim()
      console.log(value)
    },
    getBranchByMap () {
      return new Promise((resolve, reject) => {
        // console.log(this.products)
        request({
          url: `/nearest-branch?long=${this.coordinates[1]}&lat=${this.coordinates[0]}`,
          method: 'get'
        }).then(result => {
          this.branches = result.branches.map(e => {
            console.log('=>>>>', result.branches)
            return {
              text: e.name,
              phone: e.phone,
              value: e.id,
              address: e.address
            }
          })
          resolve(result)
        })
      })
    },
    selectBranch (value) {
      console.log(value)
      for (var i = 0; i < this.branches.length; i++) {
        if (this.branches[i].value === value) {
          this.orderData.branch_address = this.branches[i].address
          this.orderData.branch_phone_number = this.branches[i].phone
        }
      }
      let payType = null
      payType = this.orderData.payment_type
      this.orderData.payment_type = 'visa'
      this.orderData.payment_type = payType
    },
    addProduct () {
      this.products.push({
        price: 0,
        amount: 1,
        value: null,
        description: ''
      })
    },
    selectProduct (value, index) {
      for (var i = 0; i < this.productsMenu.length; i++) {
        if (value === this.productsMenu[i].id) {
          this.products[index].value = value
          this.products[index].price = parseInt(this.productsMenu[i].price)
        }
      }
    },
    decrementAmount (index) {
      this.products[index].amount--
    },
    incrementAmount (index) {
      if (this.products[index].value) {
        this.products[index].amount++
      } else this.$message.error(this.$t('noProd'))
    },
    removeProduct (index) {
      this.products.splice(index, 1)
    },
    verifyNumber () {
      const phone = this.orderData.phone
      if (phone.length > 13) {
        const p = phone.split(':')[2]
        if (!regExp.test(p.slice(4))) this.$message.error(this.$t('invalidNumber'))
        return regExp.test(p.slice(4))
      } else if (phone.length === 9) {
        if (!regExp.test(phone)) this.$message.error(this.$t('invalidNumber'))
        return regExp.test(phone)
      } else {
        this.$message.error(this.$t('invalidNumber'))
        return false
      }
    },
    verifySendData () {
      const data = this.orderData
      if (data.phone !== '' &&
        data.location !== undefined &&
        data.branch_id !== undefined) {
        return true
      } else if (data.phone === '') {
        this.$message.error(this.$t('enterNumber'))
        return false
      } else if (data.location === undefined) {
        this.$message.error(this.$t('enterAddress'))
        return false
      } else if (data.branch_id === undefined) {
        this.$message.error(this.$t('branchName') + ' ' + this.$t('required2'))
        return false
      }
    },
    createUser (body) {
      return new Promise((resolve, reject) => {
        request({
          url: '/customers',
          method: 'post',
          data: body
        }).then(res => {
          resolve(res)
          this.orderData.client_id = res.id
        })
      })
    },
    verifyProducts (array) {
      if (array.length > 0) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].value === null) {
            this.bools.saveButton = false
            this.$message.error(this.$t('enterProduct'))
            return false
          }
        }
        return true
      } else {
        this.$message.error(this.$t('enterProduct'))
        this.bools.saveButton = false
        return false
      }
    },
    spliceEmptyProducts (array) {
      return new Promise((resolve) => {
        if (array.length > 1) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].value == null) {
              array.splice(i, 1)
              this.spliceEmptyProducts(array)
            }
          }
          resolve(true)
        } else {
          resolve(false)
        }
      })
    },
    clearData () {
      this.orderData = {
        phone: '',
        payment_type: 'cash',
        name: undefined,
        location: undefined,
        branch_id: undefined
      }
      this.coordinates = [41.309022097090235, 69.24136827883606]
      this.products = [{
        price: 0,
        amount: 1,
        value: null
      }]
      setTimeout(() => {
        this.clearLocal()
        this.orderData.branch_id = undefined
        this.orderData.branch_address = undefined
        this.orderData.branch_phone_number = undefined
      }, 2000)
    },
    files () {
      const files = {
        apartment: this.orderData.apartment,
        building: this.orderData.building,
        floor: this.orderData.floor,
        client_id: this.orderData.client_id,
        description: this.orderData.description,
        extra_phone_number: this.orderData.phone > 13 ? '+998' + this.orderData.phone : this.orderData.phone.split(':')[2],
        source: 'admin_panel',
        co_delivery_price: 9000,
        delivery_type: this.delivery_type,
        payment_type: this.orderData.payment_type,
        to_address: (typeof this.orderData.location.split(':')) === 'object' ? this.orderData.location.split(':')[0] : this.orderData.location,
        to_location: { lat: this.coordinates[0], long: this.coordinates[1] },
        steps: [
          {
            branch_id: this.orderData.branch_id,
            description: this.orderData.description,
            products: this.products.map(e => {
              return {
                price: e.price,
                product_id: e.value,
                quantity: e.amount,
                description: e.description
              }
            })
          }
        ]
      }
      return files
    },
    clearLocal () {
      if (localStorage.getItem('sendData')) {
        localStorage.removeItem('sendData')
        localStorage.removeItem('products')
        localStorage.removeItem('coordinates')
      }
    },
    clearHistory () {
      this.clearData()
      this.bools.history = false
      this.$message.success(this.$t('clearedHistory'))
    },
    saveRequest (files) {
      request({
        url: '/ondemand-order',
        method: 'post',
        data: files
      }).then(res => {
        this.bools.saveButton = false
        this.clearData()
        this.bools.history = false
        this.$router.push({ name: 'MainNewOrders', query: { status_id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617' } })
        this.$message.success(this.$t('orderSuccess'))
        console.log(res)
      }).catch(err => {
        this.bools.saveButton = false
        this.$notification.error({
          message: err.response.data.Error.Message
        })
      })
    },
    saveOrder () {
      if (this.verifySendData()) {
        if (this.verifyNumber()) {
          if (this.products.length > 0) {
            if (this.orderData.client_id === undefined) {
              // debugger
              if (this.orderData.name) {
                this.createUser({
                  name: this.orderData.name,
                  phone: '+998' + this.orderData.phone
                }).then(res => {
                  this.bools.saveButton = true
                  this.spliceEmptyProducts(this.products).then(res => {
                    if (res) {
                      if (this.verifyProducts(this.products)) {
                        if (this.dublicatProducts(this.products)) {
                          console.log(this.files())
                          this.saveRequest(this.files())
                        }
                      } else this.$message.error(this.$t('enterProduct'))
                    } else if (this.verifyProducts(this.products)) {
                      if (this.dublicatProducts(this.products)) {
                        console.log(this.files())
                        this.saveRequest(this.files())
                      }
                    }
                  })
                }).catch(err => {
                  this.$message.error(err.message)
                })
              } else this.$message.error(this.$t('invalidName'))
            } else {
              this.bools.saveButton = true
              this.spliceEmptyProducts(this.products).then(res => {
                if (res) {
                  if (this.verifyProducts(this.products)) {
                    // debugger
                    if (this.dublicatProducts(this.products)) {
                      console.log(this.files())
                      this.saveRequest(this.files())
                    }
                  } else this.$message.error(this.$t('enterProduct'))
                } else if (this.verifyProducts(this.products)) {
                  if (this.dublicatProducts(this.products)) {
                    console.log(this.files())
                    this.saveRequest(this.files())
                  }
                }
              })
            }
          } else this.$message.error(this.$t('enterProduct'))
        }
      }
    },
    getDataHistory () {
      if (localStorage.getItem('sendData')) {
        const localData = JSON.parse(localStorage.getItem('sendData'))
        const data = this.orderData
        if (localData.phone) {
          const phone = localData.phone.length > 13 ? localData.phone.split(':')[2] : localData.phone
          console.log(phone)
          if (phone.length === 13) this.fetchUser(phone.slice(4))
          if (phone.length === 9) this.fetchUser(phone)
          data.phone = localData.phone.length > 13 ? localData.phone.split(':')[2].slice(4) : localData.phone
          console.log(localData.phone)
          data.client_id = localData.phone.length > 13 ? localData.phone.split(':')[1] : undefined
        }
        if (localData.name) data.name = localData.name
        if (localData.apartment) data.apartment = localData.apartment
        if (localData.building) data.building = localData.building
        if (localData.floor) data.floor = localData.floor
        if (localData.description) data.description = localData.description
        if (localData.payment_type) data.payment_type = localData.payment_type
        if (localData.location) {
          data.location = (typeof localData.location.split(':')) === 'object' ? localData.location.split(':')[0] : localData.location
          if (localStorage.getItem('coordinates')) {
            const coords = JSON.parse(localStorage.getItem('coordinates'))
            this.coordinates = coords
            // debugger
            this.getBranchByMap().then(res => {
              if (localData.branch_id) {
                data.branch_id = localData.branch_id
                this.selectBranch(localData.branch_id)
              }
            })
          }
        }
        if (localStorage.getItem('products')) {
          const product = JSON.parse(localStorage.getItem('products'))
          this.getProductsMenu().then(res => {
            this.products = product
          })
        }
      }
    },
    dublicatProducts (array) {
      if (array.length > 1) {
        var sortArray = []
        var havDublicate = true
        for (var i = 0; i < array.length; i++) {
          sortArray.push(Object.values(array[i])[2])
        }
        sortArray.filter((item, index) => {
          if (sortArray.indexOf(item) !== index) {
            this.$message.error(`${index + 1} - ${this.$t('dubProd')}`)
            this.bools.saveButton = false
            havDublicate = false
          }
        })
        return havDublicate
      } else return true
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  computed: {
    ...mapGetters(['productsMenu']),
    contentCss () {
      return this.icon
    },
    totalPriceProduct () {
      var totalPrice = 0
      for (var i = 0; i < this.products.length; i++) {
        const total = this.products[i].price * this.products[i].amount
        totalPrice += total
      }
      return totalPrice
    },
    prodPrice () {
      return this.products.map(e => e.price)
    },
    prodAmount () {
      return this.products.map(e => e.amount)
    },
    prodValue () {
      return this.products.map(e => e.value)
    }
  },
  watch: {
    mapPlace (val) {
      console.log(val)
    },
    'orderData.phone': debounce(function (val) {
      this.bools.numberSelected = false
      if (val.length <= 13) {
        // debugger
        console.log(val)
        var newVal = '+998' + val
        if ((val.length >= 10) && (val.length <= 13)) {
          this.orderData.name = undefined
          this.bools.visibleAutoComplete = false
          this.bools.showCode = true
          this.orderData.phone = ''
          // this.orderData.name = undefined
          this.colName = 24
          this.colButton = 0
        } else if (val.length <= 9) {
          this.fetchUser(val).then(res => {
            // localStorage.setItem('sendData', JSON.stringify(this.orderData))
            if (this.users.length > 0) {
              setTimeout(() => {
                for (var i = 0; i < this.users.length; i++) {
                  if (this.users[i].text === newVal) {
                    this.orderData.name = this.users[i].value.split(':')[0]
                    this.orderData.client_id = this.users[i].value.split(':')[1]
                    this.colName = 21
                    this.colButton = 3
                    this.bools.visibleAutoComplete = false
                    this.bools.showCode = true
                    this.bools.disableClientName = true
                    this.getHistoryMap()
                  } else {
                    this.orderData.name = undefined
                    this.colName = 24
                    this.colButton = 0
                    this.bools.showCode = true
                    this.bools.disableClientName = false
                    localStorage.setItem('sendData', JSON.stringify(this.orderData))
                  }
                }
              }, 500)
            } else {
              this.getHistoryMap()
            }
          })
          if (this.bools.numberSelected) {
            this.orderData.name = undefined
            this.bools.visibleAutoComplete = false
            this.bools.showCode = true
            this.orderData.phone = ''
            // this.orderData.name = undefined
            this.colName = 24
            this.colButton = 0
          }
        }
        if (val === '') {
          this.orderData.name = undefined
          this.bools.visibleAutoComplete = false
          this.bools.showCode = true
          this.orderData.phone = ''
          // this.orderData.name = undefined
          this.colName = 24
          this.colButton = 0
        }
      }
    }, 1000),
    'orderData.location': function (val) {
      localStorage.setItem('sendData', JSON.stringify(this.orderData))
      if (val) {
        if (val.length === 0) {
          this.mapPlace = []
          this.mapPoint = []
        }
      }
    },
    'orderData.payment_type': function (val) {
      localStorage.setItem('sendData', JSON.stringify(this.orderData))
    },
    'orderData.name': function (val) {
      localStorage.setItem('sendData', JSON.stringify(this.orderData))
    },
    'orderData.branch_id': function (val) {
      if (val) {
        localStorage.setItem('sendData', JSON.stringify(this.orderData))
      }
    },
    orderData (val) {
      localStorage.setItem('sendData', JSON.stringify(val))
    },
    coordinates (value) {
      localStorage.setItem('coordinates', JSON.stringify(value))
      this.getBranchByMap().then(res => {
        console.log(res)
        this.orderData.branch_id = res.branches[0].id
        this.selectBranch(res.branches[0].id)
      })
    },
    prodPrice (val) {
      localStorage.setItem('products', JSON.stringify(this.products))
    },
    prodAmount (val) {
      localStorage.setItem('products', JSON.stringify(this.products))
    },
    prodValue (val) {
      localStorage.setItem('products', JSON.stringify(this.products))
    }
    // products (val) {
    //   localStorage.setItem('products', JSON.stringify(val))
    //   setTimeout(() => {
    //     localStorage.setItem('products', JSON.stringify(val))
    //   }, 5000)
    // }
  },
  mounted () {
    this.getAllBranches()
    this.getProductsMenu().then(res => {
    })
    if (localStorage.getItem('sendData')) {
      this.bools.history = true
    }
    setTimeout(() => {
      this.getDataHistory()
    }, 3000)
  },
  created () {
    this.getProductsMenu().then(res => {
      console.log(res)
    })
  }
}
</script>
<style>
.ant-form-item-label-left>label::after {
  content: ":";
  position: relative;
  top: -8.5px;
  margin: 0 8px 0 2px;
}
.ant-select-dropdown-menu-item-group-list > .ant-select-dropdown-menu-item
.ant-form-item {
  margin-bottom: 13px;
}
.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
  background-color: #90caf9;
  border-color: #64b5f6;
}
.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active {
  background-color: #64b5f6;
  border-color: #87bce7;
}
.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  background-color: #64b5f6;
  border-color: #42a5f5;
}
#map {
  position: absolute;
  margin:0;
  left:0;
  top:0;
  height:640px;
  width:100%;
}
@media(max-width: 1400px){
  #numberPrefix {
    font-size: 10px;
  }
}
@media(max-width: 1500px){
  #numberPrefix {
    font-size: 12px;
  }
}
</style>
