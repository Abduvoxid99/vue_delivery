<template>
  <div>
    <a-spin :spinning="spinning" :tip="$t('orderEdit')">
      <a-row>
        <a-col :span="12">
          <a-breadcrumb style="margin: 10px 5px">
            <a-breadcrumb-item>
              <router-link to="/categories/">{{ $t('categories') }}</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
          </a-breadcrumb>
        </a-col>
      </a-row>

      <a-card :title="$t('fillIn')">
        <a-form layout="horizontal" :form="form" @submit="handleSubmit">
          <a-row>
            <a-col :span="12" :style="{padding: '0 10px'}">
              <a-form-item label="Название продукта">
                <a-input
                  id="inputName"
                  v-decorator="['name',
                                { initialValue: selectedCategory.name,
                                  rules: [{
                                    required: true,
                                    message: $t('required') }] }]"/>
              </a-form-item>
            </a-col>

            <a-col :span="12" :style="{padding: '0 10px'}">
              <a-form-item :label="$t('description')">
                <a-input
                  id="inputDescription"
                  v-decorator="[
                    'description',
                    {
                      initialValue: selectedCategory.description,
                      rules: [{
                        required: true,
                        message: $t('required')
                      }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12" :style="{padding: '0 10px'}">
              <a-form-item :label="$t('quantity')">
                <a-input type="number" v-model="order_no"/>
              </a-form-item>
            </a-col>

            <a-col :md="24" :lg="12" :style="{padding: '0 10px'}">
              <a-form-item :label="$t('categorie')">
                <treeselect
                  id="selectCategory"
                  v-model="parent_id"
                  :multiple="false"
                  :set-fields-value="parent_id"
                  :options="getAllCategories"
                  :placeholder="$t('selectCategory')"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12" :style="{padding: '0 10px'}" v-if="categoryId">
              <a-form-item :label="$t('is.active')">
                <a-switch v-model="selectedCategory.is_active" />
              </a-form-item>
            </a-col>

            <a-col :xs="24" class="id_video">
              <a-form-model-item :label="$t('uploadProductImage')">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :custom-request="uploadImage"
                  :before-upload="beforeUploadLogo"
                >
                  <img width="150px" v-if="imageUrlPhoto && !loadingPhoto" :src="imageUrlPhoto" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loadingPhoto ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      {{ $t('uploadImage') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="24" :style="{padding: '0 10px'}">
              <a-form-item>
                <a-button id="buttonSubmit" type="primary" :loading="loading" html-type="submit">
                  {{ $t('save') }}
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      <product-modal ref="modal" :msg="$t('uploadCategoryImage')" @ok="setProductImage" />
    </a-spin>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import productModal from '../../components/imageUploadModal/imageUploadModal'
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
function getSelected (categories, selectedCategory) {
  console.log(categories)
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === selectedCategory) {
      console.log(categories[i])
      return categories[i]
    }
  }
}
function getCate (categories) {
      if (categories) {
        return categories.map((c) => {
          if (!c.child_categories) {
              return {
                  ...c,
                  label: c.name
              }
          } else {
                return {
                    ...c,
                    label: c.name,
                    children: getCate(c.child_categories)
                }
          }
        })
      }
    }
export default {
  data () {
    return {
      value: null,
      preview: {},
      categoryId: this.$route.params.id,
      parent_id: null,
      order_no: null,
      // is_active: false,
      selectedCategory: {},
      imageUpdated: false,
      filename: '',
      imageUrlPhoto: '',
      loadingPhoto: false,
      requestMethod: 'post',
      option: {
        img: '/upload.png',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        autoCropWidth: 300,
        autoCropHeight: 300,
        fixedBox: true,
        fixed: true,
        fixedNumber: [1, 1]
      },
      spinning: true,
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  components: {
    productModal,
    Treeselect
  },
  computed: {
    ...mapGetters(['categories', 'categoriesWithChildren']),
    getCategoriesGetter () {
      return this.categories
    },
    getAllCategories () {
      return getCate(this.categories)
    }
  },
  mounted () {
    this.getCategories({
      current: 1,
      pageSize: 100,
      total: null
    }).then(() => {
      if (this.categoryId) this.getSelectedCategory(this.categoryId)
      this.spinning = false
    })
    console.log(this.$route.params.id)
  },
  methods: {
    ...mapActions(['getCategories', 'getCategoriesWithChildren']),
    setProductImage (image) {
        this.imageUpdated = true
       getBase64(image, imageUrl => {
          this.imageFormData = image
          this.option.img = imageUrl
          this.loading = false
        })
    },
    beforeUploadLogo (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    // handleChangePhoto (info) {
    //   if (info.file.status === 'uploading') {
    //     this.loadingPhoto = true
    //     return
    //   }
    //   if (info.file.status === 'done') {
    //     // Get this url from response in real world.
    //     getBase64(info.file.originFileObj, imageUrl => {
    //       this.imageUrlPhoto = imageUrl
    //       this.loadingPhoto = false
    //       this.filename = info.file.response.filename
    //     })
    //   }
    // },
    uploadImage (e) {
      console.log(e)
      this.loadingPhoto = true
      const image = new FormData()
      image.append('file', e.file)
      this.$store.dispatch('upload', image).then(res => {
        getBase64(e.file, imageUrl => {
          this.filename = res.filename
          this.imageUrlPhoto = imageUrl
        })
      })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          console.log('Errorrrrrr')
        })
        .finally(() => {
          console.log('FINALLLY')
          this.loadingPhoto = false
        })
    },
     getSelectedCategory (selectedCategory) {
      console.log(selectedCategory)
      this.selectedCategory = getSelected(this.categoriesWithChildren, selectedCategory)
      this.option.img = this.selectedCategory.image
      this.imageUrlPhoto = this.selectedCategory.image
      console.log(this.imageUrlPhoto)
      if (this.selectedCategory.parent_id !== '000000000000000000000000') this.parent_id = this.selectedCategory.parent_id
      console.log(this.selectedCategory)
      const data = this.selectedCategory.image.split('/')
      this.order_no = this.selectedCategory.order_no
      this.filename = data[data.length - 1]
      this.requestMethod = 'put'
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          const headers = {
            'Content-Type': 'application/json'
          }
          if (!this.imageUpdated) {
            const body = {
              name: values['name'],
              description: values['description'],
              order_no: this.order_no ? this.order_no : 0,
              parent_id: this.parent_id,
              image: this.filename,
              is_active: this.selectedCategory.is_active
            }
            var url = ''
            var method = ''
            if (this.categoryId) {
              url = '/category/' + this.categoryId
              method = 'put'
            } else {
              url = '/category'
              method = 'post'
            }
            request({
                url: url,
                method: method,
                data: body,
                headers: headers
            }).then(res => {
                this.getCategories()
                this.$router.replace('/catalog/categories/')
                if (this.categoryId) this.$message.success(this.$t('successfullyUpdated'))
                else this.$message.success(this.$t('successfullyAdded'))
            }).then(err => {
              if (err) {
                console.log(err)
                this.$message.success(this.$t('error'))
              }
            })
          }
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

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      overflow: hidden;
    }
  }
</style>
