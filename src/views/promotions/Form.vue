<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules">
    <a-row>
      <a-col :span="11">
        <a-form-model-item label="Название на узбекском" prop="title.uz">
          <a-input v-model="form.title.uz" />
        </a-form-model-item>
      </a-col>
      <a-col :span="11" :offset="1">
        <a-form-model-item label="Название на русском" prop="title.ru">
          <a-input v-model="form.title.ru" />
        </a-form-model-item>
      </a-col>
      <a-col :span="11">
        <a-form-model-item label="Описание на узбекском" prop="description.uz">
          <a-input type="textarea" v-model="form.description.uz" />
        </a-form-model-item>
      </a-col>
      <a-col :span="11" :offset="1">
        <a-form-model-item label="Описание на русском" prop="description.ru">
          <a-input type="textarea" v-model="form.description.ru" />
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="11">
        <a-form-model-item :label="$t('photo')" prop="image">
          <a-upload
            :custom-request="uploadImage"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon :type="loadingImage ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                Просмотр изображения
              </div>
            </div>
          </a-upload>
        </a-form-model-item>
      </a-col>
      <a-col :span="11" :offset="1">
        <a-col :span="11">
          <a-form-model-item :label="$t('start_promo')" prop="start_time">
            <a-date-picker
              v-model="form.start_time"
              format="DD-MM-YYYY"
              :disabled-date="disabledDate"
               />
          </a-form-model-item>
        </a-col>
        <a-col :span="11" :offset="1">
          <a-form-model-item :label="$t('end_promo')" prop="end_time">
            <a-date-picker v-model="form.end_time" format="DD-MM-YYYY" :disabled-date="disabledDate"/>
          </a-form-model-item>
        </a-col>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
import moment from 'moment'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  // methods: {
  //   moment,
  //   range (start, end) {
  //     const result = []
  //     for (let i = start; i < end; i++) {
  //       result.push(i)
  //     }
  //     return result
  //   },
  //   disabledDate (current) {
  //     // Can not select days before today and today
  //     return current && current < moment().endOf('day')
  //   },
  // },
  props: {
    edit: {
      type: Boolean,
      default: () => {
        return false
      }
    },
  },
  data () {
    // const validateTelegram = (rule, value, callback) => {
    //   if (/^[@]\$/.test(value)) {
    //     callback()
    //   } else {
    //     callback(new Error('Telegram link error'))
    //   }
    // }
    // const validatePhone = (rule, value, callback) => {
    //   if (/^[+][9][9][8]\d{9}$/.test(value)) {
    //     callback()
    //   } else {
    //     callback(new Error('Phone Error'))
    //   }
    // }
    return {
      imageUrl: null,
      allData: null,
      loadingImage: false,
      form: {
        title: { uz: '', ru: '' },
        description: { uz: '', ru: '' },
        image: '',
        end_time: '',
        start_time: ''
      },
      item: null,
      rules: {
        'title.uz': [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }],
        // 'title.en': [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }],
        'title.ru': [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }],
        'description.ru': [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }],
        'description.uz': [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }],
        // 'description.en': [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }],
        image: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        end_time: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        start_time: [{ required: true, message: this.$t('required'), trigger: 'change' }],
      }
    }
  },
  methods: {
    moment,
    disabledDate: (current) => {
      return current && current < moment().startOf('day')
    },
    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid === true) {
            var _data = { ...this.form }
            _data.start_time = ((new Date(this.form.start_time).getTime()) / 1000).toString()
            _data.end_time = ((new Date(this.form.end_time).getTime()) / 1000).toString()
            resolve({
              id: this.edit ? this.item.id : undefined,
              data: _data
            })
          } else reject(valid)
        })
      })
    },
    resetForm () {
      this.form.image = ''
      this.form.start_time = ''
      this.form.end_time = ''
      this.$refs.ruleForm.resetFields()
    },
    uploadImage (e) {
      console.log(e)
      this.loadingImage = true
      const image = new FormData()
      image.append('file', e.file)
      this.$store.dispatch('upload', image).then(res => {
        getBase64(e.file, imageUrl => {
          this.form.image = res.filename
          this.imageUrl = imageUrl
        })
      })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          console.log('Errorrrrrr')
        })
        .finally(() => {
          console.log('FINALLLY')
          this.loadingImage = false
        })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG, PNG file!')
      }
      return isJpgOrPng
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
