<template>
  <a-modal
    :visible="modal.visible"
    @cancel="handleCancel => modal.visible = false"
    :footer="null"
  >
    <a-form
      layout="vertical"
      :form="form"
      @submit="onSubmit"
    >
      <a-form-item :label="$t('user')">
        <a-select
          :options="shipperBalanceOptions"
          v-decorator="rules.shipper"
        />
      </a-form-item>
      <a-form-item :label="$t('balance')">
        <a-input
          type="number"
          v-decorator="rules.balance"
          :disabled="Boolean($route.params.id)"
        />
      </a-form-item>
      <a-row type="flex" justify="end">
        <a-button type="primary" html-type="submit" :loading="loading">{{ $t('save') }}</a-button>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue'
import { mapActions } from 'vuex'

export default {
  name: 'TopUpBalance',
  props: {
    modal: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      shipperBalanceOptions: [],
      form: this.$form.createForm(this, { name: 'shipperBalance' }),
      rules: {
        shipper: [
          'shipper_id', {
            initialValue: '',
            rules: [{
              required: true, message: this.$t('required')
            }]
          },
        ],
        balance: [
          'balance', {
            initialValue: '',
            rules: [{
              required: true, message: this.$t('required')
            }]
          },
        ]
      }
    }
  },
  methods: {
    ...mapActions(['getShipperBalance', 'addBalanceToShipper']),
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.saveData(values)
        }
      })
    },
    saveData (values) {
      this.loading = true
      const payload = {
        id: values.shipper_id,
        data: {
          balance: +values.balance
        }
      }
      this.addBalanceToShipper(payload)
        .then(res => {
          this.modal.visible = false
        })
        .catch(err => message.error(err))
    }
  },
  created () {
    this.getShipperBalance({ limit: 1000 })
      .then(res => {
        this.shipperBalanceOptions = res.shipper_balances ? res.shipper_balances.map(el => ({ label: el.shipper_name, value: el.shipper_id })) : []
      })
      .catch(err => console.log(err))
  }
}
</script>
