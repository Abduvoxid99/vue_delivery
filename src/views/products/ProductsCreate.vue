x<template>
  <div>
    <a-spin :spinning="spinning" :tip="$t('productEdit')">

      <a-card :title="$t('fillIn')">
        <a-form layout="horizontal" :form="form" @submit="handleSubmit">
          <a-row>
            <a-col :span="12" :style="{padding: '0 10px'}">
              <a-form-item :label="$t('product_name')">
                <a-input
                  id="inputName"
                  v-decorator="['name',
                                { initialValue: selectedProduct.name,
                                  rules: [{
                                    required: true,
                                    message: $t('required') }] }]"/>
              </a-form-item>
            </a-col>

<!--            <a-col :span="12" :style="{padding: '0 10px'}">-->
<!--              <a-form-item :label="$t('short_name')">-->
<!--                <a-input-->
<!--                  id="inputShortName"-->
<!--                  v-decorator="['short_name',-->
<!--                                { initialValue: selectedProduct.short_name,-->
<!--                                  rules: [{-->
<!--                                    required: true,-->
<!--                                    message: $t('required') }] }]"/>-->
<!--              </a-form-item>-->
<!--            </a-col>-->

            <a-col :span="12" :style="{padding: '0 10px'}">
              <a-form-item :label="$t('description')">
                <a-input
                  id="inputDescription"
                  v-decorator="['description',
                                { initialValue: selectedProduct.description,
                                  rules: [{
                                    required: true,
                                    message: $t('required') }] }]"/>
              </a-form-item>
            </a-col>

<!--            <a-col :span="12" :style="{padding: '0 10px'}">-->
<!--              <a-form-item :label="$t('code')">-->
<!--                <a-input-->
<!--                  id="inputProductCode"-->
<!--                  v-decorator="['code',-->
<!--                                { initialValue: selectedProduct.code,-->
<!--                                  rules: [{-->
<!--                                    required: true,-->
<!--                                    message: $t('required') }] }]"/>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
            <a-col :span="12" :style="{padding: '0 10px'}">
              <a-form-item label="Приоритет">
                <a-input type="number" v-model="order_no"/>
              </a-form-item>
            </a-col>

<!--            <a-col :span="12" :style="{padding: '0 10px'}">-->
<!--              <a-form-item :label="$t('preview_text')">-->
<!--                <a-input-->
<!--                  id="inputPreviewText"-->
<!--                  v-decorator="['preview_text',-->
<!--                                { initialValue: selectedProduct.preview_text,-->
<!--                                  rules: [{-->
<!--                                    required: true,-->
<!--                                    message: $t('required') }] }]"/>-->
<!--              </a-form-item>-->
<!--            </a-col>-->

            <a-col :span="12" :style="{padding: '0 10px'}">
              <a-form-item :label="$t('price')">
                <a-input
                  id="inputPrice"
                  v-decorator="['price',
                                { initialValue: selectedProduct.price,
                                  rules: [{
                                    required: true,
                                    message: $t('required') }] }]"/>
              </a-form-item>
            </a-col>
            <!-- <a-col v-if="type" :span="12" :style="{padding: '0 10px'}">
              <a-form-item :label="(crm === 'iiko' ? 'IIKO' : 'JOWI') + ' ' + $t('product')">
                <a-select @change="setProductType" style="width: 100%" show-search :filter-option="filterOption">
                  <a-select-option v-for="p in jowiProducts" :key="p.id" :value="p.id">
                    <a-row type="flex" justify="space-between">
                      <a-col span="auto">{{ p.name }}</a-col>
                      <a-col span="auto">{{ $moneyFormat(p.price + '') }} <small>uzs</small></a-col>
                    </a-row>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->

            <a-col :md="24" :lg="12" :style="{padding: '0 10px'}">
              <a-form-item :label="$t('categories')">
                <treeselect
                  id="inputCategories"
                  v-model="category_id.id"
                  :multiple="false"
                  :required="true"
                  :set-fields-value="category_id.label"
                  :options="allCategories"
                  :placeholder="categoryName"/>
              </a-form-item>
            </a-col>

            <a-col :span="12" :style="{padding: '0 10px'}" v-if="productId">
              <a-form-item :label="$t('is.active')">
                <a-switch v-model="selectedProduct.is_active" />
              </a-form-item>
            </a-col>

            <!-- <a-col :md="8" :lg="8" :style="{ minHeight: '180px' }">
              <a-form-item :label="$t('uploadProductImage')">
                <div id="uploadImage" class="ant-upload-preview" @click="$refs.modal.edit(2)">
                  <a-icon type="cloud-upload-o" class="upload-icon"/>
                  <div class="mask">
                    <a-icon type="plus" />
                  </div>
                  <img :src="option.img"/>
                </div>
              </a-form-item>
            </a-col> -->
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
                  {{ $route.params.id ? $t('update') :$t('save') }}
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      <product-modal ref="modal" :msg="$t('uploadProductImage')" @ok="setProductImage" />
    </a-spin>
  </div>

