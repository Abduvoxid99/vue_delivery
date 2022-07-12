<template>
  <a-modal width="800px" centered v-model="visible" @cancel="hide" :title="!editable ? $t('add_user') : $t('edit_user')">
    <template slot="footer">
      <a-button key="back" @click="hide">{{ $t('cancel') }}</a-button>
      <a-button html-type="submit" v-if="!editable" type="primary" :loading="loading" @click="saveDate">{{ $t('add') }}</a-button>
      <a-button html-type="submit" v-if="editable" type="primary" :loading="loading" @click="updateData">{{ $t('update') }}</a-button>
    </template>
    <!-- FORM -->
    <FormModel v-if="!editable" ref="shipperCreate" />
    <FormModel v-if="editable" ref="shipperEdit" :edit="true"/>
  </a-modal>
</template>
<script>
import FormModel from './Form'
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
    params: {
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
    ...mapActions(['postBranchUsers', 'getBranchUsers', 'updateBranchUsers', 'getCategoryBySlug']),
    hide () {
      this.visible = false
      this.clear()
    },
    show (data) {
      if (this.editable) {
        console.log(data)
        setTimeout(() => {
          // let _data = { ...data }
          const e = this.$refs.shipperEdit.form
          this.$refs.shipperEdit.item = data
          e.name = data.name
          e.phone = data.phone
          e.user_role_id = data.user_role_id
        }, 1)
        this.visible = true
      }
      if (!this.editable) {
        this.visible = true
      }
    },
    clear () {
      if (this.editable) {
        this.$refs.shipperEdit.resetForm()
      }
      if (!this.editable) {
        this.$refs.shipperCreate.resetForm()
      }
    },
    saveDate  () {
      this.$refs.shipperCreate.validateForm().then(res => {
        console.log(res)
        this.loading = true
        this.postBranchUsers(res.data).then(res => {
          console.log(res)
          this.getBranchUsers(this.params)
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
      this.$refs.shipperEdit.validateForm().then(res => {
        console.log(res)
        this.loading = true
        this.updateBranchUsers(res).then(res => {
          console.log(res)
          this.getBranchUsers(this.params)
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
    }
  },
}
</script>
<style>

.flag-icon {
  min-width: 26px;
  min-height: 26px;
  border-radius: 50%;
  box-shadow: 0px 0px 4px black;
  margin-right: 2px;
  transform: translateY(-5px);
}
</style>
