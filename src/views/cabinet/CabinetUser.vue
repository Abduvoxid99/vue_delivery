<template>
  <div>
    <a-card
      style="width:100%"
      :title="$t('cabinet')"
    >
      <a-tabs
        default-active-key="1"
        tab-position="left"
        size="large"
      >
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon style="font-size: 20px" type="profile"/>
            {{ $t('change_data') }}
          </span>
          {{ $t('change_data') }}
          <user-edit ref="userEdit"></user-edit>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon style="font-size: 22px" type="safety"/>
            {{ $t('change_password') }}
          </span>
          <a-row>
            <a-col style="margin: 5px 10px" :span="20">
              <label>{{ $t('old_password') }}</label>
              <a-input :type="type" v-model="old_pass" :placeholder="$t('old_password')">
              </a-input>
            </a-col>
            <a-col style="margin: 5px 10px" :span="20">
              <label>{{ $t('new_password') }}</label>
              <a-input :type="type" v-model="new_pass" :placeholder="$t('new_password')">
                <a-tooltip slot="suffix" title="Extra information">
                  <a-icon @click="showPass" :type="type === 'password' ? 'eye' : 'eye-invisible'" style="color: rgba(0,0,0,.45)" />
                </a-tooltip>
              </a-input>
            </a-col>
            <a-col style="margin: 5px 10px" :span="20">
              <label>{{ $t('new_password_confirm') }}</label>
              <a-input :type="type" v-model="confirm_pass" :placeholder="$t('new_password_confirm')" />
            </a-col>
          </a-row>
          <a-row style="margin: 20px 0">
            <a-col :span="16"></a-col>
            <a-col :span="8">
              <a-button @click="changePass" type="primary" :loading="loadingBtn">
                {{ $t('change_password') }}
              </a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import UserEdit from '@/views/cabinet/UserEdit'
export default {
  components: {
    'user-edit': UserEdit
  },
  data () {
    return {
      new_pass: null,
      confirm_pass: null,
      old_pass: null,
      loadingBtn: false,
      type: 'password'
    }
  },
  mounted () {
    this.getUserByID()
  },
  methods: {
    ...mapActions(['changePassword', 'getUser']),
    changePass () {
      if (this.new_pass != null && this.confirm_pass != null && this.new_pass === this.confirm_pass) {
        this.loadingBtn = true
        this.changePassword({
          password: this.old_pass,
          new_password: this.new_pass
        }).then(res => {
          this.loadingBtn = false
          this.$message.success(this.$t('successfullyUpdated'))
          this.new_pass = null
          this.old_pass = null
          this.confirm_pass = null
          this.type = 'password'
        }).catch(err => {
          this.loadingBtn = false
          this.$message.error(err.message)
        })
      } else {
        this.$message.error(this.$t('error'))
      }
    },
    getUserByID () {
      this.getUser().then(res => {
        this.$refs.userEdit.form.name = res.name
        this.$refs.userEdit.form.phone = res.phone
        this.$refs.userEdit.form.username = res.username
        console.log(res)
      })
    },
    showPass () {
      if (this.type === 'password') {
        this.type = 'text'
      } else this.type = 'password'
    }
  }
}
</script>
