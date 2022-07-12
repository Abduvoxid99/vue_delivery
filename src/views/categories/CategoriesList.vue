<template>
  <div>

    <a-card v-action:get :title="$t('list')">
      <div slot="extra" style="display: flex">
        <router-link to="././create">
          <a-button v-action:add style="float: right" type="primary link" icon="plus">{{ $t('add') }}
          </a-button>
        </router-link>
        <a-button style="margin-left: 5px;" @click="$store.dispatch('updateTelegramBase', { option: 'catalog' })" v-action:add type="default" icon="sync">{{ $t('refresh_telegram') }}
        </a-button>
<!--        <a-button style="margin-left: 5px;" @click="openUploadModal = true" v-action:add type="primary" icon="file-excel"></a-button>-->
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllCategories"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, row">
          <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button style="margin: 0 2px" id="buttonPreview" type="default" @click="showPreviewModal(row.id)" icon="eye"></a-button>
          </a-tooltip>
          <router-link v-action:update :to="'./update/'+row.id" >
            <a-tooltip><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin: 0 2px" id="buttonUpdate" type="primary" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteCategory($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip><template slot="title">{{ $t('delete') }}</template>
              <a-button style="margin: 0 2px" v-action:delete id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="previewVisible" width="800px" title="Информация о продукте">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('category_name')">
          {{ selectedCategory.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('description')">
          {{ selectedCategory.description }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('parentCategory')">
          {{ parentCategory }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('productPicture')">
          <img :src="selectedCategory.image"/>
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
    <a-modal v-model="openUploadModal" title="Категория загрузки" on-ok="handleOk">
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handleCancel">
          {{ $t('save') }}
        </a-button>
      </template>
      <a-upload
        :custom-request="uploadImage"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :before-upload="beforeUpload"
      >
        <img width="200px" height="200px" v-if="imageUrl" :src="excel" alt="avatar" />
        <div v-else>
          <a-icon :type="loadingImage ? 'loading' : 'plus'" />
          <div class="ant-upload-text">
            Категория загрузки
          </div>
        </div>
      </a-upload>
      <div>
        <a href="http://cdn.delever.uz/delever/template.xlsx"><a-button> <a-icon type="download" />Сохранить пример</a-button></a>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import excel from '@/assets/excel.png'
function getSelected (categories, selectedCategory) {
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === selectedCategory) {
      return categories[i]
    }
  }
}
function getCategoryName (categories, id) {
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === id) {
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
                children: c.child_categories
            }
        } else {
              return {
                  ...c,
                  children: getCate(c.child_categories)
              }
        }
      })
      }
    }
export default {
  data () {
    return {
      value: '',
      data: [],
      loading: true,
      loadingImage: false,
      excel: excel,
      imageUrl: false,
       columns: [
        {
          title: this.$t('category_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('description'),
          dataIndex: 'description'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      openUploadModal: false,
      selectedCategory: {},
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['categories', 'paginationCategories', 'categoriesWithChildren']),
    getPagination () {
      return this.paginationCategories
    },
    getAllCategories () {
      return getCate(this.categories)
    }
  },
  mounted () {
    this.getCategories().then(() => {
      this.loading = false
      console.log(this.categories)
    })
  },
  methods: {
    ...mapActions(['getCategories']),
    handleTableChange (pagination) {
      this.getCategories(pagination)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    uploadImage (e) {
      console.log(e)
      this.loadingImage = true
      const file = new FormData()
      file.append('file', e.file)
      this.$store.dispatch('uploadExcel', file).then(res => {
        this.imageUrl = true
        console.log(res)
      })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          console.log('FINALLLY')
          this.loadingImage = false
        })
    },
    beforeUpload (file) {
      console.log(file)
      const isJpgOrPng = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload XLS, XLSX file!')
      }
      return isJpgOrPng
    },
    saveUploadExcel () {
      console.log('salom')
    },
    showPreviewModal (categoryId) {
      this.getSelectedCategory(categoryId)
      this.previewVisible = true
    },
    getSelectedCategory (selectedCategory) {
      this.selectedCategory = getSelected(this.categoriesWithChildren, selectedCategory)
      console.log(this.selectedCategory)
      this.parentCategory = getCategoryName(this.categoriesWithChildren, this.selectedCategory.parent_id)
    },
    handleCancel () {
      this.previewVisible = false
      this.openUploadModal = false
    },
    deleteCategory (e, id) {
      request({
              url: '/category/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getCategories()
          }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.filterParams = values
          this.pagination.current = 1
        }
      })
    }
  }
}
</script>
