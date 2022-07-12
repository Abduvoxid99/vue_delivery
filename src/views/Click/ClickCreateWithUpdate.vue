<template>
  <a-modal width="800px" centered v-model="visible" @cancel="hide" :title="!editable ? $t('add') : $t('update')">
    <template slot="footer">
      <a-button key="back" @click="hide">{{ $t('cancel') }}</a-button>
      <a-button html-type="submit" v-if="!editable" type="primary" :loading="loading" @click="saveDate">{{ $t('add') }}</a-button>
      <a-button html-type="submit" v-if="editable" type="primary" :loading="loading" @click="updateData">{{ $t('update') }}</a-button>
    </template>
    <!-- FORM -->
    <FormModel v-if="!editable" ref="itemCreate" />
    <FormModel v-if="editable" ref="itemEdit" :edit="true"/>
  </a-modal>
</template>
<script>
import FormModel from './Form'
// import moment from 'moment'
import { mapActions } from 'vuex'
export default {
  components: {
    FormModel
  },
  props: {
    editable: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      visible: false
    }
  },
  methods: {
    ...mapActions(['postClick', 'getClick', 'updateClick']),
    hide () {
      this.visible = false
      this.clear()
    },
    show (data) {
      if (this.editable) {
        console.log(data)
        setTimeout(() => {
          const _data = { ...data }
          const e = this.$refs.itemEdit.form
          e.key = _data.key
          e.merchant_id = _data.merchant_id
          e.merchant_user_id = _data.merchant_user_id
          e.service_id = _data.service_id
        }, 1)
        this.visible = true
      }
      if (!this.editable) {
        this.visible = true
      }
    },
    clear () {
      if (this.editable) {
        this.$refs.itemEdit.resetForm()
      }
      if (!this.editable) {
        this.$refs.itemCreate.resetForm()
      }
    },
    saveDate () {
      this.$refs.itemCreate.validateForm().then(res => {
        console.log(res)
        this.loading = true
        this.postClick(res).then(res => {
          console.log(res)
          this.getClick()
          this.hide()
        })
          .catch(error => {
            this.$notification.error({
              message: 'Error Request or Response',
              description: error.message,
            })
          })
          .finally(() => {
            this.loading = false
          })
      }).catch(error => {
        console.log(error, 'ERRROORRRRRRRRRRRR')
      })
    },
    updateData () {
      this.$refs.itemEdit.validateForm().then(res => {
        console.log(res)
        this.loading = true
        this.updateClick(res).then(res => {
          console.log(res)
          this.getClick()
          this.hide()
        })
          .catch(error => {
            this.$notification.error({
              message: 'Error Request or Response',
              description: error.message,
            })
          })
          .finally(() => {
            this.loading = false
          })
      }).catch(error => {
        console.log(error, 'ERRROORRRRRRRRRRRR')
      })
    },
  },
}
</script>
<style>
</style>
