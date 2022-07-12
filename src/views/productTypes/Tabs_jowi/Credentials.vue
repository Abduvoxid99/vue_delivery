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
          <a-form-model-item ref="name" label="Jowi ID Диспетчера" prop="name">
          <a-input v-model="form.dispatcher_id"></a-input>
          </a-form-model-item>
           <a-row type="flex">
             <a-col span="auto">
                <a-button :loading="waitingResponse" v-if="isNew" @click="updateJowiCredentials" type="primary">{{ $t('save') }}</a-button>
                <a-button :loading="waitingResponse" v-else @click="postJowiCredentials" type="primary">{{ $t('add') }}</a-button>
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
      form: { dispatcher_id: '' },
      rules: {},
      waitingResponse: false,
      isNew: false,
    }
  },
  methods: {
    postJowiCredentials (post) {
      this.waitingResponse = true
      this.$store.dispatch('postJowiCredentials', this.form).then(res => {
        this.$alertMessage('success', 'Created', 'Created data', this)
      }).finally(() => {
        this.waitingResponse = false
      })
    },
    updateJowiCredentials () {
      this.waitingResponse = true
      this.$store.dispatch('updateJowiCredentials', this.form).then(res => {
        console.log(res)
        this.$alertMessage('success', 'Updated', 'Updated data', this)
      }).finally(() => {
        this.waitingResponse = false
      })
    },
    getJowiCredentials () {
      this.waitingResponse = true
      this.$store.dispatch('getJowiCredentials', this.form).then(res => {
        console.log(res)
        this.form = res
        if (res.dispatcher_id.length > 0) {
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
    this.getJowiCredentials()
  }
}
</script>

<style scoped>

</style>
