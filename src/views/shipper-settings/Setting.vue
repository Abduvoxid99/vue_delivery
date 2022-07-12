<template>
  <a-card>
   <a-tabs :animated="false" @change="changeTab" :active-key="activeKey">
     <a-tab-pane key="1" :tab="$t('settings')">
       <a-card v-if="!loadData">
         <a-row>
           <a-col :span="7" style="padding-right: 10px">
             <a-card title="Настройки компании">
               <div style="text-align: center" >
                <label for="avatar">
                  <a-avatar v-if="image_url" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px; cursor:pointer;" :src="image_url" :size="128" icon="user" />
                  <a-avatar v-else style="box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px; cursor:pointer;" :size="128" icon="user" />
                </label>
                <input @change="setAvatar" style="display: none" type="file" id="avatar" name="avatar" accept="image/png, image/jpeg">
               </div>
               <br><br>
               <a-form-model-item class="disable-margin" :label="$t('company_name')">
                 <a-input v-model="data.name"/>
               </a-form-model-item>
                <a-form-model-item class="disable-margin" label="Адрес Telegram">
                  <a-input v-model="data.call_center_tg"/>
                </a-form-model-item>
               <a-form-model-item class="disable-margin" label="Интеграция">
                 <a-select v-model="data.crm" style="width: 100%">
                   <a-select-option value="jowi">JOWI</a-select-option>
                   <a-select-option value="iiko">IIKO</a-select-option>
                   <a-select-option value="none">никто</a-select-option>
                 </a-select>
               </a-form-model-item>

              <a-col v-for="(p,i) in data.phones" :key="i" style="padding-right: 5px; padding-left: 5px">
                <a-form-model-item class="disable-margin" :label="$t('phone')">
                  <a-input-search v-model="p.phone" placeholder="+998 XX XXX XX XX" @search="phoneActions(i)">
                    <a-button ghost @click="phoneActions(i)" :type="data.phones.length > 1 ? 'danger' : 'primary'" slot="enterButton" :icon="data.phones.length > 1 ? 'delete' : 'plus'"/>
                  </a-input-search>
                </a-form-model-item>
              </a-col>

               <a-form-model-item label="Изображение меню">
                 <a-upload
                   :custom-request="uploadImage"
                   list-type="picture-card"
                   class="avatar-uploader"
                   :show-upload-list="false"
                   :before-upload="beforeUpload"
                 >
                   <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                   <div v-else>
                     <a-icon :type="loadingImage ? 'loading' : 'plus'" />
                     <div class="ant-upload-text">
                       {{ $t('image_view') }}
                     </div>
                   </div>
                 </a-upload>
               </a-form-model-item>
             </a-card>
           </a-col>
           <a-col :span="17" style="padding-left: 10px">
               <a-form-model ref="ruleForm" :model="data">
                 <!-- Business -->
                <a-card title="Настройки бизнеса">
                  <a-col :span="24" >
                    <a-row>
                      <a-col :span="12" style="padding-right: 10px">
                        <a-form-model-item :label="$t('order_road')">
                          <div>
                            <a-radio-group v-model="data.order_road" >
                              <a-radio :style="radioStyle" :value="'radius'">
                                {{ $t('radius') }}
                              </a-radio>
                              <a-radio :style="radioStyle" :value="'way'">
                                {{ $t('way') }}
                              </a-radio>
                            </a-radio-group>
                          </div>
                        </a-form-model-item>
                      </a-col>
                      <a-col :span="12" style="padding-left: 10px">
                        <a-form-model-item :label="$t('enable_courier_working_hours')">
                          <a-switch id="enable_courier_working_hours" v-model="data.enable_courier_working_hours" />
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                    <a-col :span="12" style="padding-right: 20px">
                      <a-form-model-item label="Радиус">
                        <a-input addon-after="м" type="number" :min="0" :disabled="!data.check_courier_action_radius" v-model="data.courier_action_radius"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item :label="$t('courier_period')">
                        <a-input type="number" :min="0" v-model="data.courier_period" addon-after="мин" />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12" style="padding-right: 20px">
                      <a-form-model-item label="Начало рабочего времени">
                        <a-time-picker style="width: 100%" v-model="data.work_hour_start" format="HH:mm" valueFormat="HH:mm"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item label="Конец рабочего времени" >
                        <a-time-picker style="width: 100%" v-model="data.work_hour_end" format="HH:mm" valueFormat="HH:mm"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12" style="padding-right: 20px">
                      <a-form-model-item label="Макс.время доставки">
                        <a-input type="number" :min="0" v-model="data.max_delivery_time" addon-after="мин" />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item :label="$t('future_order_time')">
                        <a-input type="number" :min="0" v-model="data.future_order_time" addon-after="мин" />
                      </a-form-model-item>
                    </a-col>
                    <a-col style="padding-right: 20px" :span="12">
                      <a-form-model-item :label="$t('Заказ в позднее время')">
                        <a-input type="number" :min="0" v-model="data.order_late_time" addon-after="мин"/>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-model-item :label="$t('Цвет позднего заказа')">
                        <a-select id="item_id" style="width: 100%" v-model="data.order_late_colour">
                          <a-select-option value="yellow">Yellow</a-select-option>
                          <a-select-option value="skyblue">Skyblue</a-select-option>
                          <a-select-option value="red">Red</a-select-option>
                          <a-select-option value="green">Green</a-select-option>
                          <a-select-option value="burlywood">Burlywood</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="12" style="padding-right: 20px">
                      <a-form-model-item :label="$t('minimum_order_price')">
                        <a-input type="number" v-model="data.minimal_order_price" />
                      </a-form-model-item>
                    </a-col>
                  </a-col>
                  <a-col :span="24">
                    <a-col :span="12">
                      <a-form-model-item :label="$t('is_orders_limit')" >
                        <a-switch id="is_orders_limit" v-model="data.is_orders_limit" />
                      </a-form-model-item>
                    </a-col>
                    <a-col v-if="data.is_orders_limit" :span="13">
                      <a-form-model-item :label="$t('branch_action_radius')" >
                        <a-input type="number" :min="0" v-model="data.branch_action_radius" addon-after="км" />
                      </a-form-model-item>
                    </a-col>
                  </a-col>
                  <a-checkbox v-if="data.is_orders_limit" v-model="data.is_pickup_load" style="width: 500px !important">
                         Нагрузка также рассчитывается для самовывоза
                       </a-checkbox>
                </a-card>
                <!-- Courier -->
                <a-card title="Настройки курьера" style="margin-top: 20px" >
                  <!-- <a-col :span="24"> -->
                    <!-- <a-row>
                      <a-col :span="7" style="padding-right: 10px">
                        <a-form-model-item :label="$t('order_road')">
                          <div>
                            <a-radio-group v-model="data.order_road" >
                              <a-radio :style="radioStyle" :value="'radius'">
                                {{ $t('radius') }}
                              </a-radio>
                              <a-radio :style="radioStyle" :value="'way'">
                                {{ $t('way') }}
                              </a-radio>
                            </a-radio-group>
                          </div>
                        </a-form-model-item>
                      </a-col>
                    </a-row> -->
                    <!-- <a-col :span="12" style="padding-right: 20px">
                      <a-form-model-item label="Радиус">
                        <a-input addon-after="м" type="number" :min="0" :disabled="!data.check_courier_action_radius" v-model="data.courier_action_radius"/>
                      </a-form-model-item>
                    </a-col> -->
                     <a-col :span="12" style="padding-right: 20px">
                       <a-form-model-item label="Mакс. количество заказов у курьера">
                          <a-input type="number" :min="0" v-model="data.max_courier_orders"/>
                        </a-form-model-item>
                     </a-col>
                  <!-- </a-col> -->
                  <a-col :span="12">
                    <a-form-model-item :label="$t('courier_accept_radius')" >
                      <a-input type="number" :min="0" v-model="data.courier_accept_radius" addon-after="км" />
                    </a-form-model-item>
                  </a-col>
                  <!-- <a-col :span="12">
                    <a-form-model-item :label="$t('courier_notification_time')" style="margin-right: 20px" >
                      <a-input type="number" :min="0" :max="data.max_delivery_time" v-model="data.courier_notification_time" addon-after="мин" />
                    </a-form-model-item>
                  </a-col> -->
                  <!-- <a-col :span="24">
                    <a-col :span="12">
                      <a-form-model-item :label="$t('is_orders_limit')" >
                        <a-switch id="is_orders_limit" v-model="data.is_orders_limit" />
                      </a-form-model-item>
                    </a-col>
                    <a-col v-if="data.is_orders_limit" :span="13">
                      <a-form-model-item :label="$t('branch_action_radius')" >
                        <a-input type="number" :min="0" v-model="data.branch_action_radius" addon-after="км" />
                      </a-form-model-item>
                    </a-col>
                  </a-col> -->

                   <a-col :span="24">
                     <a-col :span="12" style="padding-right: 10px">
                       <!-- <a-checkbox v-if="data.is_orders_limit" v-model="data.is_pickup_load" style="width: 500px !important">
                         Нагрузка также рассчитывается для самовывоза
                       </a-checkbox> -->
                       <br>
                       <a-checkbox v-model="data.courier_accepts_first" style="width: 500px !important">
                         Курьер принимает заказ первым
                       </a-checkbox>
                       <br>
                       <a-checkbox v-model="data.check_courier_action_radius" style="width: 500px !important">
                         Проверять действия курьера по радиусу
                       </a-checkbox>
                       <br>
                       <a-checkbox v-model="data.show_location_before_accepting" style="width: 500px !important">
                         Локация клиента у курьера перед принятием заказа
                       </a-checkbox>
                       <br>
                       <a-checkbox v-model="data.process_only_paid_orders" style="width: 500px !important">
                         Показывать только оплаченные заказы у курьера
                       </a-checkbox>
                       <br>
                       <a-checkbox v-model="data.is_courier_billing" style="width: 500px !important">
                         Включить биллинг для курьеров
                       </a-checkbox>
                       <br>
                       <a-checkbox v-if="id === '36b00947-ad7a-40eb-b7ca-1c0ea267f2ac'" v-model="data.free_delevery_for_delayed_order" style="width: 500px !important">
                         Проверка статуса оплаты после доставки
                       </a-checkbox>
                     </a-col>
                     <a-col v-if="data.free_delevery_for_delayed_order && id === '36b00947-ad7a-40eb-b7ca-1c0ea267f2ac'" :span="24">
                      <a-col :span="12" style="padding-right: 10px">
                        <a-form-model-item :label="$t('time')" style="margin-top: 20px" >
                        <a-input v-model.number="data.free_delevery_time" type="input" />
                     </a-form-model-item>
                      </a-col>
                     </a-col>

                   </a-col>
                   <a-col :span="24">
                     <a-form-model-item :label="$t('description')" style="margin-top: 20px" >
                       <a-input v-model="data.description" type="textarea" />
                     </a-form-model-item>
                   </a-col>
                   <a-col :span="24">
                   </a-col>

                  <a-col :span="24" style="display: flex; justify-content: flex-end">
                      <a-button @click="refreshTelegram" type="default" icon="sync">{{ $t('refresh_telegram') }}</a-button>
                      <a-button style="margin-left: 10px" @click="saveData" :loading="loading" type="primary">{{ $t('save') }}</a-button>
                   </a-col>
             </a-card>
               </a-form-model>
           </a-col>
         </a-row>
       </a-card>
       <a-card v-if="loadData" >
         <a-row>
           <a-col :span="8" style="padding-right: 10px">
             <a-card>
               <a-skeleton active />
               <a-skeleton active />
             </a-card>
           </a-col>
           <a-col :span="16" style="padding-left: 10px">
             <a-card>
               <a-skeleton active />
               <a-skeleton active />
               <a-skeleton active />
             </a-card>
           </a-col>
         </a-row>
       </a-card>
     </a-tab-pane>
     <a-tab-pane key="2" :tab="$t('geozone')">
       <Geozone />
     </a-tab-pane>
     <a-tab-pane key="3" :tab="$t('free.geozone')">
       <free-geozone />
     </a-tab-pane>
   </a-tabs>
  </a-card>
