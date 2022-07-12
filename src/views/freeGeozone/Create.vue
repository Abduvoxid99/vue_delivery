<template>
  <a-card :title="$route.params.id ? $t('free.geozone.edit') : $t('free.geozone.create')">
    <div v-if="load" id="map" ref="basicMap" class="map">
      <div class="saveGeo">
        <a-button @click="showMapData" type="default"><a-icon type="save" /> {{ $t('save_geo') }}</a-button>
        <a-button @click="reset" style="margin-left: 5px" type="default"><a-icon type="reload" /> {{ $t('reset') }}</a-button>
      </div>
    </div>
    <div style="margin-top: 10px">
      <p style="font-size: 14px; transform: translateY(10px)">{{ $t('name') }}</p>
      <a-input v-model="name" />
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 30px">
      <a-button @click="$router.go(-1)" type="default">{{ $t('cancel') }}</a-button>
      <a-button :loading="loading" @click="save" style="margin-left: 5px" type="primary">{{ $route.params.id ? $t('update') : $t('save') }}</a-button>
    </div>
  </a-card>
</template>
<!--<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=679a08be-aa49-4a79-ad31-80c65dda374a" />-->
<script>
import ymaps from 'ymaps'
export default {
  data () {
    return {
      map: null,
      load: true,
      loading: false,
      polygon: null,
      polygonData: null,
      point: null,
      points: [],
      coordinates: [41.309022097090235, 69.24136827883606],
      name: ''
    }
  },
   methods: {
     showMapData () {
       this.polygon.editor.stopDrawing()
     },
     reset () {
       this.load = !this.load
       this.points = []
       setTimeout(() => {
         this.show()
       }, 1)
       // this.load = !this.load
     },
     save () {
       console.log(this.polygon.geometry.getCoordinates())
       if (this.name !== '' && this.polygon.geometry.getCoordinates()[0].length > 0) {
         this.loading = true
         const _form = {}
         _form.name = this.name
         _form.points = this.polygon.geometry.getCoordinates()[0].map(e => {
           return {
             lat: e[0],
             lon: e[1]
           }
         })
         if (this.$route.params.id) {
           this.$store.dispatch('updateFreeGeozone', {
             id: this.$route.params.id,
             data: _form
           }).then(res => {
             this.$notification.success({
               message: 'Геозона обновлена'
             })
             this.$router.go(-1)
           }).finally(() => {
             this.loading = false
           })
         } else {
           this.$store.dispatch('postFreeGeozone', _form).then(res => {
             this.$notification.success({
               message: 'Геозона сохранена'
             })
             this.$router.go(-1)
           }).finally(() => {
             this.loading = false
           })
         }
       } else if (this.name === '') {
         this.$message.error('Название не найдено')
       } else if (this.polygon.geometry.getCoordinates()[0].length === 0) {
         this.$message.error('Геозона не найдено. Пожалуйста, нарисуйте геозону')
       }
     },
     show () {
       this.load = !this.load
       this.initMap()
       // this.load = !this.load
     },
     initMap () {
       ymaps.load().then(maps => {
         // eslint-disable-next-line no-new,no-unused-vars
         const _this = this
         this.map = new maps.Map('map', {
           center: this.coordinates,
           zoom: 12,
           controls: ['zoomControl', 'fullscreenControl']
         })
         this.point = new maps.GeoObject({
           geometry: {
             type: 'Point',
             coordinates: this.coordinates
           },
         }, {
           preset: 'islands#blackStretchyIcon',
           draggable: true
         })
         const myPolygon = new maps.Polygon(this.points, {}, {
           editorDrawingCursor: 'crosshair',
           editorMaxPoints: 1000,
           fillColor: '#00FF00',
           strokeColor: '#0000FF',
           opacity: 0.5,
           strokeWidth: 5
         })
         this.map.geoObjects.add(myPolygon)
         this.map.geoObjects.add(this.point)
         const stateMonitor = new maps.Monitor(myPolygon.editor.state)
         stateMonitor.add('drawing', function (newValue) {
           myPolygon.options.set('strokeColor', newValue ? '#FF0000' : '#0000FF')
         })
         // myPolygon.editor.events.add('statechange', function (e) {
         //   // _this.changePolygon(myPolygon.geometry.getCoordinates())
         // })
         // this.map.events.add('click', function (e) {
         //   _this.coordinates = e.get('coords')
         //   _this.onClickMap()
         //   _this.map.geoObjects.remove(_this.point)
         //   _this.point = new maps.GeoObject({
         //     geometry: {
         //       type: 'Point',
         //       coordinates: _this.coordinates
         //     },
         //   }, {
         //     preset: 'islands#blackStretchyIcon',
         //     draggable: true
         //   })
         //   _this.map.geoObjects.add(_this.point)
         // })
         // _this.point.events.add('dragend', function (e) {
         //   _this.coordinates = e.originalEvent.target.geometry._coordinates
         //   _this.onClickMap()
         // })
         myPolygon.editor.startDrawing()
         this.polygon = myPolygon
       })
         .catch(error => console.log('Failed to load Yandex Maps', error))
     },
   },
  created () {
    if (this.$route.params.id) {
      this.$store.dispatch('getFreeGeozoneById', this.$route.params.id).then(res => {
        this.points = [
          res.points.map(e => {
            return [e.lat, e.lon]
          })
        ]
        this.name = res.name
        this.initMap()
      })
    } else this.initMap()
  }
}
</script>

<style>
.map {
  height: 550px;
  position: relative;
}
.saveGeo {
  /*border: 1px solid;*/
  position: absolute;
  display: flex;
  bottom: 2%;
  right: 1%;
  z-index: 5;
}
</style>
