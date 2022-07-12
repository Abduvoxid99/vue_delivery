<template>
  <a-modal width="500px" v-model="visible" @cancel="hide" title="Новый клиент">
    <template slot="footer">
      <a-button key="back" @click="hide">{{ $t('cancel') }}</a-button>
      <a-button v-if="!edit" html-type="submit" type="primary" :loading="loading" @click="createItem">{{ $t('add') }}</a-button>
      <a-button v-if="edit" html-type="submit" type="primary" :loading="loading" @click="updateItem">{{ $t('update') }}</a-button>
    </template>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item :label="$t('name')" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item :label="$t('phone')" prop="phone_number">
        <a-input v-model="form.phone_number" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    edit: {
      type: Boolean,
      default: () => { return false }
    }
  },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
    return {
      visible: false,
      loading: false,
      id: null,
      form: {
        name: '',
        phone_number: ''
      },
      rules: {
        name: [{ required: true, message: 'Обязательное поле для заполнения', trigger: 'blur' }],
        phone_number: [
          { required: true, message: 'Обязательное поле для заполнения', trigger: 'change' },
          { validator: validatePhone, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['createAggregator', 'updateAggregator']),
    hide () {
      this.visible = false
      this.resetForm()
    },
    show () {
      this.visible = true
    },
    createItem () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.createAggregator(this.form).then(res => {
            this.hide()
            this.$emit('finished', 'created')
          })
          .catch(err => {
            console.log()
            this.$notification.error({
              message: err.response.data.Error.Code,
              description: err.response.data.Error.Message
            })
          })
          .finally(() => {
            this.loading = false
          })
        }
      })
    },
    updateItem () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.updateAggregator({
            id: this.id,
            ...this.form
          }).then(res => {
            this.hide()
            this.$emit('finished', 'updated')
          })
          .catch(err => {
            console.log()
            this.$notification.error({
              message: err.response.data.Error.Code,
              description: err.response.data.Error.Message
            })
          })
          .finally(() => {
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
