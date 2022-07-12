<template>
  <a-modal width="700px" v-model="visible" @cancel="hide" :title="$t('geozone.create')">
    <div id="my-map-branch" style="width: 100%; height: 500px"></div>
    <!-- <yandex-map
      ref="ymap"
      id="my-map"
      :coords="center"
      :zoom="zoom"
      style="width: 100%; max-width: 100%; height: 500px;"
      :controls="controls"
    >
      <ymap-marker
        ref="mkad"
        marker-id="1"
        :coords="geometry"
        marker-type="Polygon"
      >

      </ymap-marker>
    </yandex-map> -->
    <!-- <button @click="startDrawing">start drawing</button> -->
    <div slot="footer">
      <a-button @click="hide">
        {{ $t('cancel') }}
      </a-button>
      <a-button ref="drawingRef" :type="btnType" ghost @click="startDrawing">
        {{ $t(btnType === 'primary' ? 'to.draw.geozone' : 'stop.drawing') }}
      </a-button>
      <a-button type="primary" @click="onSave" :loading="loading">
        {{ $t('save') }}
      </a-button>
    </div>
  </a-modal>
</template>

<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;" type="text/javascript"></script>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'GeozoneDraver',
  props: {
    markerCoords: {
      type: Array,
      required: true
    },
    geozoneData: {
      type: Object,
      required: false
    },
  },
  data () {
    return {
      visible: false,
      btnType: 'primary',
      zoom: 14,
      loading: false,
      polygon: null,
      controls: ['zoomControl', 'fullscreenControl'],
      geometry: [[]]
    }
  },
  watch: {
    geozoneData: {
      immediate: true,
      handler (val) {
        console.log(val)
      }
    },
    visible() {
      if(this.visible) {
        setTimeout(() => {
        console.log("REF ==> ", this.$refs.drawingRef[0])
        this.$refs.drawingRef.click()
        }, [4000])
      }
    },

  },
  methods: {
    ...mapActions(['postGeozone', 'getGeozoneById', 'updateGeozone']),
    hide () {
      this.visible = false
      this.setCoords([[]])
    },
    show () {
      this.visible = true
    },
    setCoords (geometry) {
      if(this.polygon) {
        this.polygon.geometry.setCoordinates(geometry)
      }
    },
    changeBtnType () {
      this.btnType = this.btnType === 'primary' ? 'danger' : 'primary'
    },
    onSave () {
      let geometry = [[]]
      if(this.polygon) {
        geometry = this.polygon.geometry.getCoordinates()
        console.log(geometry)
        // this.$emit('save', geometry)
        // this.hide()
      }
      if(!geometry[0].length) {
        this.$notification.error({
          message: 'Перед сохранением нарисуйте геозону'
        })
        return
      }

      const points = geometry[0].map(el => ({lat: el[0], lon: el[1]}))
      this.loading = true
      if(this.id) {
        this.updateGeozone({
          id: this.id,
          data: {
            name: '',
            points
          }
        })
          .then(res => {
              this.$emit('save', {
                id: this.geozoneData.id,
                geometry: geometry
              })
              this.hide()
            }).catch(err => this.$notification.error({message: this.$t('error')}))
            .finally(() => { this.loading = false })
      } else {
        this.postGeozone({
          name: "",
          points
        })
          .then(res => {
            this.$emit('save', {
              id: res,
              geometry: geometry
            })
            this.hide()
          }).catch(err => this.$notification.error({message: this.$t('error')}))
          .finally(() => { this.loading = false })
      }
    },
    startDrawing () {
      if(this.polygon && this.btnType === 'primary') {
        this.polygon.editor.startDrawing()
        this.btnType = 'danger'
        return
      }
      if(this.btnType === 'primary') {
        let polygonGeometries = []
        const myMap = new ymaps.Map('my-map-branch', {
          center: this.markerCoords,
          zoom: this.zoom,
          controls: this.controls
        }, {
          searchControlProvider: 'yandex#search'
        })

        const myMark = new ymaps.Placemark(this.markerCoords)

        // const { points } = await this.getGeozoneById(this.id)
        if(this.geozoneData) {
          polygonGeometries = [this.geozoneData.points.map(({lat, lon}) => [lat, lon])]
        }
        const myPolygon = new ymaps.Polygon(polygonGeometries, {}, {
          // The cursor in the mode for adding new vertices.
          editorDrawingCursor: 'crosshair',
          draggable: true,
        })
        // Adding the polygon to the map.
        myMap.geoObjects.add(myPolygon)
        myMap.geoObjects.add(myMark)
        // In the mode for adding new vertices, we change the stroke color of the polygon.
        const stateMonitor = new ymaps.Monitor(myPolygon.editor.state)
        stateMonitor.add('drawing', function (newValue) {
            myPolygon.options.set('strokeColor', newValue ? '#FF0000' : '#0000FF')
        })

        // Turning on the edit mode with the possibility of adding new vertices.
        myPolygon.editor.startDrawing()
        this.polygon = myPolygon
        this.changeBtnType()
      } else {
        this.$emit("deleteGeozone")
        console.log(this)
        this.polygon.editor.stopDrawing()
        this.btnType = 'primary'
      }
    }
  },
  mounted () {
    // const refernce = { ...this.$refs }
    console.log('mounted')
  }
}
</script>
