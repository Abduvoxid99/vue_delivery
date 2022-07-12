<template>
  <div class="wrapper" >
    <div class="spin" v-if="loading" >
      <a-spin />
    </div>
    <a-card v-else :title="$t('map')">
      <div slot="extra">
        {{ $t('orders.count') }}: {{ count }}
      </div>
      <yandex-map
        :coords="center"
        :zoom="zoom"
        style="width: 100%; max-width: 100%; height: 500px;"
        :cluster-options="clusterOptions"
        :controls="['zoomControl', 'fullscreenControl']"
      >
        <ymap-marker
          v-for="item in orders"
          :key="item.id"
          :marker-id="item.id"
          :coords="[item.to_location.lat, item.to_location.long]"
          :balloon="makebaloon(item)"
          cluster-name="1"
          @balloonopen="bindListener(item)"
          @balloonclose="unbindListener"
          @contextmenu="event"
        >
          <div slot="balloon">
            <p>{{ $t('client_name') }}: {{ item.client_name }}</p>
            <p>{{ $t('client.phone.number') }}: {{ item.client_phone_number }}</p>
            <p>{{ $t('orderId') }}: <a id="order-id-btn">{{ item.external_order_id }}</a></p>
          </div>
        </ymap-marker>
      </yandex-map>
      <preview ref="previewModal" />
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import Preview from '../orderNew/Preview.vue'

export default {
  name: 'OrdersMap',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    range: Object
  },
  components: {
    'preview': Preview
  },
  data () {
    return {
      center: [41.309022097090235, 69.24136827883606],
      zoom: 10,
      count: 0,
      loading: true,
      orders: [],
      clusterOptions: {
        '1': {
          clusterDisableClickZoom: true,
          clusterOpenBalloonOnClick: true,
          clusterBalloonLayout: [
            '<ul class=list>',
            '{% for geoObject in properties.geoObjects %}',
            '<li><a onclick="" id="order-id-btn">{{ geoObject.properties.balloonContentHeader | raw }}</a></li>',
            '{% endfor %}',
            '</ul>',
          ].join(''),
        }
      },
    }
  },
  watch: {
    range: function (newVal) {
      this.getOrders(newVal)
    }
  },
  methods: {
    ...mapActions(['getOrdersLocations', 'getDailyOrders']),
    event (e) {
      console.log('Event', e)
    },
    getOrders (dateRange) {
      console.log('Range', dateRange)
      this.loading = true
      const params = dateRange ?? {
        start_date: moment().format('YYYY-MM-DD') + ' 05:00:00',
        end_date: moment().add(1, 'd').format('YYYY-MM-DD') + ' 05:00:00',
        limit: 1000,
        page: 1
      }
      this.getOrdersLocations(params)
        .then(res => {
          this.count = res.count
          this.orders = res.orders
          this.loading = false
        })
    },
    openPreviewModal (order) {
      console.log('orderr=>>', order)
      this.$refs.previewModal.openModal(order)
    },
    makebaloon (order) {
      return {
        header: order.client_name,
        body: order.client_phone_number
      }
    },
    bindListener (order) {
      console.log('item-binded===>')
      document.getElementById('order-id-btn').addEventListener('click', () => {
        this.openPreviewModal(order)
      })
    },
    unbindListener () {
      console.log('item-unbinded===>')
      document.getElementById('order-id-btn').removeEventListener('click', this.openPreviewModal)
    },
  },
  mounted () {
    // console.log(this.range)
  },
  created () {
    this.getOrders(this.range)
  }
}
</script>

<style scoped>
  .wrapper {
    width: 100%;
  }

  .spin {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
