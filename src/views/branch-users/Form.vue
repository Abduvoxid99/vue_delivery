<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules">
    <a-row>
      <a-col :span="11">
        <a-form-model-item ref="name" :label="$t('name')" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
      </a-col>
      <a-col :span="11" :offset="1">
        <a-form-model-item :label="$t('phone')" prop="phone">
          <a-input v-model="form.phone" />
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="11">
        <a-form-model-item ref="name" label="Role" prop="user_role_id">
          <a-select style="width: 100%" v-model="form.user_role_id">
            <a-select-option v-for="r in allRoles" :key="r.id" :value="r.id">
              {{ r.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  props: {
    edit: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  computed: {
    ...mapGetters(['allRoles'])
  },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (/^[+][9][9][8]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('Phone Error'))
      }
    }
    return {
      imageUrl: null,
      allData: null,
      loadingImage: false,
      form: {
        name: '',
        phone: '',
        user_role_id: null,
        branch_id: this.$route.params.branchId
      },
      item: null,
      rules: {
        name: [{ required: true, message: this.$t('required_message'), trigger: 'blur' }],
        phone: [{ required: true, message: this.$t('required_message'), trigger: 'blur' }, { validator: validatePhone, message: 'Phone Value Error', trigger: 'change' }],
        user_role_id: [{ required: true, message: this.$t('required_message'), trigger: 'change' }]
      }
    }
  },
  watch: {
    'form.work_hour_end': function (val) {
      console.log(val)
    }
  },
  methods: {
    moment,
    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid === true) {
            resolve({
              id: this.edit ? this.item.id : undefined,
              data: this.form
            })
          } else reject(valid)
        })
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style>
img, .mask {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 250px;
  height: auto;
  overflow: hidden;
}

.avatar-uploader > .ant-upload.ant-upload-select-picture-card {
  width: 150px;
  height: 150px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
