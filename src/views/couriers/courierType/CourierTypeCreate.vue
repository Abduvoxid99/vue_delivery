<template>
 <div>
   <a-card>
     <div slot="title">
       <span> {{ this.$route.params.id ? this.$t('CourirCreate') : this.$t('CourierCreate') }} </span>
     </div>
     <div>
       <a-card>
         <a-form-model
           ref="ruleForm"
           :model="form"
           :rules="rules"
           :colon="false"
         >
           <a-row>
             <a-col :xs="24" :md="11">
               <a-form-model-item ref="name" :label="$t('Name')" prop="name">
               <a-input
                 v-model="form.name"
               />
             </a-form-model-item>
             </a-col>
             <a-col :xs="24" :md="11" :offset="1">
               <a-form-model-item ref="distance_from" :label="$t('distance_from')" prop="distance_from">
               <a-input-number style="width: 100%"
                 v-model="form.distance_from"
               />
             </a-form-model-item>
             </a-col>
             `<a-col :xs="24" :md="11"><a-form-model-item ref="distance_to" :label="$t('distance_to')" prop="distance_to">
               <a-input-number style="width: 100%"
                 v-model="form.distance_to"
               />
             </a-form-model-item>
             </a-col>`
<!--             <a-col :xs="24" :md="12"><a-form-model-item ref="name" label="Activity name" prop="name">-->
<!--               <a-input-->
<!--                 v-model="form.name"-->
<!--               />-->
<!--             </a-form-model-item>-->
<!--             </a-col>-->
                <!-- <a-col :xs="24" :md="11" :offset="1" :style="{padding: '0 10px'}" v-if="enableWorkingHours">
                  <a-form-model-item :label="$t('is.working')" prop="is_working">
                    <a-switch v-model="form.is_working" />
                  </a-form-model-item>
                </a-col> -->
                <a-col :span="24" :style="{padding: '0 10px'}" v-if="enableWorkingHours">
                  <a-form-model-item :label="$t('working.mode')" prop="working_mode">
                    <WorkMode :value="form.working_hours" @change="onWorkModeChange" />
                  </a-form-model-item>
                </a-col>
           </a-row>
         </a-form-model>

         <div style="float: right">
           <div>
             <a-button type="primary" @click="onSubmit">
               <a-icon :type="loading ? 'loading' : ''"></a-icon>
               {{ $t('save') }}
             </a-button>
             <a-button style="margin-left: 10px" @click="resetForm">{{ $t('cancel') }}</a-button>
           </div>
         </div>
       </a-card>
     </div>
   </a-card>
 </div>
</template>

<script>
import WorkMode from '../WorkMode.vue'
export default {
  components: { WorkMode },
  data () {
    const validateNumber = (rule, value, callback) => {
      if (Number.isInteger(value) && value > 0) {
        callback()
      } else {
        callback(new Error(this.$t('Введите номер')))
      }
    }
  return {
    enableWorkingHours: true,
    loading: false,
    rules: {
      name: [{ required: true, message: 'Please input Activity name', trigger: 'change' }],
      distance_from: [{ required: true, message: 'Please input Activity name', trigger: 'change' }, { validator: validateNumber, trigger: 'change' }],
      distance_to: [{ required: true, message: 'Please input Activity name', trigger: 'change' }, { validator: validateNumber, trigger: 'change' }]
    },
    form: {
      distance_from: '',
      distance_to: '',
      is_working: false,
      name: '',
      shipper_id: JSON.parse(localStorage.getItem('shipper_id')),
      working_hours: [
        { day_number: 0, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 1, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 2, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 3, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 4, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 5, is_active: false, start_time: '00:00', end_time: '23:00' },
        { day_number: 6, is_active: false, start_time: '00:00', end_time: '23:00' },
      ]
    }
  }
},
  methods: {
    onWorkModeChange (val) {
      console.log(val)
      this.form.working_hours = val
    },
    onSubmit () {
      this.loading = !this.loading
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.$route.params.id) {
            this.$store.dispatch('updateCourireType', { id: this.$route.params.id, data: this.form, this: this })
              .then(res => {
                this.$router.push({ name: 'CourierTypeList' })
                this.loading = !this.loading
                this.$notification.success({
                  message: 'Обновить данные курьера',
                  duration: 2
                })
              })
              .catch(err => {
                console.log(err)
                this.$notification.error({
                  message: 'Ошибка обновления типа курьера',
                  duration: 2
                })
              })
            .finally(() => {
              this.loading = !this.loading
            })
          } else {
            this.$store.dispatch('createCourierTypes', this.form)
              .then(res => {
                this.$router.push({ name: 'CourierTypeList' })
                this.loading = !this.loading
               this.$notification.success({
                  message: 'Тип курьера создает успех',
                 duration: 2
                })
              })
            .catch(err => {
              console.log(err)
              this.$notification.error({
                message: 'Ошибка создания типа курьера',
                duration: 2
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    },
  },
  mounted () {
  if (this.$route.params.id) {
    this.$store.dispatch('getCourierTypeIdItem', this.$route.params.id)
    .then(res => {
      this.form = { ...res, working_hours: res.working_hours.length ? res.working_hours : this.form.working_hours }
      this.form.distance_from = Number(res.distance_from)
      this.form.distance_to = Number(res.distance_to)
      console.log(res)
    })
  }
  }

}
</script>

<style scoped>

</style>
