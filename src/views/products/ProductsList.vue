<template>
  <div>

    <a-card v-action:get :title="$t('list')">
      <div slot="extra">
        <a-row type="flex" :gutter="8">
          <a-col span="auto">
              <a-input :placeholder="$t('search') + '...'" @change="searchFilter"/>
          </a-col>
          <a-col span="auto">
            <router-link to="./create">
              <a-button v-action:add type="primary" icon="plus">{{ $t('add') }}</a-button>
            </router-link>
          </a-col>
        </a-row>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="productsData"
        :pagination="productsPagination"
        :loading="loadProduct"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, row">
          <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button style="margin: 0 2px" type="default" @click="showPreviewModal(row.id)" icon="eye"></a-button>
          </a-tooltip>
          <router-link :to="{path: './update/'+row.id, pagination: getPagination}" >
            <a-tooltip><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin: 0 2px" v-action:update id="buttonUpdate" type="primary" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteProduct($event, row.id)"
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
    <a-modal v-model="previewVisible" width="800px" title="Информация о товаре">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('name')">
          {{ selectedProduct.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('short_name')">
          {{ selectedProduct.short_name }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('description')">
          {{ selectedProduct.description }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('code')">
          {{ selectedProduct.code }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('price')">
          {{ selectedProduct.price }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('category_name')">
          {{ selectedProductCategory }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('productPicture')">
          <img :src="selectedProduct.image"/>
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
import debounce from 'lodash/debounce'
function getSelected (products, selectedProduct) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === selectedProduct) {
      return products[i]
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
export default {
  data () {
    this.searchFilter = debounce(this.searchFilter, 1000)
    return {
      data: [],
      type: false,
      isBtnClicked: false,
       columns: [
        {
          title: this.$t('product_name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('description'),
          dataIndex: 'description'
        },
        {
          title: this.$t('price'),
          dataIndex: 'price'
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
      products: [],
      selectedProduct: {},
      productsPaginationCurrent: {},
      selectedProductCategory: '',
      updateVisible: false,
      filterParams: {},
      filter: {
        page: { current: 1, pageSize: 10, total: null },
        search: '',
        is_active: false
      },
      Interval: null
    }
  },
  computed: {
    ...mapGetters(['productsData', 'productsPagination', 'categories', 'categoriesWithChildren', 'loadProduct']),
    getPagination () {
      return this.productsPaginationCurrent
    }
  },
  created () {
    this.type = Object.keys(localStorage).includes('crm')
  },
  mounted () {
    this.getCategories()
    this.getProducts(this.filter)
  },
  methods: {
    ...mapActions(['getProducts', 'getCategories']),

    handleTableChange (pagination) {
      this.filter.page = pagination
      this.getProducts(this.filter)
    },
    getSelectedProduct (selectedProduct) {
      this.selectedProduct = getSelected(this.productsData, selectedProduct)
      this.selectedProductCategory = getCategoryName(this.categoriesWithChildren, this.selectedProduct.category_id)
    },
    showPreviewModal (productId) {
      this.getSelectedProduct(productId)
      this.previewVisible = true
    },
    handleCancel () {
      this.previewVisible = false
    },
    searchFilter (e) {
      console.log(e.target.value)
      this.filter.search = e.target.value
      this.getProducts(this.filter)
    },
    deleteProduct (e, id) {
      request({
              url: '/product/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getProducts(this.filter)
          }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    }
  }
}
</script>
