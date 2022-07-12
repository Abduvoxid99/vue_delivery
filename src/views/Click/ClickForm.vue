<template>
  <div>
    <a-row>
      <a-col :md="12" :xs="24">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/setting/click/list">{{ $t('click') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card :title="$t('fillIn')">
      <template>
        <a-form-model
          @submit="onSubmit"
          ref="ruleForm"
          :model="click"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="name" label="Филиалы" prop="branch_id">
                <a-select :disabled="branch_id.length ? true: false" @search="fetchBranches" v-model="click.branch_id" show-search :filter-option="false">
                  <a-select-option
                    v-for="item in listItems"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="key" :label="$t('key')" prop="key">
                <a-input
                  :placeholder="$t('key')"
                  v-model="click.key"
                  spellcheck="false"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('ID сервисa')" prop="service_id">
                <a-input
                  :placeholder="$t('Service id')"
                  v-model="click.service_id"
                  spellcheck="false"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('merchant_id')" prop="merchant_id">
                <a-input
                  :placeholder="$t('merchant_id')"
                  v-model="click.merchant_id"
                  spellcheck="false"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('ID Мерчант пользователя')">
                <a-input
                  :placeholder="$t('merchant_user_id')"
                  v-model="click.merchant_user_id"
                  spellcheck="false"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item>
                <a-button type="primary" html-type="submit" @click="onSubmit">
                  {{ $t('save') }}
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

export default {
  data () {
    return {
      branch_id: this.$route.params.id || '',
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      listItems: [],
      click: {
        merchant_id: '',
        branch_id: '',
        key: '',
        merchant_user_id: 0,
        service_id: 0
      },
      rules: {
        key: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        merchant_id: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        merchant_user_id: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        service_id: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  mounted () {
    // console.log(process.env.VUE_APP_PAYME_LOGIN)
    if (this.branch_id) {
      this.getClickById(this.branch_id)
      this.getBranchById(this.branch_id)
    }
  },
  methods: {
     fetchBranches (e) {
      console.log(e)
      this.getBranchesList({ page: 1, limit: 10, search: e })
    },
    getBranchesList (params) {
      this.$store.dispatch('getBranchesList', params).then((res) => {
        console.log(res)
        this.listItems = res.branches
      })
    },
     getBranchById (id) {
      this.$store.dispatch('getSelectedBranch', id).then(res => {
        console.log(res)
        this.listItems.push(res)
      })
    },
    getClickById (id) {
      this.$store.dispatch('getClickById', id).then(res => {
        console.log(res)
        this.click = res
      })
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/click-info'
          var method = 'post'
          if (this.branch_id) {
            url = '/click-info/' + this.branch_id
            method = 'put'
          }
          const headers = {
            'Content-Type': 'application/json'
          }
          request({
              url: url,
              method: method,
              data: {
                ...this.click,
                service_id: parseInt(this.click.service_id),
                merchant_id: parseInt(this.click.merchant_id),
                merchant_user_id: parseInt(this.click.merchant_user_id)
              },
              headers: headers
          }).then(res => {
            this.$message.success(this.$t('successfullyUpdated'))
            this.$router.replace('/setting/click/list')
          }).catch(err => {
            if (err) {
              console.log(err)
              this.$message.error(err.response.data.error)
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
  @media (max-width: 760px) {
    .ant-form-item {
      margin: 0;
    }
  .ant-form-item-label {
    padding-bottom: 4px !important;
  }
  }
</style>
