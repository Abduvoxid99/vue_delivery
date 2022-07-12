<template>
  <a-modal width="500px" v-model="visible" @cancel="hide" title="Новый клиент">
    <template slot="footer">
      <a-button key="back" @click="hide">{{ $t('cancel') }}</a-button>
      <a-button v-if="!edit" html-type="submit" type="primary" :loading="loading" @click="saveDate">{{ $t('add') }}</a-button>
      <a-button v-if="edit" html-type="submit" type="primary" :loading="loading" @click="updateDate">{{ $t('update') }}</a-button>
    </template>
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item :label="$t('name')" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item :label="$t('phone')" prop="phone">
        <a-input v-model="form.phone" />
      </a-form-model-item>
      <a-form-model-item :label="$t('Тип клиента')" >
        <a-select style="width: 100%" v-model="form.customer_type_id" placeholder="Тип клиента" >
          <a-select-option v-for="(item, index) in ClientType" :value="item.id" :key="index">
            {{ item.name }}
          </a-select-option>
<!--          <a-select-optin v-for="custromerType in customersType " :key="custromerType.id" :value="custromerType.id">-->
<!--            {{custromerType.name}}-->
<!--          </a-select-optin>-->
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    params: {
      type: Object,
      default: () => { return {} }
    },
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
      array: [{ name: 'eljahon', id: 'fsdfdfd' }],
      visible: false,
      loading: false,
      id: null,
      typePrams: {
        current: 1,
        pageSize: 50,
        total: null,
        name: ''
      },
      form: {
        name: '',
        phone: '',
        customer_type_id: ''
      },
      rules: {
        name: [{ required: true, message: 'Обязательное поле для заполнения', trigger: 'blur' }],
        phone: [{ required: true, message: 'Обязательное поле для заполнения', trigger: 'change' }, { validator: validatePhone, trigger: 'change' }]
      }
    }
  },
  methods: {
    handleChange (e) {
      this.from.customer_type_id = e
    },
CustomersType () {
  // const params = {
  //   current: 1,
  //   pageSize: 50,
  //   total: null,
  //   name: ''
  // }
  // this.$store.dispatch('getAllCustomersType', params)
  console.log('hello')
},
    ...mapActions(['customerCreate', 'getAllCustomersType', 'getAllCustomers', 'customerUpdate']),
    hide () {
      this.visible = false
      this.resetForm()
    },
    show () {
      this.visible = true
    },
    saveDate () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.customerCreate(this.form).then(res => {
            this.hide()
            this.getAllCustomers(this.params)
          })
          .catch(err => {
            this.$notification.error({
              message: err.response.data.Error.Code,
              description:
                err.response.data.Error.Message
            })
          })
          .finally(() => {
            this.loading = false
          })
        }
      })
    },
    updateDate () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.customerUpdate({
            id: this.id,
            data: this.form
          }).then(res => {
            this.hide()
            this.getAllCustomers(this.params)
          })
          .catch(err => {
            console.log()
            this.$notification.error({
              message: err.response.data.Error.Code,
              description:
                err.response.data.Error.Message
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
  },
  mounted () {
    this.getAllCustomersType(this.typePrams)
    console.log('hello')
  },
  computed: {
    ...mapGetters(['ClientType']),
  }
}
</script>
