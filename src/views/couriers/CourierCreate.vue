<template>
  <div>
    <a-card :title="$t('fillIn')">
      <a-form-model layout="horizontal"
        ref="ruleForm"
        :model="forms"
        :rules="rules"
      >
        <a-row>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item :label="$t('firstName')" prop="first_name">
              <a-input v-model="forms.first_name" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item :label="$t('lastName')" prop="last_name">
              <a-input v-model="forms.last_name" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item :label="$t('phone') + ' (+998*********)'" prop="phone">
              <a-input v-model="forms.phone" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item :label="$t('keymax')" prop="max_orders_count">
              <a-input-number style="width: 100%;" v-model="forms.max_orders_count" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" :style="{padding: '0 10px'}">
            <a-form-model-item ref="courier_type_id" :label="$t('courierName')" prop="courier_type_id">
              <a-select v-model="forms.courier_type_id" style="width: 100%">
                <a-select-option v-for="province in getSelectCourierType" :key="province.name" :value="province.id">
                  {{ province.name }}
                </a-select-option>
                </a-select>
<!--              <a-input-number style="width: 100%;" v-model="forms.max_orders_count" />-->
            </a-form-model-item>
          </a-col>

          <a-col :span="4" :style="{padding: '0 40px'}" v-if="enableWorkingHours">
            <a-form-model-item :label="$t('is.working')" prop="is_working">
              <a-switch v-model="forms.is_working" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6" :style="{padding: '0 10px'}" v-if="enableWorkingHours">
            <a-form-model-item :label="$t('status')" prop="is_active">
              <a-switch v-model="forms.is_active" />
            </a-form-model-item>
          </a-col>
           <!-- <a-col :span="16" :style="{padding: '0 10px'}" v-if="enableWorkingHours">
             <a-form-model-item :label="$t('working.mode')" prop="working_mode">
              <WorkMode :value="forms.working_hours" @change="onWorkModeChange" />
             </a-form-model-item>
           </a-col> -->
        </a-row>

        <a-row>
          <a-col :span="24" :style="{padding: '0 10px'}">
            <a-form-model-item>
              <a-button
                id="buttonSubmit"
                type="primary"
                style="margin-right: 10px;"
                @click="onSubmit"
                :loading="loading"
                v-if="$route.params.id"
              >
                {{ $t('updates') }}
              </a-button>
              <a-button v-else type="primary" @click="handleSubmit">{{ $t('save') }} </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import WorkMode from './WorkMode'

export default {
  watch: {
    'forms.courier_type_id': (e) => {
      console.log('courerid', e)
    }

  },
  components: {
    WorkMode
  },
  data () {
   const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
   const validateNumber = (rule, value, callback) => {
      if (Number.isInteger(value)) {
        console.log(value)
        callback()
      } else {
        console.log(typeof value)
        callback(new Error(this.$t('keymaxerror')))
      }
    }
    return {
      couriersitemid: null,
      params: {
        page: { page: 1, limit: 10, totle: null },
        search: '',
      },
      courier_id: null,
      enableWorkingHours: true,
      forms: {
        first_name: '',
        last_name: '',
        phone: '',
        max_orders_count: 0,
        is_working: false,
        is_active: false,
        courier_type_id: ''
      },
      rules: {
        first_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        last_name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        courier_type_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        phone: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validatePhone, }],
        max_orders_count: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validateNumber, }],
      },
      address: null,
      location: {},
      loading: false,
    }
  },
  mounted () {
   if (this.$route.params.id) {
     this.$store.dispatch('getCourierId', this.$route.params.id)
     .then(res => {
       console.log(res)
       this.forms = res
      //  this.forms.first_name = res.first_name
      //  this.forms.last_name = res.last_name
      //  this.forms.phone = res.phone
      //  this.forms.max_orders_count = res.max_orders_count
      //  this.courier_id = res.id
     }).catch(error => {
       console.log(error)
     })
   }
    this.getDistributors()
  },
  created () {
    this.getCourierTypeList()
    this.getShipper()
      .then(res => {
        // this.enableWorkingHours = res.enable_courier_working_hours
      })
      .catch(err => console.log(err))
  },
  computed: {
    ...mapGetters(['distributors', 'courierTypeLIst']),
    getSelectCourierType () {
      return this.courierTypeLIst
    }
  },
  methods: {
    getCourierTypeList () {
      this.$store.dispatch('getCourierTypesList', this.params)
    },
    onWorkModeChange (val) {
      console.log(val)
      this.forms.working_hours = val
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const dataform = {
            form: this.forms,
            courier_id: this.$route.params.id
          }
          delete dataform.form.branches
          this.$store.dispatch('courierUpdate', dataform)
            .then(res => {
              this.$router.push({ name: 'CourierList' })
              this.$message.success(this.$t('courierAlreadyExist'))
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message.error(this.$t('error'))
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    ...mapActions(['getCouriers', 'getDistributors', 'getCouriersList', 'getShipper']),
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          // const body = {
          //   first_name: this.forms.first_name,
          //   last_name: this.forms.last_name,
          //   phone: this.forms.phone,
          //   max_orders_count: this.forms.max_orders_count,
          //   working_hours: this.froms.working_hours
          //   // distributor_id: '029c23a6-1314-4e60-9574-2a413fdb8c13',
          //   // park_id: '5ac8e30c-0e8d-4938-86cd-fca6c5447efb'
          // }
          // console.log(body)
          request({
            url: '/couriers',
            method: 'post',
            data: this.forms
          })
            .then(res => {
              console.log(res)
              this.getCouriers()
              this.$message.success(this.$t('successfullyAdded'))
              this.$router.push({ name: 'CourierList' })
            })
            .catch(error => {
              if (error.response.status === 409) {
                this.$message.error(this.$t('courierAlreadyExists'))
                this.loading = false
              } else {
                this.$message.success(this.$t('error'))
                this.loading = false
              }
            })
          // this.$store.dispatch('setCouriers', body)
          // .finally(() => {
          //   this.loading = false
          // })
        }
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>
