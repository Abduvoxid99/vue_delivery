<template>
    <a-modal v-model="visible" :title="typeReason" @ok="changeStatus">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item :label="$t('cause')" prop="selectedReason">
          <div v-if="loading" class="spin" ><a-spin></a-spin></div>
          <a-radio-group v-model="form.selectedReason" v-else >
            <a-radio
              :key="i"
              :value="value.text"
              style="display: block; margin-bottom: 24px"
              v-for="(value, i) in cancelingReasons"
            >
              {{ value.text }}
            </a-radio>
            <a-radio value="other">
              {{ $t('other') }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="form.selectedReason === 'other'" prop="description">
          <a-input type="textarea" v-model="form.description" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
</template>

<script>
import cash from './icons/cash.svg'
import click from './icons/click.svg'
import payme from './icons/payme.svg'
import { mapActions } from 'vuex'
import { Modal } from 'ant-design-vue'
export default {
  data () {
    return {
      visible: false,
      item: false,
      cancelingReasons: [],
      loading: false,
      form: {
        selectedReason: null,
        type: 'cancel',
        status_id: null,
        order_id: null,
        description: null
      },
      rules: {
        selectedReason: [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }],
        description: [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions(['changeStatusOrder', 'changePaymentTypeOrder', 'getCancelingReasons', 'postUserLogs', 'getFinishingReasons']),
    changeStatus () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.form.type === 'finish') {
            this.postUserLog('Завершен')
            if (this.item.payment_type === 'cash') {
              this.save()
            } else if (this.item.payment_type !== 'cash' && !this.item.paid) {
              this.showConfirm()
            } else if (this.item.payment_type !== 'cash' && this.item.paid) {
              this.save()
            }
          } else {
            this.postUserLog('Отменен')
            this.save()
          }
        }
      })
    },
    postUserLog (action) {
      const operatorId = JSON.parse(localStorage.getItem('shipper_id'))
      const operatorName = localStorage.getItem('username')
      console.log(this.form.selectedReason, this.form.description)
      this.postUserLogs({
        action: action,
        courier_id: '',
        courier_name: '',
        vendor_id: '',
        vendor_name: '',
        integration_request: '',
        integration_response: '',
        operator_id: operatorId,
        operator_name: operatorName,
        order_id: this.form?.order_id,
        description: this.form.selectedReason === 'other' || this.form.type === 'finish'
          ? this.form.description
          : this.form.selectedReason,
      })
    },
    save () {
      this.changeStatusOrder({
        id: this.form.order_id,
        data: {
          status_id: this.form.status_id,
          description: this.form.selectedReason === 'other'
            ? this.form.description
            : this.form.selectedReason
        }
      }).then(res => {
        console.log(res)
        this.hide()
      })
    },
    showConfirm () {
      Modal.confirm({
        title: <h3>Оплата Payme или Click не оплачены</h3>,
        cancelText: this.$t('cancel'),
        okText: this.$t('save'),
        content: <div>
          <div style="display: flex; margin-bottom: 15px">
            <img width="60px" height="60px" style="margin-right: 20px" src={ payme } /><h1> = </h1>
            <img width="80px" height="80px" style="margin-left: 20px; margin-right: 20px; margin-top: -17px" src={ click } /><h1> > </h1>
            <img width="60px" height="60px" style="margin-left: 20px; margin-top: -5px" src={ cash } />
          </div>
          <p>Вы хотите изменить платный статус на наличные?</p>
        </div>,
        onOk: () => {
          this.changePayType()
        },
        onCancel () {},
      })
    },
    show (id, item, type, status) {
      this.item = item
      console.log(item)
      console.log('Id', id)
      console.log('Status', status)
      this.form.status_id = status
      this.form.order_id = id
      this.form.type = type
      this.visible = true
    },
    changePayType () {
      return new Promise((resolve, reject) => {
        this.changePaymentTypeOrder({
          id: this.form.order_id,
          data: {
            payment_type: 'cash'
          }
        }).then(res => {
          this.save()
          resolve()
        })
          // eslint-disable-next-line
          .catch(err => {
            // eslint-disable-next-line
            reject()
          })
      })
    },
    hide () {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    typeReason () {
      switch (this.form.type) {
        case 'cancel': return this.$t('cancelOrder')
        case 'finish': return this.$t('finishOrder')
        default: break
      }
    },
    getReasons () {
      this.loading = true
      if (this.form.type === 'cancel') {
        this.getCancelingReasons({ page: 1, limit: 50 })
        .then(res => {
          this.cancelingReasons = res?.canceling_reasons
          console.log(this.cancelingReasons)
        })
        .catch(err => console.log(err))
        .finally(() => { this.loading = false })
      } else {
        this.getFinishingReasons({ page: 1, limit: 50 })
        .then(res => {
          this.cancelingReasons = res?.finishing_reasons
          console.log(this.cancelingReasons)
        })
        .catch(err => console.log(err))
        .finally(() => { this.loading = false })
      }
    },
  },
  // created () {
  //   this.getReasons()
  // }
  watch: {
    visible () {
      if (!this.visible) return null
      this.getReasons()
    }
  }
}
</script>

<style scoped>
  .spin {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
