<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="Личный кабинет">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="Ошибка пароля или входа!" />
          <a-form-item>
            <a-input
              id="loginPassword"
              size="large"
              type="text"
              placeholder="Логин"
              v-decorator="[
                'login',
                {rules: [{ required: true, message: 'Пожалуйста, введите имя пользователя' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              id="loginUsername"
              size="large"
              :type="passType"
              autocomplete="false"
              placeholder="Пароль"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: 'Пожалуйста, введите пароль' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              <a-tooltip slot="suffix" :title="passType === 'password' ? this.$t('show_password') : this.$t('hide_password')">
                <a-icon :type="passType === 'password' ? 'eye' : 'eye-invisible'" @click="changePassType" style="color: rgba(0,0,0,.45); cursor: pointer;" />
              </a-tooltip>
            </a-input>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >Войти</a-button>
      </a-form-item>

      <!-- <div class="user-login-other">
        <router-link class="register" :to="{ name: 'register' }">Ro'yxatdan o'tish</router-link>
      </div> -->
    </a-form>

<!--    <two-step-captcha-->
<!--      v-if="requiredTwoStepCaptcha"-->
<!--      :visible="stepCaptchaVisible"-->
<!--      @success="stepCaptchaSuccess"-->
<!--      @cancel="stepCaptchaCancel"-->
<!--    ></two-step-captcha>-->
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
// import { timeFix } from '@/utils/util'
// import { getSmsCaptcha } from '@/api/login'
import store from '@/store'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import request from '@/utils/request'

export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      passType: 'password',
      customActiveKey: 'tab1',
      loginBtn: false,
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,

        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'getRolePermissionById']),
    changePassType () {
      console.log('change pass')
      this.passType = this.passType === 'password' ? 'text' : 'password'
    },
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['login', 'password'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form new', values)
          const loginParams = { ...values }
          delete loginParams.username
          loginParams.username = values.login
          loginParams.password = values.password
          delete loginParams.login
          Login(loginParams)
            .then((res) => {
              request({
                url: `/shippers/${JSON.parse(localStorage.getItem('shipper_id'))}`
              }).then(res => {
                storage.set('crm', res.crm)
                this.$store.commit('SET_CRM_TYPE', res.crm)
                // document.location.reload()
                console.log(res)
              })
              this.loginSuccess(res)
              console.log(localStorage.getItem('token'), 'tokin in login')
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    // getCaptcha (e) {
    //   e.preventDefault()
    //   const { form: { validateFields }, state } = this
    //
    //   validateFields(['mobile'], { force: true }, (err, values) => {
    //     if (!err) {
    //       state.smsSendBtn = true
    //
    //       const interval = window.setInterval(() => {
    //         if (state.time-- <= 0) {
    //           state.time = 60
    //           state.smsSendBtn = false
    //           window.clearInterval(interval)
    //         }
    //       }, 1000)
    //
    //       const hide = this.$message.loading('Verification code sending..', 0)
    //       getSmsCaptcha({ mobile: values.mobile }).then(res => {
    //         setTimeout(hide, 2500)
    //         this.$notification['success']({
    //           message: 'Propt',
    //           description: 'The verification code is successfully obtained. Your verification code is:' + res.result.captcha,
    //           duration: 8
    //         })
    //       }).catch(err => {
    //         setTimeout(hide, 1)
    //         clearInterval(interval)
    //         state.time = 60
    //         state.smsSendBtn = false
    //         this.requestFailed(err)
    //       })
    //     }
    //   })
    // },
    // stepCaptchaSuccess () {
    //   this.loginSuccess()
    // },
    // stepCaptchaCancel () {
    //   this.Logout().then(() => {
    //     this.loginBtn = false
    //     this.stepCaptchaVisible = false
    //   })
    // },
    loginSuccess (res) {
      console.log(localStorage.getItem('token'), 'tokin in login')
      this.$router.push({ path: '/' })
      // setTimeout(() => {
      //   this.$notification.success({
      //     message: this.$t('welcome'),
      //     description: this.$t('greeting')
      //   })
      // }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: 'Error',
        description: ((err.response || {}).data || {}).message || 'Ошибка при подключении к серверу. Пожалуйста, попробуйте снова',
        duration: 4
      })
      const token = storage.get(ACCESS_TOKEN)
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            document.location.reload()
          }, 1)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
#loginPassword, #loginUsername {
  margin-bottom: 24px;
}
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
