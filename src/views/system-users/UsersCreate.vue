<template>
  <div>
<!--    <a-row>-->
<!--      <a-col :xs="24" :md="12">-->
<!--        <a-breadcrumb style="margin: 10px 5px">-->
<!--          <a-breadcrumb-item>-->
<!--            <router-link to="/shipper-users/">{{ $t('shipper-users') }}</router-link>-->
<!--          </a-breadcrumb-item>-->
<!--          <a-breadcrumb-item v-if="!systemUserId">{{ $t('add') }}</a-breadcrumb-item>-->
<!--          <a-breadcrumb-item v-if="systemUserId">{{ $t('update') }}</a-breadcrumb-item>-->
<!--        </a-breadcrumb>-->
<!--      </a-col>-->
<!--    </a-row>-->

    <a-card :title="$t('fillIn')">
      <template>
        <a-form-model
          @submit="onSubmit"
          ref="ruleForm"
          :model="systemUser"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('fullName')" prop="name">
                <a-input
                  v-model="systemUser.name"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('phone')" prop="phone">
                <a-input
                  v-model="systemUser.phone"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('username')" prop="username">
                <a-input
                  v-model="systemUser.username"
                />
              </a-form-model-item>
            </a-col>
            <a-col v-if="!systemUserId" :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('password')" prop="password">
                <a-input
                  v-model="systemUser.password"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('role')" prop="user_role_id">
                <a-select style="width: 100%" v-model="systemUser.user_role_id">
                  <a-select-option v-for="role in allRoles" :key="role.id" :value="role.id">
                    {{ role.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item>
                <a-button type="primary" html-type="submit" @click="onSubmit">
                  {{ systemUserId ? $t('update') : $t('save') }}
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </template>
    </a-card>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
// import moment from 'moment'

export default {
  data () {
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('incorrectPhone')))
      }
    }
    const password = (rule, value, callback) => {
      if (value.length >= 8) {
        callback()
      } else {
        callback(new Error('Пароль должен состоять минимум из 8 символов'))
      }
    }
    return {
      systemUserId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      country: 'Uzbekistan',
      loading: false,
      systemUser: {
        name: '',
        phone: '',
        username: '',
        password: '',
        user_role_id: null
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'blur' }],
        username: [{ required: true, message: this.$t('required'), trigger: 'blur' }],
        user_role_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        password: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: password, trigger: 'change' }],
        phone: [{ required: true, message: this.$t('required'), trigger: 'change' }, { validator: validatePhone, trigger: 'change' }]
      }
    }
  },
  mounted () {
    console.log(this.systemUserId)
    this.getRoles({
      current: 1,
      limit: 1000
    })
    if (this.systemUserId) this.getSystemUserAttrs()
  },
  computed: {
    ...mapGetters(['allRoles'])
  },
  methods: {
    ...mapActions(['getSystemUsers', 'getRoles']),
    getSystemUserAttrs () {
      console.log(this.systemUserId)
      request({
        url: '/shipper-users/' + this.systemUserId,
        method: 'get'
      }).then((response) => {
        console.log(response)
        this.systemUser.name = response.name
        this.systemUser.phone = response.phone
        this.systemUser.username = response.username
        this.systemUser.user_role_id = response.user_role_id
      })
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/shipper-users'
          var method = 'post'
          if (this.systemUserId) {
            this.systemUser.id = this.systemUserId
            method = 'put'
            url = '/shipper-users/' + this.systemUserId
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          request({
              url: url,
              method: method,
              data: this.systemUser,
              headers: headers
          }).then(res => {
            this.getSystemUsers()
            this.$router.push({ name: 'UsersList' })
          }).then(err => {
            if (err) {
              console.log(err)
              this.$message.success(this.$t('error'))
            }
          })
          console.log('valid')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style>
  .ant-form-item-control {
    line-height: normal !important;
  }
  @media (max-width: 760px) {
    .ant-form-item {
      margin: 0;
    }
  .ant-form-item-label {
    padding-bottom: 4px !important;
  }
  }
</style>
