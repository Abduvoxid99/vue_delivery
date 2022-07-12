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
    ...mapActions(['getAllTariff', 'saveTariff', 'updateTariff']),
    hide () {
      this.visible = false
      this.clear()
    },
    show (data) {
      if (this.editable) {
        console.log(data)
        setTimeout(() => {
          const e = this.$refs.itemEdit.form
          this.$refs.itemEdit.item = data
          this.$refs.itemEdit.form.type = data.type
          e.base_distance = data.base_distance ? data.base_distance : undefined
          e.base_price = data.base_price
          e.fare_values = data.fare_values.map((el, i) => ({ ...el, idx: i }))
          e.price_per_km = data.price_per_km ? data.price_per_km : undefined
          e.type = data.type
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
    saveDate  () {
      this.$refs.itemCreate.validateForm().then(res => {
        console.log(res)
        this.loading = true
        this.saveTariff(res.data).then(res => {
          console.log(res)
          this.getAllTariff(this.params)
          this.hide()
        })
          .finally(() => {
            this.loading = false
          })
      }).catch(error => {
        console.log(error, 'Error')
      })
    },
    updateData () {
      this.$refs.itemEdit.validateForm().then(res => {
        console.log(res)
        this.loading = true
        this.updateTariff(res).then(res => {
          console.log(res)
          this.getAllTariff(this.params)
          this.hide()
        })
          .finally(() => {
            this.loading = false
          })
      }).catch(error => {
        console.log(error, 'Error')
      })
    }
  },
}
</script>
<style>
</style>
