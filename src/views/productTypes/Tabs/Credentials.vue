<template>
  <div>
    <a-form-model
          :colon="false"
          ref="ruleForm"
          :model="form"
          :rules="rules"
        >
      <a-row type="flex">
        <a-col offset="2" span="16">
          <a-form-model-item ref="name" label="" prop="name">
          <a-input v-model="form.api_login" :placeholder="$t('API login')"></a-input>
          <a-input v-model="form.dispatcher_id" :placeholder="$t('Dispatcher ID')"></a-input>
          </a-form-model-item>
           <a-row type="flex">
             <a-col span="auto">
                <a-button :loading="waitingResponse" v-if="isNew" @click="updateCredentials" type="primary">{{ $t('save') }}</a-button>
                <a-button :loading="waitingResponse" v-else @click="postCredentials" type="primary">{{ $t('add') }}</a-button>
             </a-col>
           </a-row>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: { api_login: '', dispatcher_id: '' },
      rules: {},
      waitingResponse: false,
      isNew: false,
    }
  },
  methods: {
    postCredentials (post) {
      this.waitingResponse = true
      this.$store.dispatch('postIikoCredentials', this.form).then(res => {
        this.$alertMessage('success', 'Created', 'Created data', this)
      }).finally(() => {
        this.waitingResponse = false
      })
    },
    updateCredentials () {
      this.waitingResponse = true
      this.$store.dispatch('updateIikoCredentials', this.form).then(res => {
        console.log(res)
        this.$alertMessage('success', 'Updated', 'Updated data', this)
      }).finally(() => {
        this.waitingResponse = false
      })
    },
    getIikoCredentials (post) {
      this.waitingResponse = true
      this.$store.dispatch('getIikoCredentials', this.form).then(res => {
        console.log(res)
        this.form = res
        if (res.api_login.length > 0) {
          this.isNew = true
        } else {
            this.isNew = false
        }
      }).finally(() => {
        this.waitingResponse = false
      })
    }
  },
  created () {
    this.getIikoCredentials()
  }
}
</script>

<style scoped>

</style>
