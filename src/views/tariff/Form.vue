<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" :colon="false">
    <a-row>
      <a-col :span="11">
        <a-form-model-item :label="$t('type')" prop="type">
          <a-select v-model="form.type" style="width: 100%">
            <a-select-option value="fixed">
              {{ $t('fixed') }}
            </a-select-option>
            <a-select-option value="not-fixed">
              {{ $t('not-fixed') }}
            </a-select-option>
            <a-select-option value="alternative">
              {{ $t('alternative') }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="11" :offset="1">
        <a-form-model-item :label="$t('base_price')" prop="base_price">
          <a-input type="number" v-model="form.base_price" />
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row :gutter="[10, 10]" align="middle">
      <a-col v-if="form.type === 'not-fixed'" :span="11">
        <a-form-model-item :label="$t('base_distance')" prop="base_distance">
          <a-input type="number" v-model="form.base_distance" />
        </a-form-model-item>
      </a-col>
      <a-col v-if="form.type === 'not-fixed'" :span="11" :offset="1">
        <a-form-model-item :label="$t('price_per_km')" prop="price_per_km">
          <a-input type="number" v-model="form.price_per_km" />
        </a-form-model-item>
      </a-col>
      <template v-if="form.type === 'alternative'" >
          <template v-for="(fare_value, iss) in form.fare_values">
            <a-col :key="iss" v-if="form.type === 'alternative'" :span="7">
              <a-form-model-item :label="$t('from_price')">
                <a-input type="number" v-model="fare_value.from_price" />
              </a-form-model-item>
            </a-col>
            <a-col :key="iss + 44" :span="7">
              <a-form-model-item :label="$t('to_price')">
                <a-input type="number" v-model="fare_value.to_price" />
              </a-form-model-item>
            </a-col>
            <a-col :key="iss + 443" :span="7">
              <a-form-model-item :label="$t('delivery_price')">
                <a-input type="number" v-model="fare_value.delivery_price" />
              </a-form-model-item>
            </a-col>
            <a-col :key="iss + 443" :span="3">
                <a-form-model-item :label="' '">
                <a-button
                  type="danger"
                  @click="deleteFareValue(fare_value, iss)"
                  icon="delete">
                </a-button>
                </a-form-model-item>
            </a-col>
          </template>
      </template>
      <a-col v-if="form.type === 'alternative'" :span="24">
        <a-button block @click="addNewRow">{{ $t('add') }}</a-button>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
export default {
  props: {
    edit: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data () {
    return {
      form: {
        base_distance: null,
        base_price: null,
        price_per_km: null,
        type: 'fixed',
        fare_values: [
          {
            delivery_price: 0,
            from_price: 0,
            to_price: 0
          }
        ],
      },
      item: null,
      rules: {
        type: [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }],
        base_price: [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }],
      }
    }
  },
  methods: {
    deleteFareValue (item, idx) {
      console.log(item)
      this.form.fare_values = this.form.fare_values.filter(el => el.idx !== item.idx)
    },
    addNewRow () {
      this.form.fare_values = [ ...this.form.fare_values,
        {
          delivery_price: 0,
          from_price: 0,
          to_price: 0,
          idx: Math.random() + 3
        }
      ]
    },
    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.form.price_per_km = this.form.type ? parseInt(this.form.price_per_km) : undefined
            this.form.base_distance = this.form.type ? parseInt(this.form.base_distance) : undefined
            this.form.base_price = parseInt(this.form.base_price)
            resolve({
              id: this.edit ? this.item.id : undefined,
              data: this.form
            })
          } else reject(valid)
        })
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style>
</style>
