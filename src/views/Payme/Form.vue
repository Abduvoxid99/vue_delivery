<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules">
    <a-row>
      <a-col :span="11">
        <a-form-model-item :label="$t('key')" prop="key">
          <a-input v-model="form.key" />
        </a-form-model-item>
      </a-col>
      <a-col :span="11" :offset="1">
        <a-form-model-item :label="$t('username')" prop="login">
          <a-input v-model="form.login" />
        </a-form-model-item>
      </a-col>
      <a-col :span="11">
        <a-form-model-item :label="$t('merchant_id')" prop="merchant_id">
          <a-input v-model="form.merchant_id" />
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
        login: '',
      },
      item: null,
      rules: {
        key: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        merchant_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        login: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  methods: {
    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid === true) {
            var _data = { ...this.form }
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
</style>
