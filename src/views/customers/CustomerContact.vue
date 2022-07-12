<template>
  <a-card :title="`Новый звонок от: +998 ${ $route.query.caller.replace(/[^0-9]/g, '') }`">
    <a-button v-if="data" type="primary" slot="extra" @click="$router.push({ name: 'Order', query: { phone: $route.query.caller.replace(/[^0-9]/g, '') } })">Оформить заказ</a-button>
    <a-row v-if="data">
      <a-col style="padding-right: 10px" :span="8">
        <a-card :title="$t('previewClient')">
          <div style="text-align: center">
            <a-avatar style="margin-bottom: 30px" :size="180" icon="user" />
          </div>
          <p style="display: flex; justify-content: space-between"><strong>{{ $t('name') }}:</strong>  {{ data.name }}</p>
          <p style="display: flex; justify-content: space-between"><strong>{{ $t('phone') }}:</strong>  {{ data.phone }}</p>
          <p style="display: flex; justify-content: space-between"><strong>{{ $t('status') }}:</strong>
            <a-tag v-if="data.is_blocked" color="red"> {{ $t('inactive') }} </a-tag>
            <a-tag v-else color="green"> {{ $t('active') }} </a-tag>
          </p>
          <p style="display: flex; justify-content: space-between"><strong>{{ $t('createdAt') }}:</strong>  {{ data.created_at }}</p>
        </a-card>
      </a-col>
      <a-col style="padding-left: 10px" :span="16">
        <a-card :title="$t('orderClients')">
          <a-table
            bordered
            :columns="columns"
            :data-source="orders"
            :rowKey="item => item.id"
            :pagination="false"
          >
            <template slot="status" slot-scope="item">
              <a-tag :color="getStatusColor(item)">
                {{ getStatusName(item) }}
              </a-tag>
            </template>
            <template slot="order" slot-scope="item">
              <a-tag style="cursor: pointer" @click="openPreviewModal(item.id)"> {{ item.external_order_id }} </a-tag>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <div v-else style="text-align: center">
      <h2 style="font-size: 36px">Новый клиент:  <strong>{{ $route.query.caller.replace(/[^0-9]/g, '') }}</strong></h2>
      <img :src="clientImage">
      <br>
      <a-button type="primary" size="large" @click="$router.push({ name: 'Order', query: { phone: $route.query.caller.replace(/[^0-9]/g, '') } })">Оформить заказ</a-button>
    </div>
    <preview ref="previewModal"/>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import client from '@/assets/client.svg'
import preview from '@/views/orderNew/Preview'
export default {
  components: {
    preview
  },
  data () {
    return {
      clientImage: client,
      data: null,
      orders: [],
      columns: [
        {
          title: this.$t('orderId'),
          scopedSlots: { customRender: 'order' }
        },
        {
          title: this.$t('address'),
          dataIndex: 'to_address'
        },
        {
          title: this.$t('totalPrice'),
          dataIndex: 'order_amount'
        },
        // {
        //   title: this.$t('paymentType'),
        //   dataIndex: 'payment_type'
        // },
        {
          title: this.$t('status'),
          dataIndex: 'status_id',
          scopedSlots: { customRender: 'status' }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['orderCustomer'])
  },
  methods: {
    getStatusName (statusId) {
      switch (statusId) {
        case '986a0d09-7b4d-4ca9-8567-aa1c6d770505':
          return this.$t('new')
        case '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3':
          return this.$t('branchesAccepted')
        case 'c4227d1b-c317-46f8-b1e3-a48c2496206f':
          return this.$t('branchesCancelled')
        case 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd':
          return this.$t('branchesReady')
        case '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0':
          return this.$t('courierAccepted')
        case '6ba783a3-1c2e-479c-9626-25526b3d9d36':
          return this.$t('courierCancelled')
        case '84be5a2f-3a92-4469-8283-220ca34a0de4':
          return this.$t('courierPickedUp')
        case '79413606-a56f-45ed-97c3-f3f18e645972':
          return this.$t('delivered')
        case 'ccb62ffb-f0e1-472e-bf32-d130bea90617':
          return this.$t('operatorAccepted')
        case 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1':
          return this.$t('operatorCancelled')
        case 'e665273d-5415-4243-a329-aee410e39465':
          return this.$t('finished')
        case 'd39cb255-6cf5-4602-896d-9c559d40cbbe':
          return this.$t('serverCancelled')
        default:
          break
      }
    },
    getStatusColor (status) {
      switch (status) {
        case '986a0d09-7b4d-4ca9-8567-aa1c6d770505':
          return '#2db7f5'
        case '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0':
          return '#108ee9'
        case '84be5a2f-3a92-4469-8283-220ca34a0de4':
          return '#13c2c2'
        case '79413606-a56f-45ed-97c3-f3f18e645972':
          return '#722ed1'
        case '6ba783a3-1c2e-479c-9626-25526b3d9d36':
          return '#bf3939'
        case 'e665273d-5415-4243-a329-aee410e39465':
          return '#87d068'
        case '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3':
          return '#001529'
        case 'c4227d1b-c317-46f8-b1e3-a48c2496206f':
          return '#ed2d2d'
        case 'd39cb255-6cf5-4602-896d-9c559d40cbbe':
          return '#ed2d2d'
        case 'ccb62ffb-f0e1-472e-bf32-d130bea90617':
          return '#42f5d7'
        case 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1':
          return '#e36464'
        case 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd':
          return '#51EC7C'
        default:
          break
      }
    },
    openPreviewModal (e) {
      setTimeout(() => {
        this.$refs.previewModal.openModal(e)
      }, 1)
    },
  },
  mounted () {
    // const id = this.$route.query.cid.split('@')[0]
    console.log('QUery ==>', this.$route.query)
    this.$store.dispatch('getCustomerByPhone', '998' + this.$route.query.caller.replace(/[^0-9]/g, ''))
      .then(res => {
        console.log(res)
        this.data = res
        if (res) {
          this.$store.dispatch('getCustomerById', res.id)
            .then(res => {
              console.log(res)
              this.orders = res.orders
            })
        }
      })
  }
}
</script>

<style>

</style>
