<template>
  <div style="display: flex; width: 100%; height: 32px">
    <a-auto-complete
      v-model="location"
      style="width: 100%"
      option-label-prop="name"
      :placeholder="placeholder? placeholder : $t('address')"
      @search="searchMap"
      @select="selectMap"
    >
      <template slot="dataSource">

        <a-select-opt-group v-if="customerMapAddresses.length > 0 && type !== 'map'">
          <span slot="label"
                style="padding: 5px; border-bottom: 1px solid #c7c9ca; color: #87bce7; font-size:14px;">
            <strong>
              {{ $t('Адреса клиента') }}
            </strong>
          </span>
          <a-select-option v-for="map in customerMapAddresses"
                           :key="'history' + ':' + map.location.lat + ':' + map.location.long + ':' + map.apartment + ':' + map.building + ':' + map.floor"
                           :value="map.address"
                           :name="map.address"
                           @click="optionClickHandler(map)"
          >
            <a-row>
              <a-col :span="1">
                <a-icon :style="`font-size: 22px; ${ map.name ? 'color: #1990FF' : ''}`" type="environment" />
              </a-col>
              <a-col :span="19" :offset="1">
                <p style="font-size: 14px; margin: 0"> <strong style="color: #1990FF" >{{ map.name || '' }}</strong> <span v-if="map.name" >--</span>  {{ map.address }}</p>
                <!--                                    <p style="font-size: 12px; margin: 0"><strong>{{ map.address_name }}</strong></p>-->
              </a-col>
            </a-row>
          </a-select-option>
        </a-select-opt-group>

        <!-- ---------------------------- -->
        <a-select-opt-group v-if="customerMapHistory.length > 0 && type !== 'map'">
          <span slot="label"
                style="padding: 5px; border-bottom: 1px solid #c7c9ca; color: #87bce7; font-size:14px;">
            <strong>
              {{ $t('history_location') }}
            </strong>
          </span>
          <a-select-option v-for="map in customerMapHistory"
                           :key="'history' + ':' + map.location.lat + ':' + map.location.long + ':' + map.apartment + ':' + map.building + ':' + map.floor"
                           :value="map.address"
                           :name="map.address"
                           @click="optionClickHandler(map)"
          >
            <a-row>
              <a-col :span="1">
                <a-icon :style="`font-size: 22px; ${ map.name ? 'color: #1990FF' : ''}`" type="environment" />
              </a-col>
              <a-col :span="19" :offset="1">
                <p style="font-size: 14px; margin: 0"> <strong style="color: #1990FF" >{{ map.name || '' }}</strong> <span v-if="map.name" >--</span>  {{ map.address }}</p>
                <!--                                    <p style="font-size: 12px; margin: 0"><strong>{{ map.address_name }}</strong></p>-->
              </a-col>
            </a-row>
          </a-select-option>
        </a-select-opt-group>
        <a-select-opt-group v-if="mapPoint.length > 0 || mapPlace.length > 0">
          <span slot="label"
                style="padding: 5px; border-bottom: 1px solid #c7c9ca; color: #87bce7; font-size:14px;">
            <strong>
              {{ $t('new_location') }}
            </strong>
          </span>
          <a-select-option
            v-for="map in mapPlace"
            :key="'mapPlace' + ':' + map.name + ':' + map.latlong.lat + ':' + map.latlong.lon"
            :value="map.name + ',' + map.description"
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
            :value="map.name + ',' + map.description"
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
    <a-tooltip v-if="load.place && load.point || location">
      <template slot="title">
        <span> {{ load.place && load.point ? 'Загрузка...' : 'Очистить адрес' }}</span>
      </template>
        <a-button
          type="default"
          :icon="load.place && load.point ? 'loading' : 'close-circle'"
          class="copyBtn"
          @click="load.place && load.point ? loading() : clear()"
        />
    </a-tooltip>
  </div>
</template>

<script>
import { AutoComplete } from 'ant-design-vue'
import { mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import { placeSearch, pointSearch } from '@/utils/yandexMap'
export default {
  // eslint-disable-next-line
  props: ['value', 'type', 'placeholder'],
  components: {
    'a-auto-complete': AutoComplete
  },
  data () {
    this.searchMap = debounce(this.searchMap, 1000)
    return {
      location: null,
      buildingHistory: {},
      mapPlace: [],
      mapPoint: [],
      coordinates: [41.309022097090235, 69.24136827883606],
      load: {
        point: false,
        place: false
      }
    }
  },
  computed: {
    ...mapGetters(['branchByLocation', 'customerMapHistory', 'customerMapAddresses']),
  },
  watch: {
    location (val) {
      console.log('Loaction', val)
    }
  },
  methods: {
    ...mapActions(['getBranchByLocation', 'getCustomerAddressHistory']),
    optionClickHandler (map) {
      console.log('DATA ======> ', map)
      this.$emit('addressChangeHandler', { apartment: map.apartment, building: map.building, floor: map.floor })
    },
    searchMap (value) {
      if (value) {
        this.load.place = true
        this.load.point = true
        placeSearch(value).then(result => {
          this.mapPlace = result
        }).catch(res => { console.log(res) }).finally(() => {
          this.load.place = false
        })
        pointSearch(value).then(result => {
          this.mapPoint = result
        }).catch(res => { console.log(res) }).finally(() => {
          this.load.point = false
        })
      }
      console.log(value)
    },
    selectMap (value, option) {
      if (option.key.includes('history')) {
        const a = option.key.split(':')
        this.coordinates = [a[1], a[2]]
        this.buildingHistory = {
          apartment: a[3],
          building: a[4],
          floor: a[5]
        }
      }
      if (option.key.includes('mapPoint')) {
        const b = option.key.split(':')
        this.coordinates = [b[2], b[3]]
      }
      if (option.key.includes('mapPlace')) {
        const c = option.key.split(':')
        this.coordinates = [c[2], c[3]]
      }
      this.getBranchByLocation(this.coordinates).then(res => {
        this.send()
      })
      this.$emit('change', { value, option })
    },
    loading () {
      console.log('Loading...')
    },
    clear () {
      console.log(this.value)
      this.location = null
      this.mapPoint = []
      this.mapPlace = []
      this.coordinates = [41.309022097090235, 69.24136827883606]
      this.send()
    },
    send (data) {
      this.$emit('input', {
        value: this.location,
        coords: this.coordinates,
        branch_info: data || this.branchByLocation,
        buildingHistory: this.buildingHistory
      })
    },
    getHistoryPhone (phone) {
      this.getCustomerAddressHistory(phone)
    }
  },
  mounted () {
    this.$store.commit('GET_CUSTOMER_ADDRESS_HISTORY', [])
    this.$store.commit('GET_CUSTOMER_CUSTOM_ADDRESS_HISTORY', [])
    this.coordinates = [41.309022097090235, 69.24136827883606]
  }
}
</script>

<style lang="less" scoped>
.copyBtn {
  height: 100%;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  padding-right: 6px;
  padding-left: 6px;
  transform: translateX(-2px);
  z-index: 7;
}
</style>
