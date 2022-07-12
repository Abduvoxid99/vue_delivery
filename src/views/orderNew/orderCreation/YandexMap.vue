<template>
  <yandex-map
    zoom="15"
    ref="myRef"
    :coords="coords"
    :controls="['zoomControl', 'fullscreenControl']"
    style="height:305px; padding-top: 5px"
    @click="onClick"
  >
    <div class="search" style="width: 60%">
      <LocationAutoComplete v-model="location" type="map" placeholder="Адрес или объект"/>
    </div>
<!--    <a-auto-complete-->
<!--      class="search"-->
<!--      option-label-prop="name"-->
<!--      allow-clear-->
<!--      placeholder="Адрес или объект"-->
<!--      @search="searchMap"-->
<!--    >-->
<!--      <template slot="dataSource">-->
<!--      </template>-->
<!--      <a-input>-->
<!--        <a-button-->
<!--          slot="suffix"-->
<!--          style="margin-right: -12px; border-radius: 0"-->
<!--          class="search-btn"-->
<!--        >-->
<!--          Найти-->
<!--        </a-button>-->
<!--      </a-input>-->
<!--    </a-auto-complete>-->
<!--    <a-input class="search" placeholder="Адрес или объект"></a-input>-->
    <ymap-marker
      v-for="branch in branches"
      :key="branch.id"
      marker-id="branch.id"
      :coords="branch.coordinates"
      :icon="{color: 'red', content: branch.name}"
      @click="selectBranch(branch)"
    />
    <ymap-marker
      v-for="(geometry, i) in geozones"
      :key="i"
      :marker-id="polygon + i"
      marker-type="Polygon"
      :coords="[geometry]"
      :options="{...geozoneOptions, fillColor: colors[i]}"
      @click="onClick"
    />
    <ymap-marker
      marker-id="124"
      :coords="coords"
    />
  </yandex-map>
</template>

<script>
import LocationAutoComplete from '@/views/orderNew/orderCreation/LocationAutoComplete'
import { mapActions, mapGetters } from 'vuex'
import { pointSearch, orginalSearch } from '@/utils/yandexMap'
import debounce from 'lodash/debounce'
import { AutoComplete } from 'ant-design-vue'
import colors from '../../../constants/colors'
export default {
  components: {
    'a-auto-complete': AutoComplete,
    LocationAutoComplete
  },
  props: {
    coords: {
      type: Array,
      default: () => {
        return [41.309022097090235, 69.24136827883606]
      }
    }
  },
  watch: {
    location (val) {
      // send (data) {
      //   this.$emit('input', {
      //     value: this.location,
      //     coords: this.coordinates,
      //     branch_info: data || this.branchByLocation,
      //     buildingHistory: this.buildingHistory
      //   })
      // },
      this.$emit('input', val)
      console.log(val)
    },
  },
  data () {
    this.searchMap = debounce(this.searchMap, 1000)
    return {
      polygon: '',
      location: null,
      colors: colors,
      geozoneOptions: {
        // editorDrawingCursor: 'crosshair',
        // draggable: true,
        fillColor: '#d61a1a',
        stokeColor: '#255985',
        // editorMaxPoints: 1000000,
        strokeWidth: 2,
        opacity: 0.3,
      }
    }
  },
  methods: {
    ...mapActions(['getAllBranches', 'getBranchByLocation']),
    selectBrache (event, val) {
      // this.$store.dispatch('getselectFilyalName', event.name)
      console.log('ymapmarcer =>>>>>', event)
    },
    selectBranch (value) {
      console.log('selectBranch', value)
      this.getBranchByLocation(value.coordinates).then(res => {
        pointSearch(value.coordinates.toString()).then(result => {
          console.log(result)
          this.$emit('clickMap', {
            coords: value.coordinates,
            branch_info: this.branchByLocation,
            value: result[0].name + ',' + result[0].description
          })
        })
      })
      console.log('loceshin', value)
    },
    onClick (e) {
      this.getBranchByLocation(e.get('coords')).then(res => {
        console.log('getB', res)
        pointSearch(e.get('coords').toString()).then(result => {
          console.log(e.get('coords'), result)
          this.$emit('clickMap', {
            coords: e.get('coords'),
            branch_info: this.branchByLocation,
            value: result[0].name + ',' + result[0].description
          })
        })
      })
    },
    searchMap (value) {
      orginalSearch(value).then(res => {
        console.log(res)
      })
      console.log(value)
    }
  },
  computed: {
    ...mapGetters(['allBranches', 'branchByLocation']),
    branches () {
      return this.allBranches.map(e => {
        return {
          coordinates: [e.location.lat, e.location.long],
          id: e.id,
          name: e.name
        }
      })
    },
    geozones () {
      const geozoneData = this.allBranches.map(({ geozone }) => geozone
        ? geozone.points.map(({ lat, lon }) => [lat, lon])
        : []
      )
      console.log(geozoneData)
      return geozoneData
    }
  },
  mounted () {
    this.getAllBranches()
  }
}
</script>

<style lang="less" scoped>
.search {
  position: absolute;
  top: 15px;
  width: 60%;
  left: 10px;
  border-radius: 0;
  border: none !important;
}
.search-btn {
  background-color: #ffdb4d;
  color: black;
  outline: none;
  border: none;
}
</style>
