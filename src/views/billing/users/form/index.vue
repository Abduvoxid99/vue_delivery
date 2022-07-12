<template>
  <a-card :title="$route.params.id ? 'Edit' : 'Create' + ' shipper balance'">
    <a-form
      v-if="!$route.params.id || !isFetching"
      layout="vertical"
      :form="form"
      @submit="onSubmit"
    >
      <a-row style="margin: 0 -10px">
        <a-col span="12" style="padding: 10px">
          <a-form-item :label="$t('user')">
            <a-select
              :options="shipperOptions"
              v-decorator="rules.shipper"
              :disabled="Boolean($route.params.id)"
            />
          </a-form-item>
        </a-col>
        <a-col span="12" style="padding: 10px">
          <a-form-item :label="$t('tariff')">
            <a-select
              :options="tariffOptions"
              v-decorator="rules.tariff"
              :disabled="Boolean($route.params.id)"
            />
          </a-form-item>
        </a-col>
        <a-col span="12" style="padding: 10px">
          <a-form-item :label="$t('balance')">
            <a-input
              type="number"
              :disabled="Boolean($route.params.id)"
              v-decorator="rules.balance"
            />
          </a-form-item>
        </a-col>
        <a-col span="12" style="padding: 10px">
          <a-form-item :label="$t('debt')">
            <a-input
              type="number"
              v-decorator="rules.debt"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="$route.params.id" span="12" style="padding: 10px">
          <a-form-item :label="$t('future.tariff')">
            <a-select
              :options="tariffOptions"
              v-decorator="rules.futureTariff"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="end">
        <a-button type="primary" html-type="submit" :loading="loading">{{ $t('save') }}</a-button>
      </a-row>
    </a-form>
    <a-skeleton v-else active></a-skeleton>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      shipperOptions: [],
      tariffOptions: [],
      numberFields: {
        balance: '',
        debt: ''
      },
      loading: false,
      isFetching: false,
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
        tariff: [
          'tariff_id', {
            initialValue: '',
            rules: [{
              required: true, message: this.$t('required')
            }]
          },
        ],
        futureTariff: [
          'future_tariff_id', {
            initialValue: null,
            rules: [{
              required: false
            }]
          },
        ],
        balance: [
          'balance', {
            initialValue: '',
            rules: [{
              required: true, message: this.$t('required')
            }, {
              validator: (_, value) => this.validatePositiveNumber(value)
            }]
          },
        ],
        debt: [
          'debt', {
            initialValue: '',
            rules: [{
              required: true, message: this.$t('required')
            }, {
              validator: (_, value) => this.validatePositiveNumber(value)
            }]
          },
        ]
      }
    }
  },
  methods: {
    ...mapActions(['getShipperNoBalance', 'getBillingTarif', 'postShipperBalance', 'updateShipperBalanceById', 'getShipperBalanceById']),
    onNumberFieldChange (name, e) {
      console.log(name, e.target.value)
      this.numberFields[name] = e.target.value
    },
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
      const payload = {
        id: this.$route.params.id,
        data: {
          tariff_id: values.tariff_id,
          future_tariff_id: values.future_tariff_id ?? null,
          balance: +values.balance,
          debt: -values.debt
        },
        params: {
          shipper_id: values.shipper_id
        }
      }
      this.loading = true
      if (this.$route.params.id) {
        this.updateShipperBalanceById(payload)
          .then(res => {
            this.$router.push(`/billing/shippers/list`)
          })
          .catch(err => console.log(err))
          .finally(() => {
            this.loading = false
          })
      } else {
        this.postShipperBalance(payload)
          .then(res => {
            this.$router.push(`/billing/shippers/list`)
          })
          .catch(err => console.log(err))
          .finally(() => {
            this.loading = false
          })
      }
    },
    validatePositiveNumber (val) {
      console.log('validating....', val)
      if (+val < 0) {
        // returns an error if the number < 0
        return Promise.reject(new Error('Пожалуйста, введите положительное число'))
      } else {
        return Promise.resolve()
      }
    }
  },
  created () {
    if (this.$route.params.id) {
      this.isFetching = true
      this.getShipperBalanceById(this.$route.params.id)
        .then(res => {
          this.rules.shipper[1].initialValue = res.shipper_id
          this.rules.tariff[1].initialValue = res.tariff_id
          this.rules.futureTariff[1].initialValue = res.future_tariff_id
          this.rules.balance[1].initialValue = res.balance
          this.rules.debt[1].initialValue = -res.debt

          this.shipperOptions = [{ label: res.shipper_name, value: res.shipper_id }]
          this.tariffOptions = [{ label: res.tariff_name, value: res.tariff_id }]
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.isFetching = false
        })
    } else {
      this.getShipperNoBalance({ limit: 1000 })
        .then(res => {
          this.shipperOptions = res.shippers ? res.shippers.map(el => ({ label: el.name, value: el.id })) : []
        })
        .catch(err => {
          console.log(err)
        })

      this.getBillingTarif({ limit: 1000 })
        .then(res => {
          this.tariffOptions = res.tariffs ? res.tariffs.map(el => ({ label: el.name, value: el.id })) : []
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>

</style>
