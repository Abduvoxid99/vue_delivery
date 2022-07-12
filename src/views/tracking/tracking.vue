<template>
  <div>
    <a-card
      :loading="this.loading"
    >
      <div slot="title"><a-select
        placeholder="Select branch"
        @change="handleBranchChange"
        style="width: 70%"
        allowClear
      >
        <a-select-option v-for="option in this.allBranches" :key="option.id" :value="option.id">
          {{ option.name }}
        </a-select-option>
      </a-select></div>
      <div slot="extra">
        <div>
        <div style="display: flex;">
          <strong>Онлайн курьеры</strong>
          <a-switch
            style="margin-left: 10px"
            v-model="form.company"
            @change="onlineCoirerCount"
          /></div>
          <br>
<span> {{ this.params.is_online ? 'Число онлайн курьеров ' : ' Число Все Курьеров ' }} :  {{ locations.length }}</span>
        </div>
      </div>
      <yandex-map
        @click="onClickMap"
        ref="mapRef"
        :key="this.locations.length"
        :zoom="zoom"
        :controls="['zoomControl', 'searchControl', 'fullscreenControl']"
        :coords="coordinates"
        @boundschange="onMapChange"
        style="height:600px; padding-top: 24px"
        v-if="!loading"
      >
        <ymap-marker
          v-for="branch in branches"
          :key="branch.id"
          marker-id="branch.id"
          :coords="branch.coordinates"
          :icon="{color: 'red', content: branch.name}"
          @click="selectBranch(branch)"
        />
        <ymap-marker
          v-for="(location, i) in locations"
          :key="location.tracking.id"
          :coords="[location.tracking.location.lat, location.tracking.location.long]"
          :marker-id="location.tracking.id + i"
          marker-type="placemark"
          @balloonopen="bindListener"
          @balloonclose="unbindListener"
          :hint-content="location.courier.first_name"
          :icon="{
            layout: 'default#imageWithContent',
            imageHref: statusImage(location),
            imageSize: [35, 35],
            imageOffset: [0, 0],
            contentOffset: [-135, -22],
            contentLayout: `<div style='width: 300px'>
                              <span style='background: ${location.courier.is_online ? '#54e346' : '#bbbfca'}; padding: 5px; border-radius: 3px; font-size: 16px; color: ${location.courier.is_online ? 'white' : 'black'}'>
                                ${location.courier.first_name + ' ' + location.courier.last_name}
                              </span>
                            </div>`
          }">
          `1                                                           `
        </ymap-marker>
    </yandex-map>
    </a-card>
    <preview ref="previewModal"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import green from '@/assets/car_green.png'
import orange from '@/assets/car_orange.png'
import yellow from '@/assets/car_yellow.png'
import preview from '@/views/orderNew/Preview'
export default {
  components: {
    'preview': preview
  },
  data () {
    return {
      form: {
        company: false,
        admin: false
      },
      params: {
        branchId: '',
        is_online: '',
        courier_id: this.$route.query.couierId ?? ''
      },
      icons: {
        defalut: green,
        yellow: yellow,
        orange: orange
      },
      realTimeInterval: null,
      data: [],
      loading: true,
      branchId: null,
      coordinates: [41.309022097090235, 69.24136827883606],
      zoom: 14,
      locations: null,
    }
  },
  mounted () {
    // this.params.courier_id = this.$route.query.couierId ?? ''
    // if (this.$route.query.couierId) {
    //   this.params.courier_id = this.this.$route.query.couierId
    //   this.getCourierLocations(this.params)
    //     .then(() => {
    //       // this.locations = this.courierLocations
    //     })
    // }
    this.getAllBranches()
      .catch(err => console.error(err))
    this.getCourierLocations(this.params)
      .then(() => {
        this.locations = this.courierLocations
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.loading = false))
    this.getAlwaysData()
  },
  computed: {
    ...mapGetters(['courierLocations', 'allBranches']),
    branches () {
      return this.allBranches.map(e => {
        return {
          coordinates: [e.location.lat, e.location.long],
          id: e.id,
          name: e.name
        }
      })
    }
  },
  created () {
    const { coords, zoom } = this.$route.query
    console.log(coords, zoom)
    if (coords && zoom) {
      this.coordinates = coords
      this.zoom = zoom
    }
  },
  methods: {
    onMapChange (e) {
      // console.log('Map changed===>', e)
      const { newCenter, newZoom } = e.originalEvent
      this.coordinates = newCenter
      this.zoom = newZoom
      this.$router.push({ name: this.$route.name, query: { coords: newCenter, zoom: newZoom } })
    },
    onlineCoirerCount (e) {
      console.log(e)
      e ? this.params.is_online = 'true' : this.params.is_online = ''
      this.getCourierLocations(this.params)
        .then(() => {
          this.locations = this.courierLocations
        })
        .catch(err => {
          console.error(err)
          this.$message.error(this.$t('error'))
        })
        .finally(() => (this.loading = false))
    },
    ...mapActions(['getCourierLocations', 'getAllBranches']),
    onClickMap (e) {
      console.log('e.get()', e.get('coords'))
    },
    bindListener (e) {
      // document.getElementById('goOrder').addEventListener('click', this.openPreviewModal)
      document.getElementsByClassName('goOrder').forEach(element => {
        element.addEventListener('click', this.openPreviewModal)
      })
    },
    unbindListener () {
      // document.getElementById('goOrder').removeEventListener('click', this.openPreviewModal)
      document.getElementsByClassName('goOrder').forEach(element => {
        element.removeEventListener('click', this.openPreviewModal)
      })
    },
    openPreviewModal (e) {
      console.log(e)
      setTimeout(() => {
        // this.$refs.previewModal.openModal(e.target.className)
        this.$refs.previewModal.openModal(e.target.classList[0])
      }, 1)
    },
    statusImage (item) {
      switch (item.orders.length) {
        case 0: return this.icons.defalut
        case 1: return this.icons.yellow
        case 2: return this.icons.orange
        case 3: return this.icons.orange
        default: return this.icons.defalut
      }
    },

    handleBranchChange (branchId) {
      console.log('branchId', branchId)
      this.params.branchId = branchId
      this.getCourierLocations(this.params)
      .then((res) => {
        console.log(res)
        this.locations = this.courierLocations
        // console.log('this.locations', this.locations)
      })
      .catch(err => {
        console.error(err)
        this.$message.error(this.$t('error'))
      })
      .finally(() => (this.loading = false))
    },
    getAlwaysData () {
      // console.log('TICK')
      this.realTimeInterval = setInterval(() => {
        this.getCourierLocations(this.params)
          .then(() => {
            this.locations = this.courierLocations
            // console.log('this.locations', this.locations)
          })
          .catch(err => {
            console.error(err)
            this.$message.error(this.$t('error'))
          })
          .finally(() => (this.loading = false))
      }, 8000)
    }
  },
  beforeDestroy () {
    clearInterval(this.realTimeInterval)
  }
}
</script>
<style>
#goOrder {
  padding: 3px;
  border: 1px solid #2293ea;
  margin: 2px 0;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  transition: all, .4s;
}
#goOrder:hover {
  background-color: #2293ea;
  color: white;
}
</style>