</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import productModal from '../../components/imageUploadModal/imageUploadModal'
// import { AutoComplete } from 'ant-design-vue'
import request from '@/utils/request'
import { mapGetters, mapActions } from 'vuex'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
function getSelected (products, selectedProduct) {
  console.log(products, selectedProduct, 'getting selected')
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === selectedProduct) {
      console.log(products[i])
      return products[i]
    }
  }
}
function getCategoryName (categories, id) {
  console.log(categories, id, 'name')
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === id) {
      console.log(categories[0].name)
      return categories[i].name
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
      preview: {},
      productId: this.$route.params.id,
      pagination: this.$route.props,
      crm: localStorage.getItem('crm'),
      type: Object.keys(localStorage).includes('crm'),
      jowiProducts: [],
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
      selectedProduct: {
        is_active: false,
      },
      category_id: {
        label: '',
        id: ''
      },
      jowi_id: null,
      categoryName: '',
      allCategories: [],
      imageFormData: '',
      imageUrlPhoto: '',
      loadingPhoto: '',
      filename: '',
      order_no: null,
      imageUpdated: false,
      requestMethod: 'post',
      loading: false,
      imageUrl: '',
      parks: [],
      spinning: true,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  components: {
    productModal,
    Treeselect
  },
  computed: {
    ...mapGetters(['productKinds', 'categories', 'categoriesWithChildren', 'productsData', 'productsMenu'])
  },
  created () {
    // this.getCrmMenus()
  },
  mounted () {
    this.getProductsMenu().then(() => {
      if (this.productId) {
      this.getSelectedProduct(this.productId)
      console.log(this.productId)
    }
    })
    // this.getCrmProductMenu().then(res => {
    //   this.jowiProducts = res.products
    // })
    // this.getProductKinds()
    // this.getMeasures()
    this.getCategories().then(() => {
      this.spinning = false
      this.allCategories = getCate(this.categories)
      if (this.productId) this.categoryName = getCategoryName(this.categoriesWithChildren, this.selectedProduct.category_id)
      else this.categoryName = this.$t('selectCategory')
    })
  },
  methods: {
    ...mapActions(['getProductKinds', 'getCategories', 'getProducts', 'getProductsMenu', 'getCrmProductMenu']),

    /// ///// =========================================== START EDITION ========================================== //////
    getCrmMenus () {
      this.$store.dispatch('getCrmMenus').then(res => {
        console.log(res)
        this.jowiProducts = res.products
      })
    },
    setProductType (e) {
      console.log(this.crm)
      if (Object.keys(localStorage).includes('crm')) {
        if (this.crm === 'jowi') {
          this.jowi_id = e
        } else {
          this.iiko_id = e
        }
      }
      console.log(e)
    },

    /// ///// =========================================== --------- ========================================== //////
    setProductImage (image) {
          console.log(image, 'image in form')
          this.imageUpdated = true
          getBase64(image, imageUrl => {
          this.imageFormData = image
          this.option.img = imageUrl
          console.log(image)
          this.loading = false
        })
    },
    searchJowiProduct (e) {
      console.log(e)
    },
    getSelectedProduct (selectedProduct) {
      this.selectedProduct = getSelected(this.productsMenu, selectedProduct)
      this.imageUrlPhoto = this.selectedProduct.image
      console.log(this.selectedProduct)
      this.category_id.label = getCategoryName(this.categoriesWithChildren, this.selectedProduct.category_id)
      this.category_id.id = this.selectedProduct.category_id
      const data = this.selectedProduct.image.split('/')
      this.order_no = this.selectedProduct.order_no
      this.jowi_id = this.selectedProduct.jowi_id
      this.iiko_id = this.selectedProduct.iiko_id
      this.filename = data[data.length - 1]
      this.requestMethod = 'put'
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
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          const headers = {
            'Content-Type': 'application/json'
          }
          var url = ''
          var method = ''
          if (this.productId) {
            url = '/product/' + this.productId
            method = 'put'
          } else {
            url = '/product'
            method = 'post'
          }
          const body = {
            name: values['name'],
            description: values['description'],
            category_id: this.category_id.id,
            price: values['price'],
            order_no: this.order_no,
            image: this.filename,
            is_active: this.selectedProduct.is_active,
            jowi_id: this.jowi_id ? this.jowi_id : undefined,
            iiko_id: this.iiko_id ? this.iiko_id : undefined
          }
          request({
            url: url,
            method: method,
            data: body,
            headers: headers
          }).then(res => {
            // this.getProducts()
            // this.$router.replace('/catalog/products')
            if (this.productId) this.$message.success(this.$t('successfullyUpdated'))
            else if (this.productId === 'undefined') this.$message.success(this.$t('successfullyAdded'))
          }).then(err => {
            if (err) {
              console.log(err)
              this.$message.success(this.$t('error'))
            }
          }).finally(() => {
            this.$router.go(-1)
          })
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
<style scoped>
  .ant-col .ant-form-item-label{
    text-align: center !important;
  }

</style>
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
