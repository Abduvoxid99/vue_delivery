<template>
    <a-form-model style="width: 50%" ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item :label="$t('name')" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item :label="$t('username')" prop="username">
        <a-input v-model="form.username" />
      </a-form-model-item>
      <a-form-model-item :label="$t('phone')" prop="phone">
        <a-input v-model="form.phone" />
      </a-form-model-item>
      <a-button html-type="submit" type="primary" :loading="loading" @click="updateDate">{{ $t('update') }}</a-button>
    </a-form-model>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {},
  data () {
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
    return {
      loading: false,
      form: {
        name: '',
        phone: '',
        username: ''
      },
      rules: {
        name: [{ required: true, message: 'Name required', trigger: 'blur' }],
        username: [{ required: true, message: 'Username required', trigger: 'blur' }],
        phone: [{ required: true, message: 'Phone required', trigger: 'change' }, { validator: validatePhone, trigger: 'change' }]
      }
    }
  },
  methods: {
    ...mapActions(['changeUser']),
    updateDate () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.changeUser({
            id: JSON.parse(localStorage.getItem('user_id')),
            data: {
              name: this.form.name,
              phone: this.form.phone,
              user_role_id: JSON.parse(localStorage.getItem('user_role_id')),
              username: this.form.username
            }
          }).then(res => {
            console.log(res)
            this.$message.success(this.$t('successfullyUpdated'))
            location.reload()
          }).catch(err => {
            this.$message.error(err.message)
            console.log(err.response)
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
