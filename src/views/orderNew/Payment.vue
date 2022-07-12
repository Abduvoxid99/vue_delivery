<template>
  <div>
    <a-card :title="$t('fillIn')">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :xs="24" :md="8" style="padding: 0 15px">
            <a-form-model-item :label="$t('phonenumber')" prop="phone">
              <a-input v-model="form.phone" />
            </a-form-model-item>
          </a-col>
          <a-col :xs="24" :md="8" style="padding: 0 15px">
            <a-form-model-item :label="$t('orderId')" prop="order_number">
              <a-input
                v-model="form.order_number"
                @change="searchOrder"
              />
            </a-form-model-item>
          </a-col>
          <a-col :xs="24" :md="8" style="padding: 0 15px">
            <a-form-model-item :label="$t('paymentType')" prop="payment_type">
              <a-select style="width: 100%" v-model="form.payment_type">
                <a-select-option v-for="item in payment_types" :key="item" :value="item">
                  {{ item.toUpperCase() }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-row style="margin-bottom: 20px">
        <a-col :span="4"></a-col>
        <a-col :span="5"></a-col>
        <a-col :span="6"><a-button
          size="large"
          @click="submit"
          :loading="loader"
          style="width: 100%; background-color: #52c41a;color: white; ">
          {{ $t('saveorder') }}
        </a-button></a-col>
        <a-col :span="9"></a-col>
      </a-row>
      <div v-if="order">
        <h1>{{ $t('client_name') }}: {{ order.client_name ? order.client_name : 'Имя клиента нет' }} </h1>
      </div>
      <a-table :columns="columns" :data-source="get_sms_payment_list" :rowKey="recor => recor.id"
               :loading="table_loading">
        <span slot="customTitle">{{ $t('orde_id') }}</span>
        <span slot="phone_El" slot-scope="text">
          <a :href="'tel:' + text.phone">{{ $phoneFormatter(text.phone) }}</a>
          </span>
        <span slot="created_at" slot-scope="text, record">
                  <span>{{ moment(record.created_at).format('YYYY-MM-DD HH:mm') }}</span>
            </span>
        <template slot="total" slot-scope="text, row">
          <div :style="row.paid ? 'background-color: #d0ffb8' : ''">
            <div :style="{textAlign: 'center'}">
              <img v-if="row.payment_type === 'cash'" src="./icons/money.svg" style="width: 70%; height: 35px" />
              <img v-if="row.payment_type === 'click'" src="./icons/click.svg" style="width: 70%; height: 35px" />
              <img v-if="row.payment_type === 'payme'" src="./icons/payme.svg" style="width: 70%; height: 35px" />
              <img v-if="row.payment_type === 'transfer'" src="./icons/bank.svg" style="width: 70%; height: 35px" />
            </div>
            <p>{{ row.totalPrice }}</p>
            <!--            <p>{{ row.paid }}</p>-->
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { notification } from 'ant-design-vue'

export default {
  data () {
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
    const validateOrderNumber = (rule, value, callback) => {
      if (value.length === 6) {
        callback()
      } else {
        callback(new Error('Неверный номер заказа'))
      }
    }
    this.searchOrder = debounce(this.searchOrder, 1000)
    return {
      loader: false,
      table_loading: false,
      columns: [
        {
          dataIndex: 'ext_order_id',
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'ext_order_id' }
        },
        {
          title: this.$t('oprator_name'),
          dataIndex: 'operator_name'
        },
        {
          title: this.$t('order_amount'),
          dataIndex: 'order_amount'
        },
        {
          title: this.$t('peyment_type'),
          dataIndex: 'payment_type',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'total' }
        },
        {
          title: this.$t('Phone'),
          scopedSlots: { customRender: 'phone_El' }
        },

        {
          title: this.$t('create_at'),
          scopedSlots: { customRender: 'created_at' }
        }
      ],
      order: null,
      payment_types: [
        'payme',
        'click'
      ],
      form: {
        order_number: null,
        payment_type: 'click',
        phone: null
      },
      rules: {
        payment_type: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validatePhone, trigger: 'change' }],
        order_number: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validateOrderNumber, trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.table_loading = !this.table_loading
    this.getOrderList().then(res => {
      this.table_loading = !this.table_loading
    })
    console.log(this.get_sms_payment_list)
    // console.log(moment('2016-09-01,3:23:23').format('YYYY-MM-DD,h:mm'))
  },
  computed: { ...mapGetters(['get_sms_payment_list']) },
  methods: {
    moment,
    ...mapActions(['getOrderList']),
    searchOrder (e) {
      this.order = null
      if (e.target.value.length === 6) {
        this.$store.dispatch('getOneOrder', e.target.value)
          .then(res => {
            // console.log('WE have orders !!!!')
            console.log(res)
            if (res.orders && res.orders.length) {
              this.order = res.orders[0]
              console.log('=====>> ', this.order)
            }
          })
      }
    },
    claer () {
      this.order = null
      this.$refs.ruleForm.resetFields()
    },
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid && this.order) {
          this.loader = !this.loader
          this.submit_button_disabled = !this.submit_button_disabled
          const _form = { ...this.form }
          delete _form.order_number
          _form.order_id = this.order.id
          this.$store.dispatch('setSmsPamentSend', _form).then(res => {
            this.claer()
            this.table_loading = true
            this.getOrderList().finally(() => {
              this.table_loading = false
            })
          }).catch(err => {
            console.log(err)
            notification.error({
              message: 'Ошибка реквизита залива'
            })
          })
            .finally(() => {
              this.loader = !this.loader
            })
        } else {
          notification.error({
            message: 'Нет данные заказа'
          })
        }
      })
    }
  }
}
</script>
<style>
.ant-form-item-control {
  line-height: normal !important;
}

@media (max-width: 760px) {
  .ant-form-item {
    margin: 0;
  }

  .ant-form-item-label {
    padding-bottom: 4px !important;
  }
}
</style>
