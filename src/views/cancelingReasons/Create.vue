<template>
  <a-modal width="500px" v-model="visible" @cancel="hide" title="Новый клиент">
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item :label="$t('title.of.reason')" prop="text">
        <a-input v-model="form.text" />
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button key="back" @click="hide">{{ $t('cancel') }}</a-button>
      <a-button
        v-if="edit"
        type="primary"
        html-type="submit"
        :loading="loading"
        @click="updateItem"
      >
        {{ $t('update') }}
      </a-button>
      <a-button
        v-else
        type="primary"
        html-type="submit"
        :loading="loading"
        @click="createItem"
      >
        {{ $t('add') }}
      </a-button>
    </template>
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
    return {
      visible: false,
      loading: false,
      id: null,
      form: {
        text: '',
      },
      rules: {
        text: [{ required: true, message: 'Обязательное поле для заполнения', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions(['createCancelingReason', 'updateCancelingReason']),
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
          this.createCancelingReason(this.form).then(res => {
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
          this.updateCancelingReason({
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
