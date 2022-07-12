<template>
  <a-card>
    <a-form-model :colon="false" ref="ruleForm" :model="form" :rules="rules">
      <a-row type="flex">
        <a-col offset="2" span="16">
          <a-form-model-item ref="name" label="Пожалуйста, выберите продукт" prop="name">
            <a-select @search="fetchProducts" @change="getOneProduct" show-search :filter-option="false">
              <a-select-option
                v-for="item in products"
                :value="item.id"
                :key="item.id"
              ><a-row type="flex" justify="space-between">
                  <a-col span="auto">{{ item.name }}</a-col>
                  <a-col span="auto">({{ $moneyFormat(item.price) }} uzs)</a-col>
                </a-row>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="name" label="Пожалуйста, выберите ikko menu" prop="name">
            <a-select @search="fetchIkkoMenu" v-model="selectedItem" show-search :filter-option="false">
              <a-select-option v-for="item in listItems" :value="item.id" :key="item.id">
                <a-row type="flex" justify="space-between">
                  <a-col span="auto">{{ item.name }}</a-col>
                  <a-col span="auto">( {{ $moneyFormat(item.price+ '') }} uzs)</a-col>
                </a-row>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-row type="flex" :gutter="[8, 8]">
            <a-col span="auto">
              <a-button @click="$router.go(-1)">{{
                $t('cancel')
              }}</a-button>
            </a-col>
            <a-col span="auto">
              <a-button @click="updateProductMenu" type="primary">{{
                $t('save')
              }}</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
export default {
  data () {
    return {
      form: {},
      rules: {},
      listItems: [],
      products: [],
      selectedItem: ''
    }
  },
  methods: {
    // filterOption: (input, option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    getIikoMenu (params) {
      this.$store.dispatch('getIikoMenu', params).then((res) => {
        // console.log(res)
        this.listItems = res.products
      })
    },
    getProducts (params) {
      this.$store.dispatch('getProducts', params).then((res) => {
        // console.log(res)
        this.products = res.products
      })
    },
    getOneProduct (e) {
      // console.log(e)
      this.form.data = this.products.length ? this.products.filter(el => el.id === e)[0] : {}
    },

    fetchIkkoMenu (e) {
      this.getIikoMenu({ page: 1, limit: 70, search: e })
    },
    fetchProducts (e) {
      // console.log(e)
      this.getProducts({ page: 1, limit: 10, search: e })
    },
    updateProductMenu () {
      const form = { ...this.form.data, iiko_id: this.selectedItem }
      console.log(form)
      this.$store.dispatch('updateProductById', form).then(res => {
        console.log(res)
        this.$alertMessage('success', 'Updated', 'updated info', this)
        this.$router.go(-1)
      })
    }
  },
  created () {
    this.getIikoMenu()
  },
}
</script>

<style scoped></style>
