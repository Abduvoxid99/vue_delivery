<template>
  <div>
    <a-card :title="$route.params.id ? $t('branch.update') : $t('branch.create')">
      <a-form-model layout="horizontal" ref="branchForm" :rules="rule" :model="form" @submit.prevent="save">
        <a-row>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item :label="$t('name')" prop="name">
              <a-input
                v-model="form.name"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item :label="$t('phone')" prop="phone">
              <a-input
                v-model="form.phone"/>
            </a-form-model-item>
          </a-col>
          <!-- <a-col span="12" v-if="type" :style="{padding: '0 10px'}">
              <a-form-item :label="(crm === 'iiko' ? 'IIKO' : 'JOWI') + ' ' + $t('Филиал')">
                <a-select @change="setProductType" style="width: 100%" show-search :filter-option="filterOption">
                  <a-select-option v-for="p in branches" :key="p.id" :value="p.id">
                    {{ p.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
          </a-col> -->
          <a-col :span="12" :style="{padding: '0 10px'}" style="margin-top: 4px">
            <a-form-model-item :label="$t('address')">
              <location-autocomplete ref="location" v-model="address"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item :label="$t('destination')" prop="destination">
              <a-input
                v-model="form.destination"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-row>
              <a-col :span="24">
                <yandex-map
                  @click="onClickMap"
                  zoom="15"
                  ref="myRef"
                  :controls="['zoomControl']"
                  :coords="coordinates"
                  searchControlProvider="yandex#search"
                  style="height:406px; padding-top: 24px"
                >
                  <ymap-marker
                    marker-id="123"
                    :coords="coordinates"
                  />
                  <ymap-marker
                    marker-id="ymap-branch-polygon"
                    marker-type="Polygon"
                    @click="onClickMap"
                    :coords="geozoneCoords"
                  />
                  <!--Markers-->
                </yandex-map>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-button
                  type="primary"
                  style="margin-top: 14px"
                  @click="openMap"
                >
                  {{ $t('to.draw.geozone') }}
                </a-button>
              </a-col>
              <a-col :span="6">
                 <a-button
                  type="danger"
                  style="margin-top: 14px"
                  @click="deleteGeozone"
                >
                  {{ $t('delete.geozone') }}
                </a-button>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item label="Выберите тариф" prop="fare_id">
              <a-select v-model="form.fare_id" show-search :filter-option="filterOption">
                <a-select-option v-for="item in fareList" :key="item.id" :value="item.id">
                  <a-row type="flex" justify="space-between">
                    <a-col span="auto">{{ item.base_price }}</a-col>
                    <a-col span="auto"> ({{ item.base_distance ? item.base_distance : 0 }} km )</a-col>
                  </a-row>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item :label="$t('TelegramCat')" prop="destination">
              <a-input v-model="form.tg_chat_id"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-row>
              <a-col :span="24">
                <a-col :span="12" :style="{padding: '0 10px'}">
                  <a-form-model-item label="Начало рабочего времени" prop="work_hour_start">
                    <a-time-picker placeholder="введите время" v-model="form.work_hour_start" style="width: 100%" valueFormat="HH:mm" format="HH:mm" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12" :style="{padding: '0 10px'}">
                  <a-form-model-item label="Конец рабочего времени" prop="work_hour_end">
                    <a-time-picker placeholder="введите время" v-model="form.work_hour_end" style="width: 100%" valueFormat="HH:mm" format="HH:mm" />
                  </a-form-model-item>
                </a-col>
              </a-col>
              <a-col :span="24">
                <a-col :span="12" :style="{padding: '0 10px'}">
                  <a-form-model-item label="Максимальное количество заказов" prop="orders_limit">
                    <a-input placeholder="введите количество" v-model="form.orders_limit" style="width: 100%" type="number" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12" :style="{padding: '0 10px'}">
                  <a-form-model-item label="Радиус без суммы доставки" prop="radius_without_delivery_price">
                    <div style="display: flex; align-items: center; grid-gap: 10px; height: 40px" >
                      <a-switch v-model="radiusInputVisible" />
                      <a-input v-if="radiusInputVisible" placeholder="" :min="0" addon-after="км" v-model="form.radius_without_delivery_price" style="width: 100%" type="number" />
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-col>
              <a-col :span="24">
                <a-col :span="14" :style="{padding: '0 10px'}">
                <a-form-model-item label="Изображение">
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
                </a-col>
                <a-col :span="10" :style="{padding: '0 10px'}">
                  <a-form-model-item label="Статус" prop="radius_without_delivery_price">
                    <div style="display: flex; align-items: center; grid-gap: 10px; height: 40px" >
                      <a-switch v-model="form.is_active" />
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-button type="primary" :loading="loading" html-type="submit">
          {{ $route.params.id ? $t('update') : $t('save') }}
        </a-button>
      </a-form-model>

      <geozone-drawer
        ref="geozoneDrawer"
        :markerCoords="coordinates"
        :geozoneData="geozoneData"
        @save="onGeozoneSaved"
        @deleteGeozone="deleteGeozone"
      />
    </a-card>
  </div>
</template>

<script>
import LocationAutoComplete from '@/views/orderNew/orderCreation/LocationAutoComplete'
import GeozoneDraver from './GeozoneDrawer.vue'
import { pointSearch } from '@/utils/yandexMap'
import { mapActions } from 'vuex'
import moment from 'moment'
// import ymaps from 'ymaps'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: {
    'location-autocomplete': LocationAutoComplete,
    'geozone-drawer': GeozoneDraver
  },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
    return {
      loading: false,
      imageUrl: null,
      loadingImage: false,
      radiusInputVisible: true,
      crm: localStorage.getItem('crm'),
      type: Object.keys(localStorage).includes('crm'),
      branches: [],
      fareList: [],
      address: null,
      rule: {
        address: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        destination: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        fare_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        work_hour_end: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        work_hour_start: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validatePhone, trigger: 'change' }],
      },
      coordinates: [41.309022097090235, 69.24136827883606],
      geozoneCoords: [[]],
      geozoneData: null,
      form: {
        address: '',
        destination: '',
        fare_id: '',
        image: '',
        iiko_id: '',
        jowi_id: '',
        iiko_terminal_id: '',
        tg_chat_id: '',
        orders_limit: null,
        radius_without_delivery_price: 0,
        location: {
          lat: 41.309022097090235,
          long: 69.24136827883606
        },
        name: '',
        phone: '',
        work_hour_end: '',
        work_hour_start: '',
        geozone_id: null,
        is_active: true
      }
    }
  },
  watch: {
    radiusInputVisible (val) {
      if (!val) this.form.radius_without_delivery_price = 0
    },
    coordinates (val) {
      console.log(val)
      this.form.location.lat = val[0]
      this.form.location.long = val[1]
    },
    address (val) {
      console.log(val)
      this.coordinates = val.coords
      // this.initMap()
      this.form.address = val.value
    }
  },
  methods: {
    ...mapActions(['saveBranch', 'getBranchById', 'updateBranch', 'getGeozoneById']),
    openMap () {
      this.$refs.geozoneDrawer.setCoords(this.geozoneCoords)
      this.$refs.geozoneDrawer.show()
    },
    onGeozoneSaved (val) {
      console.log(val)
      this.geozoneCoords = val.geometry
      this.form.geozone_id = val.id
    },
    getGeozone (id) {
      this.getGeozoneById(id).then(res => {
        this.geozoneData = res
        this.geozoneCoords = [res.points.map(({ lat, lon }) => [lat, lon])]
      })
    },
    deleteGeozone () {
      this.$refs.geozoneDrawer.setCoords([[]])
      this.geozoneCoords = [[]]
      this.geozoneData = null
      this.form.geozone_id = null
    },
    save () {
      this.$refs.branchForm.validate(valid => {
        this.loading = true
        if (valid) {
          if (this.$route.params.id) {
            const _form = { ...this.form }
            _form.id = this.$route.params.id
            this.updateBranch(_form).then(res => {
              this.$message.success(this.$t('successfullyUpdated'))
              this.$router.push({
                name: 'BranchList'
              })
                .finally(() => {
                  this.loading = false
                })
            })
          } else {
            this.saveBranch(this.form).then(res => {
              // console.log(res)
              this.$message.success(this.$t('successfullyAdded'))
              this.$router.push({
                name: 'BranchList'
              })
            })
              .finally(() => {
                this.loading = false
              })
          }
        } else this.loading = false
      })
    },
    onClickMap (e) {
      this.coordinates = e.get('coords')
      console.log('COORDS: ', e.get('coords'))
      pointSearch(e.get('coords').toString()).then(result => {
        console.log('yandex==>>>', result)
        console.log(this.$refs.location)
        this.address = {
          coords: this.coordinates,
          value: result[0].name
        }
        this.$refs.location.location = result[0].name
        this.form.address = result[0].name
      })
    },
    uploadImage (e) {
      console.log(e)
      this.loadingImage = true
      const file = new FormData()
      file.append('file', e.file)
      this.$store.dispatch('upload', file).then(res => {
        getBase64(e.file, imageUrl => {
          this.form.image = res.filename
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
    // showMapData () {
    //   console.log(this.$refs.basicMap)
    //   this.polygon.stopDrawing()
    // },
    // initMap () {
    //   ymaps.load().then(maps => {
    //     // eslint-disable-next-line no-new
    //       const _this = this
    //       this.map = new maps.Map('map', {
    //         center: this.coordinates,
    //         zoom: 12,
    //         controls: ['zoomControl', 'fullscreenControl']
    //       })
    //       this.point = new maps.GeoObject({
    //         geometry: {
    //           type: 'Point',
    //           coordinates: this.coordinates
    //         },
    //       }, {
    //         preset: 'islands#blackStretchyIcon',
    //         draggable: true
    //       })
    //       const myPolygon = new maps.Polygon([], {}, {
    //         editorDrawingCursor: 'crosshair',
    //         editorMaxPoints: 1000,
    //         fillColor: '#00FF00',
    //         strokeColor: '#0000FF',
    //         opacity: 0.5,
    //         strokeWidth: 5
    //       })
    //       this.map.geoObjects.add(myPolygon)
    //       this.map.geoObjects.add(this.point)
    //       const stateMonitor = new maps.Monitor(myPolygon.editor.state)
    //       stateMonitor.add('drawing', function (newValue) {
    //         myPolygon.options.set('strokeColor', newValue ? '#FF0000' : '#0000FF')
    //       })
    //       myPolygon.editor.events.add('statechange', function (e) {
    //         console.log(e)
    //         console.log(myPolygon.geometry.getCoordinates())
    //       })
    //       this.map.events.add('click', function (e) {
    //         _this.coordinates = e.get('coords')
    //         _this.onClickMap()
    //         _this.map.geoObjects.remove(_this.point)
    //         _this.point = new maps.GeoObject({
    //           geometry: {
    //             type: 'Point',
    //             coordinates: _this.coordinates
    //           },
    //         }, {
    //           preset: 'islands#blackStretchyIcon',
    //           draggable: true
    //         })
    //         _this.map.geoObjects.add(_this.point)
    //       })
    //       _this.point.events.add('dragend', function (e) {
    //         _this.coordinates = e.originalEvent.target.geometry._coordinates
    //         _this.onClickMap()
    //       })
    //       myPolygon.editor.startDrawing()
    //       this.polygon = myPolygon.editor
    //     })
    //     .catch(error => console.log('Failed to load Yandex Maps', error))
    // },
    //   // this.map.events.add('')
    //   this.coordinates = e.get('coords')
    //   this.initMap()
    //   console.log(e.get('coords'))
    // },
        // ================================================ START EDITION ========================================== //////
    getFareList () {
      this.$store.dispatch('getFareList').then(res => {
        console.log(res)
        this.fareList = res.fares
      })
    },
    // setProductType (e) {
    //   console.log(this.crm)
    //   if (Object.keys(localStorage).includes('crm')) {
    //     if (this.crm === 'jowi') {
    //       this.form.jowi_id = e
    //     } else {
    //       this.form.iiko_id = e
    //     }
    //   }
    //   console.log(e)
    // },
    filterOption: (input, option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0,

    // ============================================== --------- ================================================== //////
    moment
  },
  mounted () {
    // this.initMap()
    if (this.$route.params.id) {
      this.getBranchById(this.$route.params.id).then(res => {
        console.log(res)
        if (res.geozone_id) {
          this.getGeozone(res.geozone_id)
        }
        this.form.iiko_id = res.iiko_id
        this.form.jowi_id = res.jowi_id
        this.form.iiko_terminal_id = res.iiko_terminal_id
        this.form.fare_id = res.fare_id
        this.form.tg_chat_id = res.tg_chat_id
        this.form.orders_limit = res.orders_limit
        this.form.is_active = res.is_active
        this.form.radius_without_delivery_price = res.radius_without_delivery_price
        if (!res.radius_without_delivery_price) this.radiusInputVisible = false
        this.form.geozone_id = res.geozone_id
        const _data = res
        const _form = this.form
        _form.address = _data.address
        _form.destination = _data.destination
        _form.phone = _data.phone
        _form.location = _data.location
        _form.name = _data.name
        _form.work_hour_end = _data.work_hour_end
        _form.work_hour_start = _data.work_hour_start
        _form.image = _data.image.split('/')[4] ? _data.image.split('/')[4] : _data.image
        this.imageUrl = _data.image
        this.coordinates = [_data.location.lat, _data.location.long]
        this.$refs.location.location = _data.address
      })
      console.log(this.$route.params.id)
    }
  },
  created () {
    this.getFareList({ page: 1, limit: 100 })
  },
}
</script>

<style>
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
  height: 265px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
