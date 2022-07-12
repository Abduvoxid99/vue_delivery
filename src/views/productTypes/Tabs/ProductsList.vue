<template>
  <div>
    <a-row type="flex" justify="space-between">
      <a-col span="8">
        <a-input-search spellcheck="false" :placeholder="$t('search')" enter-button @search="onSearch" />
      </a-col>
      <a-col span="auto">
        <a-row :gutter="[8, 8]" type="flex" justify="end">
          <a-col span="auto">
            <a-button
              style="margin-bottom: 10px"
              type="primary"
              @click="$router.push('/setting/iiko/append-new-product')"
              >{{ $t('add') }}</a-button
            >
          </a-col>
          <a-col span="auto">
            <a-button :loading="isBtnClicked" @click="updateMenu" type="primary" icon="reload">{{
              $t('Обновить CRM меню')
            }}</a-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col span="24">
        <a-table bordered :columns="columns" :data-source="data" @change="getPagination" :pagination="pagination">
            <span slot="iiko_id" slot-scope="text"><a-tag :color="text.iiko_id ? 'orange' : 'green'">{{ text.iiko_id ? 'Registered' : 'available' }}</a-tag></span>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data: () => ({
        pagination: { current: 1 },
        globalSearch: '',
        columns: [
           {
                title: 'Название блюда',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Описание',
                dataIndex: 'description',
                key: 'description'
            },
            {
                title: 'Status',
                scopedSlots: { customRender: 'iiko_id' },
                key: 'iiko_id'
            }
        ],
    data: [],
    isBtnClicked: false,
  }),
  methods: {
    onSearch (text) {
      if (text) {
            this.globalSearch = text
            this.getProductList({ page: 1, limit: 10, search: this.globalSearch, iiko: false })
            } else {
            this.globalSearch = ''
            this.getProductList({ page: 1, limit: 10, iiko: false })
            }
            this.pagination.current = 1
    },
    updateMenu () {
      this.isBtnClicked = true
      this.$store
        .dispatch('updateCrmMenu')
        .then((res) => {
          console.log(res)
          this.$message.success('Меню успешно обновлено')
        })
        .finally(() => {
          this.isBtnClicked = false
        })
    },
    getProductList (params) {
      this.$store.dispatch('getProductList', params).then((res) => {
        console.log(res)
        if (res.products) {
          this.data = res.products.map((el) => ({ ...el, key: el.id }))
        } else {
          this.data = []
        }
        this.pagination = { ...this.pagination, total: parseInt(res.count) }
      })
    },
    getPagination (e) {
      console.log(e)
      if (this.globalSearch) {
        this.getProductList({ page: e.current, limit: 10, search: this.globalSearch, iiko: false })
      } else this.getProductList({ page: e.current, limit: 10, iiko: false })
      this.pagination.current = e.current
    },
  },
  created () {
    this.getProductList()
  },
}
</script>

<style>
</style>
