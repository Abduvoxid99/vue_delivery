<template>
  <a-modal width="600px" centered v-model="visible" @cancel="hide" :title="!editable ? 'Add Post' : 'Update Post'">
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
import moment from 'moment'
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
    ...mapActions(['PostBot', 'getPromo', 'updatePromo', 'smsProvider']),
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
          this.$refs.itemEdit.imageUrl = _data.image
          this.$refs.itemEdit.item = _data
          e.title.uz = _data.title.uz
          e.title.ru = _data.title.ru
          e.title.en = _data.title.en
          e.description.uz = _data.description.uz
          e.description.ru = _data.description.ru
          e.description.en = _data.description.en
          e.is_active = _data.is_active
          e.image = _data.image.split('/')[4]
          e.start_time = moment(parseInt(_data.start_time) * 1000).format('YYYY.MM.DD')
          e.end_time = moment(parseInt(_data.end_time) * 1000).format('YYYY.MM.DD')
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
        this.activeKey = '1'
        this.smsprovider = {
          name: '',
          login: '',
          password: '',
          shipper_id: null
        }
        this.$refs.itemCreate.resetForm()
      }
    },
    saveDate () {
      this.$refs.itemCreate.validateForm().then(res => {
        console.log(res)
        this.loading = true
        this.PostBot(res.data).then(res => {
          console.log(res)
          this.hide()
          this.$refs.itemCreate.resetForm()
          this.$notification.success({
            message: 'Post created Successfully'
          })
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
        this.updatePromo(res).then(res => {
          console.log(res)
          this.getPromo(this.params)
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
    moment
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
