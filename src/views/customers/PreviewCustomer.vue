<template>
  <a-modal width="700px" v-model="visible" @cancel="hide" @ok="hide" :title="$t('previewClient')">
    <template slot="footer">
      <!-- <a-button key="back" @click="hide">
        Отмена
      </a-button> -->
      <a-button key="submit" type="primary" @click="hide">
        OK
      </a-button>
    </template>
    <a-descriptions bordered layout="vertical">
      <a-descriptions-item :span="2" :label="$t('fullName')">
        {{ item.name }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('phone')" :span="2">
        {{ item.phone }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('createdAt')" :span="2">
        {{ item.created_at }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('registrationSource')" :span="2">
        {{ item.registration_source }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('average_sum')" :span="4">
        {{ item.average_sum }}
      </a-descriptions-item>
      <a-descriptions-item :label="$t('orders.count') + ' ' + orderCustomer.count" :span="4">
        <a-table :columns="columns" :data-source="orderCustomer.orders" :rowKey="item => item.id" bordered :pagination="false">
          <template slot="order" slot-scope="order">
            <a @click="$refs.reviewOrder.openModal(order)">{{ order.external_order_id }}</a>
          </template>
            <template slot="payment_type" slot-scope="payment_type">
              <div :style="{textAlign: 'center'}">
                <img v-if="payment_type === 'cash'" src="../orderNew/icons/money.svg" style="width: 70%; height: 35px" />
                <img v-if="payment_type === 'click'" src="../orderNew/icons/click.svg" style="width: 70%; height: 35px" />
                <img v-if="payment_type === 'payme'" src="../orderNew/icons/payme.svg" style="width: 70%; height: 35px" />
                <img v-if="payment_type === 'transfer'" src="../orderNew/icons/bank.svg" style="width: 70%; height: 35px" />
              </div>
            </template>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
    <Preview ref="reviewOrder"/>
  </a-modal>
</template>
<script>
import Preview from '@/views/orderNew/Preview'
import { mapGetters } from 'vuex'
export default {
  components: {
    Preview
  },
  data () {
    return {
      visible: false,
      item: {
        name: '',
        phone: '',
        created_at: '',
        registration_source: '',
        average_sum: ''
      },
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
        {
          title: this.$t('paymentType'),
          dataIndex: 'payment_type',
          scopedSlots: { customRender: 'payment_type' }
        }
      ]
    }
  },
  watch: {
    orderCustomer: (cur, prew) => {
      console.log(cur, prew)
    }
  },
  methods: {
    hide () {
      this.visible = false
    },
    show () {
      this.visible = true
    }
  },
  computed: {
    ...mapGetters(['orderCustomer'])
  }
}
</script>
