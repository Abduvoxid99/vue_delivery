<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules">
    <a-row>
      <a-col :span="11">
        <a-form-model-item :label="$t('key')" prop="key">
          <a-input v-model="form.key" />
        </a-form-model-item>
      </a-col>
      <a-col :span="11" :offset="1">
        <a-form-model-item :label="$t('merchant_id')" prop="merchant_id">
          <a-input type="number" v-model="form.merchant_id" />
        </a-form-model-item>
      </a-col>
      <a-col :span="11">
        <a-form-model-item :label="$t('merchant_user_id')" prop="merchant_user_id">
          <a-input type="number" v-model="form.merchant_user_id" />
        </a-form-model-item>
      </a-col>
      <a-col :span="11" :offset="1">
        <a-form-model-item :label="$t('service_id')" prop="service_id">
          <a-input type="number" v-model="form.service_id" />
        </a-form-model-item>
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
        key: '',
        merchant_id: null,
        merchant_user_id: null,
        service_id: null
      },
      item: null,
      rules: {
        key: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        merchant_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        merchant_user_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        service_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
      }
    }
  },
  methods: {
    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid === true) {
            var _data = { ...this.form }
            _data.merchant_id = parseInt(this.form.merchant_id)
            _data.merchant_user_id = parseInt(this.form.merchant_user_id)
            _data.service_id = parseInt(this.form.service_id)
            resolve(_data)
          } else reject(valid)
        })
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
  }
}
</script>
<style>
/*img {*/
/*  display: block;*/
/*  margin: 0 auto;*/
/*  width: 100%;*/
/*  max-width: 250px;*/
/*  height: auto;*/
/*  overflow: hidden;*/
/*}*/
</style>
