<template>
        <a-drawer
      title="Чек"
      placement="right"
      :width="400"
      :closable="false"
      :visible="order.visible"
      @close="() => order.visible = false"
    >
    <a-row type="flex" justify="center">
      <a-col span="auto">
        <div v-if="order.data !== null" id="print_bill" style="width: 300px; padding: 5px; font-family: sans-serif !important">
          <div style="display: flex; justify-content: center; margin: 20px">
            <img :src="order.data.shipper_logo" width="150" height="100" alt="asd" />
          </div>
          <div style="display: flex; justify-content: center; margin: 20px">
            <span>Заказ № {{ order.data.external_order_id }}</span>
          </div>
          <div style="margin-bottom: 10px">
            <span style="margin-top: 10px; font-size: 14px; font-weight: 500"><b>Клиент:</b> {{ order.data.client_name }}</span
            ><br />
            <span style="margin-top: 10px; font-size: 14px; font-weight: 500"><b>Тел номер:</b> {{ order.data.client_phone_number }}</span
            ><br />
            <span style="margin-top: 10px; font-size: 14px; font-weight: 500"
              ><b>Адрес:</b> {{ order.data.to_address }}</span
            ><br />
            <span style="margin-top: 10px; font-size: 14px; font-weight: 500"><b>Заказ принят:</b> {{ order.data.created_at | moment('DD/MM/YYYY HH:mm') }}</span
            ><br />
            <span style="margin-top: 10px; font-size: 14px; font-weight: 500"><b>Тип оплаты:</b> {{ order.data.payment_type }}</span><br />
            <span style="margin-top: 10px; font-size: 14px; font-weight: 500"><b>Тип доставки:</b> {{ order.data.delivery_type }}</span
            ><br />
            <!-- <span style="margin-top: 10px; font-size: 12px; font-weight: 500"><b>Тип оплаты:</b> client of dummy</span><br> -->
          </div>
          <hr style="width: 100%; border-top: 1px dashed black; margin-top: 5px" />
          <div style="color: black; display: flex; width: 300px">
            <table style="width: 100%">
              <tr style="padding: 10px 0px">
                <th style="font-size: 13px; text-align: start">Наименование</th>
                <th style="font-size: 13px; text-align: start">К-во</th>
                <th style="font-size: 13px; text-align: start">Цена</th>
                <th style="font-size: 13px; text-align: start">Сумма</th>
              </tr>
              <tr v-for="item in order.data.steps[0].products" :key="item.id">
                <td style="font-size: 14px">{{ item.name }} <br>
                <small style="color: grey" v-if="item.description">({{ item.description }})</small>
                </td>
                <td style="font-size: 14px">x{{ item.quantity }}</td>
                <td style="font-size: 14px">{{ item.price }}</td>
                <td style="font-size: 14px">{{ item.total_amount }}</td>
              </tr>
            </table>
          </div>
          <hr style="width: 100%; border-top: 1px dashed black" />
          <div style="padding: 0px 10px; display: flex; justify-content: start">
            <span style="margin-top: 10px; font-size: 15px">Общее кол-во: {{ order.data.steps[0].products.length }}</span>
          </div>
          <div style="padding: 0px 10px; display: flex; justify-content: space-between">
            <span style="margin-top: 10px; font-size: 15px">Сумма продукта</span>
            <span style="margin-top: 10px; font-size: 15px">{{ order.data.order_amount }} сум</span>
          </div>
          <div style="padding: 0px 10px; display: flex; justify-content: space-between">
            <span style="margin-top: 10px; font-size: 15px">Цена доставки</span>
            <span style="margin-top: 10px; font-size: 15px">{{ order.data.delivery_price }} сум</span>
          </div>
          <div style="padding: 0px 10px; display: flex; justify-content: space-between">
            <span style="margin-top: 10px; font-size: 15px; font-weight: 500"><b>Итого к оплате</b></span>
            <span style="margin-top: 10px; font-size: 15px; font-weight: 500"><b>{{ order.data.order_amount + order.data.delivery_price }} сум</b></span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 20px">
            <span style="margin-top: 10px; font-size: 15px; font-weight: 500">
              <b>Комментарии к заказу:</b> {{ order.data.description }}
            </span>
          </div>
          <div style="display: flex; justify-content: center; margin-top: 20px">
            <h4>Спасибо за заказ :)</h4>
          </div>
        </div>
      </a-col>
    </a-row>
         <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button size="large" :loading="loading" @click="clickPrint" block type="primary">
          Распечатать
        </a-button>
      </div>
    </a-drawer>
</template>

<script>
// import printJS from 'print-js'

export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
    routeTo: {
      type: Function,
      required: false,
      default: () => null
    }
  },
  methods: {
    clickPrint () {
      // eslint-disable-next-line no-undef
      printJS({
        printable: 'print_bill',
        type: 'html',
      })
      this.routeTo()
    },
  },
  data () {
    return {
      loading: false
    }
  },
}
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  text-align: left;
  padding: 8px;
}

/* tr:nth-child(even) {
  background-color: #dddddd;
} */
</style>
