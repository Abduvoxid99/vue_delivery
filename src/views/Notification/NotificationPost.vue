<template>
  <div>
    <a-card title="Уведомление" style="width: 100%">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-form-model-item :label="$t('Тип приемника')" prop="receiver_type">
              <a-select allowClear v-model="form.receiver_type" style="margin: 10px 5px; width: 150px" placeholder="тип приемника">
                <a-select-option v-for="elm in receiverTypeList" :key="elm.key" :value="elm.key" :disabled="elm.disable">
                  {{ elm.text }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item :label="$t('name')" prop="title">
              <a-input v-model="form.title" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item :label="$t('description')" prop="content">
              <a-input type="textarea" v-model="form.content" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-button type="primary" :loading="loading" @click="sendNotification">{{ $t('add') }}</a-button>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data () {
    return {
      loading: false,
      form: {
        title: '',
        content: '',
        receiver_type: undefined
      },
      rules: {
        title: [{ required: true, message: this.$t('required'), trigger: 'blur' }],
        content: [{ required: true, message: this.$t('required'), trigger: 'blur' }],
        receiver_type: [{ required: true, message: this.$t('required'), trigger: 'blur' }],
      },
      receiverTypeList: [
        {
          text: 'Курьеры',
          key: 'courier',
          disable: false
        },
        {
          text: 'Клиенты',
          key: 'client',
          disable: false
        },
        {
          text: 'Кассиры',
          key: 'branch_user',
          disable: true
        },
      ],
    }
  },
  methods: {
    sendNotification () {
      this.loading = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          request({
            method: 'POST',
            url: `${process.env.VUE_APP_API_BASE_URL}/notification`,
            data: {
              receiver_type: this.form.receiver_type,
              title: this.form.title,
              content: this.form.content
            }
          })
            .then((res) => {
              this.$router.go(-1)
            })
            .catch(() => {
              this.$message.error(this.$t('Ошибка сети или сервер не работает'))
            })
            .finally(() => {
              this.form.title = ''
              this.form.content = ''
              this.form.receiver_type = undefined
              this.loading = false
            })
        } else {
          this.$message.error(this.$t('error'))
          this.loading = false
          return false
        }
      })
    },
  },
}
</script>
