<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules">
    <a-row>
      <a-button v-if="form.photo || form.video || form.animation" @click="del">{{ $t('delFile') }}</a-button>
      <a-tabs>
        <a-tab-pane v-if="!form.video && !form.animation" key="1" :tab="$t('photo')">
          <a-col :span="24">
            <a-form-model-item :label="$t('photo')" prop="photo">
              <a-upload
                :custom-request="uploadImage"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
              >
                <img class="imageEditor" v-if="imageUrl" :src="imageUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="loadingImage ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Просмотр изображения
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-tab-pane>
        <a-tab-pane v-if="!form.photo && !form.animation" key="2" :tab="$t('video')">
          <a-col :span="24">
            <a-form-model-item :label="$t('video')" prop="video">
              <a-upload
                :custom-request="uploadVideo"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :before-upload="beforeUploadVideo"
              >
                <img class="imageEditor" v-if="videoUrl" :src="videoUrl" alt="Видео загружено" />
                <div v-else>
                  <a-icon :type="loadingImage ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Просмотр видео
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-tab-pane>
        <a-tab-pane v-if="!form.photo && !form.video" key="3" :tab="$t('animation')">
          <a-col :span="24">
            <a-form-model-item :label="$t('animation')" prop="animation">
              <a-upload
                :custom-request="uploadGif"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :before-upload="beforeUploadGif"
              >
                <img class="imageEditor" v-if="gifUrl" :src="gifUrl" alt="avatar" />
                <div v-else>
                  <a-icon :type="loadingImage ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    Просмотр Анимация
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-tab-pane>
      </a-tabs>
      <a-col :span="24">
        <a-form-model-item :label="$t('description')" prop="text">
          <a-input type="textarea" v-model="form.text"></a-input>
        </a-form-model-item>
      </a-col>
      <a-button type="primary" :loading="loading" @click="addItem">{{ $t('add') }}</a-button>
    </a-row>
  </a-form-model>
</template>
<script>
import './editor.css'
import { mapActions } from 'vuex'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  data () {
    return {
      imageUrl: null,
      videoUrl: null,
      gifUrl: null,
      loading: false,
      loadingImage: false,
      form: {
        file: '',
        photo: '',
        text: '',
        video: '',
        animation: ''
      },
      item: null,
      rules: {
        photo: [{ required: true, message: this.$t('required'), trigger: 'blur' }],
        video: [{ required: true, message: this.$t('required'), trigger: 'blur' }],
        animation: [{ required: true, message: this.$t('required'), trigger: 'blur' }],
        text: [{ required: true, message: this.$t('required'), trigger: 'blur' }]
      }
    }
  },
  mounted () {
    console.log(this.data)
  },
  methods: {
    ...mapActions(['PostBot']),
    del () {
      this.imageUrl = null
      this.videoUrl = null
      this.gifUrl = null
      this.form.photo = ''
      this.form.video = ''
      this.form.animation = ''
    },
    addItem () {
      this.validateForm().then(res => {
        this.loading = true
        this.PostBot(res.data).then(res => {
          console.log(res)
          this.resetForm()
          this.$notification.success({
            message: 'Пост успешно создано'
          })
        })
          .catch(error => {
            this.$notification.error({
              message: 'Error Request or Response',
              description: error.message,
            })
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
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
      this.imageUrl = null
      this.videoUrl = null
      this.gifUrl = null
      this.tiptap = null
      this.form.photo = ''
      this.form.video = ''
      this.form.file = ''
      this.form.animation = ''
      this.$refs.ruleForm.resetFields()
    },
    uploadImage (e) {
      console.log(e)
      this.loadingImage = true
      const image = new FormData()
      image.append('file', e.file)
      this.$store.dispatch('upload', image).then(res => {
        getBase64(e.file, imageUrl => {
          this.form.photo = res.filename
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
    uploadVideo (e) {
      console.log(e)
      this.loadingImage = true
      const image = new FormData()
      image.append('file', e.file)
      this.$store.dispatch('uploadVideo', image).then(res => {
        console.log('video res', res)
        getBase64(e.file, videoUrl => {
          this.form.video = res.filename
          this.videoUrl = videoUrl
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
    uploadGif (e) {
      console.log(e)
      this.loadingImage = true
      const image = new FormData()
      image.append('file', e.file)
      this.$store.dispatch('uploadGif', image).then(res => {
        console.log('gif res', res)
        getBase64(e.file, gifUrl => {
          this.form.animation = res.filename
          this.gifUrl = gifUrl
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
    },
    beforeUploadVideo (file) {
      const isMP4 = file.type === 'video/mp4'
      if (!isMP4) {
        this.$message.error('You can only upload mp4 file!')
      }
      return isMP4
    },
    beforeUploadGif (file) {
      const isGif = file.type === 'image/gif'
      if (!isGif) {
        this.$message.error('You can only upload gif file!')
      }
      return isGif
    }
  }
}
</script>
<style>
imageEditor, .mask {
  display: block;
  margin: 0 auto;
  width: 100%;
  min-width: 100%;
  height: auto;
  overflow: hidden;
  object-fit: contain;
}

.avatar-uploader > .ant-upload.ant-upload-select-picture-card {
  width: 100%;
  height: 200px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.editor p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}
</style>
