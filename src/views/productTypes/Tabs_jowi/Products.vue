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
              >
              <a-row type="flex" justify="space-between">
                  <a-col span="auto">{{ item.name }}</a-col>
                  <a-col span="auto">({{ $moneyFormat(item.price) }} uzs)</a-col>
                </a-row>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="name" label="Пожалуйста, выберите Jowi Menu" prop="name">
            <a-select show-search @search="onJowiMenuSearched" :filter-option="false" v-model="selectedItem">
              <a-select-option v-for="item in listItems" :value="item.id" :key="item.id">
                <a-row type="flex" justify="space-between">
                  <a-col span="auto">{{ item.name }}</a-col>
                  <a-col span="auto">({{ $moneyFormat(item.price + '') }} uzs)</a-col>
                </a-row></a-select-option>
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
      selectedItem: '',
      listItems: [],
      products: []
    }
  },
  methods: {
    onJowiMenuSearched (e) {
      console.log(e)
      this.getJowiMenu({ limit: 10, page: 1, search: e })
    },
    getJowiMenu (params) {
      this.$store.dispatch('getJowiMenu', params).then((res) => {
        console.log(res)
        this.listItems = res.products
      })
    },
    getProductsList (params) {
      this.$store.dispatch('getProductsList', params).then((res) => {
        console.log(res)
        this.products = res.products
      })
    },
    getOneProduct (e) {
      console.log(e)
      this.form.data = this.products.length ? this.products.filter(el => el.id === e)[0] : {}
    },
    fetchProducts (e) {
      console.log(e)
      this.getProductsList({ page: 1, limit: 10, search: e, jowi: true })
    },
    updateProductMenu () {
      console.log()
      const form = { ...this.form.data, jowi_id: this.selectedItem }
      this.$store.dispatch('updateProductById', form).then(res => {
       this.$alertMessage('success', 'Updated', res.Message, this)
       this.$router.go(-1)
      })
    }
  },
  created () {
  },
}
</script>

<style scoped></style>