</template>

<script>
import Geozone from '@/views/geozone/List'
import FreeGeozone from '@/views/freeGeozone/List.vue'
import { mapActions } from 'vuex'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: {
    Geozone,
    FreeGeozone
  },
  data () {
    return {
      loadData: false,
      image_url: null,
      loading: false,
      imageUrl: null,
      loadingImage: false,
      activeKey: '1',
      id: '',
      data: {
        logo: '',
        name: '',
        menu_image: '',
        description: '',
        call_center_tg: '',
        work_hour_end: '',
        work_hour_start: '',
        is_active: false,
        courier_accepts_first: false,
        is_pickup_load: false,
        check_courier_action_radius: false,
        show_location_before_accepting: false,
        process_only_paid_orders: false,
        is_courier_billing: false,
        courier_action_radius: null,
        max_courier_orders: null,
        max_delivery_time: null,
        minimal_order_price: 0,
        order_late_time: 40,
        order_late_colour: null,
        is_orders_limit: false,
        order_road: 'way',
        courier_period: null,
        future_order_time: null,
        courier_notification_time: 0,
        branch_action_radius: 0,
        courier_accept_radius: 0,
        enable_courier_working_hours: false,
        free_delevery_for_delayed_order: false,
        free_delevery_time: '',
        crm: 'none',
        phones: [
          {
            phone: ''
          }
        ]
      },
    }
  },
  watch: {
    'data.check_courier_action_radius': function (val) {
      console.log(val)
    }
  },
  methods: {
    ...mapActions(['getShipper', 'upload', 'updateShipper']),
    validatePhone (rule, value, callback) {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    },
    addPhone () {
      this.data.phones.push({ phone: '' })
    },
    validatePhoneNumbers () {
      const array = this.data.phones
      for (let i = 0; i < array.length; i++) {
        if (!/^[+][9][9][8]\d{9}$/.test(array[i].phone)) {
          this.$message.error('Неверный синтаксис телефонных номеров')
          return false
        }
      }
      return true
    },
    removePhone (i) {
      this.data.phones.splice(i, 1)
    },
    refreshTelegram () {
      if (this.data.menu_image.length) {
        this.$store.dispatch('updateTelegramImage', this.data.menu_image)
          .then(() => this.$message.success(this.$t('succesfully.updated.tg.image')))
          .catch(() => this.$message.error(this.$t('updating.tg.image.failed')))
      }
      this.$store.dispatch('updateTelegramBase', { option: 'shipper' })
        .then(() => this.$message.success(this.$t('succesfully.updated.tg.base')))
        .catch(() => this.$message.error(this.$t('updating.tg.base.failed')))
    },
    changeTab (e) {
      this.activeKey = e
      this.$router.push({
        name: this.$route.name,
        query: {
          tab: e
        }
      })
    },
    phoneActions (i) {
      if (this.data.phones.length > 1) this.removePhone(i)
      else this.addPhone()
    },
    setData (data) {
      this.image_url = data.logo
      this.imageUrl = data.menu_image
      // this.id = data.id
      console.log('id', data.id)
      const _form = this.data
      _form.phones = data.phone.map(e => {
        return { phone: e }
      })
      _form.courier_accepts_first = data.courier_accepts_first
      _form.is_pickup_load = data.is_pickup_load
      _form.check_courier_action_radius = data.check_courier_action_radius
      _form.max_courier_orders = data.max_courier_orders
      _form.max_delivery_time = parseInt(data.max_delivery_time)
      _form.courier_action_radius = parseInt(data.courier_action_radius)
      _form.minimal_order_price = parseInt(data.minimal_order_price)
      _form.order_late_time = parseInt(data.order_late_time)
      localStorage.setItem('time', parseInt(data.order_late_time))
      localStorage.setItem('color', JSON.stringify(data.order_late_colour))
      _form.order_late_colour = data.order_late_colour
      _form.is_orders_limit = data.is_orders_limit
      _form.description = data.description
      _form.is_active = data.is_active
      _form.call_center_tg = data.call_center_tg
      _form.show_location_before_accepting = data.show_location_before_accepting
      _form.process_only_paid_orders = data.process_only_paid_orders
      _form.is_courier_billing = data.is_courier_billing
      _form.work_hour_end = data.work_hour_end
      _form.work_hour_start = data.work_hour_start
      _form.menu_image = data.menu_image
      _form.logo = data.logo
      _form.name = data.name
      _form.crm = data.crm
      _form.courier_period = data.courier_period
      _form.future_order_time = data.future_order_time
      _form.courier_notification_time = data.courier_notification_time
      _form.branch_action_radius = data.branch_action_radius
      _form.courier_accept_radius = data.courier_accept_radius.toString()
      _form.free_delevery_for_delayed_order = data.free_delevery_for_delayed_order
      _form.free_delevery_time = data.free_delevery_time
      _form.order_road = data.order_road
      _form.enable_courier_working_hours = data.enable_courier_working_hours
      _form.id = data.id
    },
    setAvatar (e) {
      const image = e.target.files[0]
      const file = new FormData()
      file.append('file', e.target.files[0])
      this.upload(file).then(res => {
        this.image_url = URL.createObjectURL(image)
        this.data.logo = res.filename
      })
      console.log(e.target.files[0])
    },
    saveData () {
      this.loading = true
      if (this.validatePhoneNumbers()) {
        // eslint-disable-next-line
        let _data = { ...this.data }
        delete _data.phones
        // eslint-disable-next-line
        _data.phone = this.data.phones.map(e => {
          return e.phone
        })
        _data.max_delivery_time = parseInt(this.data.max_delivery_time)
        _data.max_courier_orders = parseInt(this.data.max_courier_orders)
        if (this.data.check_courier_action_radius) _data.courier_action_radius = parseInt(this.data.courier_action_radius)
        else delete _data.courier_action_radius
        _data.logo = (this.data.logo && this.data.logo.split('/')[4]) ? this.data.logo.split('/')[4] : this.data.logo
        _data.menu_image = (this.data.menu_image && this.data.menu_image.split('/')[4]) ? this.data.menu_image.split('/')[4] : this.data.menu_image
        _data.minimal_order_price = parseInt(this.data.minimal_order_price)
        _data.order_late_time = parseInt(this.data.order_late_time)
        localStorage.setItem('time', parseInt(this.data.order_late_time))
        localStorage.setItem('color', JSON.stringify(this.data.order_late_colour))
        _data.order_late_colour = this.data.order_late_colour
        _data.courier_period = parseInt(this.data.courier_period)
        _data.future_order_time = parseInt(this.data.future_order_time)
        _data.courier_notification_time = parseInt(this.data.courier_notification_time)
        _data.branch_action_radius = parseInt(this.data.branch_action_radius)
        _data.id = this.data.id
        _data.courier_accept_radius = parseFloat(this.data.courier_accept_radius.replace(',', '.').replace(' ', ''))
        _data.free_delevery_time = this.data.free_delevery_for_delayed_order ? this.data.free_delevery_time : '0'
        console.log(_data)
        this.updateShipper(_data).then(res => {
          localStorage.removeItem('crm')
          if (this.data.crm !== 'none') {
            localStorage.setItem('crm', this.data.crm)
            this.$store.commit('SET_CRM_TYPE', this.data.crm)
          }
          this.$message.success('Компания обновлена успешно')
          console.log('success')
        })
          .finally(() => {
            this.loading = false
          })
      }
      this.loading = false
    },
    uploadImage (e) {
      console.log(e)
      this.loadingImage = true
      const file = new FormData()
      file.append('file', e.file)
      this.$store.dispatch('upload', file).then(res => {
        getBase64(e.file, imageUrl => {
          this.data.menu_image = res.filename
          this.imageUrl = imageUrl
        })
      })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          console.log('FINALLLY')
          this.loadingImage = false
        })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
    },
  },
  created () {
    if (this.$route.query.tab) {
      this.activeKey = this.$route.query.tab
    } else this.activeKey = '1'
  },
  mounted () {
    console.log('store', this.$store.state.shipper_id)
    this.loadData = true
    this.getShipper().then(res => {
      this.setData(res)
      this.loadData = false
      console.log(res)
      this.id = res.id
    })
  }
}
</script>

<style lang="less">
.avatar{
  width: 500px;
  height: 128px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: rgba(0,0,0, .5);
}
img, .mask {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 250px;
  height: auto;
  overflow: hidden;
}

.avatar-uploader > .ant-upload.ant-upload-select-picture-card {
  width: 100%;
  height: 150px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-form-item.disable-margin {
  margin-bottom: 5px;
}

.switch-label {
  margin: 0 10px;
}
</style>
