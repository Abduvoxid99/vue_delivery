<template>
  <div>
      <a-row type="flex" justify="space-between">
          <a-col span="8">
           <a-input-search spellcheck="false" :placeholder="$t('search')" enter-button @search="onSearch" />
          </a-col>
          <a-col span="auto">
              <a-row :gutter="[8, 8]" type="flex" justify="end">
                    <a-col span="auto">
                      <a-button style="margin-bottom: 10px" type="primary" @click="$router.push('/setting/jowi/append-new-product')">{{ $t('add') }}</a-button>
                    </a-col>
                    <a-col span="auto">
                      <a-button style="margin-bottom: 10px" type="primary" icon="reload" @click="getUpdateJowiMenu">{{ $t('Обновить меню') }}</a-button>
                    </a-col>
              </a-row>
          </a-col>
          <a-col span="24">
              <a-table :columns="columns" :data-source="data" @change="getPagination" :pagination="pagination">
                    <span slot="jowi_id" slot-scope="text"><a-tag :color="text.jowi_id ? 'orange' : 'green'">{{ text.jowi_id ? 'Зарегистрировано' : 'доступный' }}</a-tag></span>
                    <span slot="price" slot-scope="text">{{ $moneyFormat(text.price) }} uzs</span>
              </a-table>
          </a-col>
      </a-row>
  </div>
</template>

<script>
export default {
    data: () => ({
      pagination: { current: 1 },
        columns: [
           {
                title: 'Название блюда',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Описание',
                scopedSlots: { customRender: 'price' },
                key: 'price'
            },
            {
                title: 'Status',
                scopedSlots: { customRender: 'jowi_id' },
                key: 'jowi_id'
            }
        ],
        data: [],
        isBtnClicked: false,
    }),
    methods: {
    onSearch (text) {
      if (text) {
        this.globalSearch = text
        this.getProductList({ page: 1, limit: 10, search: this.globalSearch, jowi: false })
        } else {
        this.globalSearch = ''
        this.getProductList({ page: 1, limit: 10, jowi: false })
        }
        this.pagination.current = 1
    },
      getPagination (e) {
        console.log(e)
        this.getProductList({ limit: 10, page: e.current, jowi: false })
        this.pagination.current = e.current
      },
      getUpdateJowiMenu () {
        this.$store.dispatch('getUpdateJowiMenu').then(res => {
          console.log(res)
          this.$message.success('Меню успешно обновлено')
        })
      },
      getProductList (params) {
            this.$store.dispatch('getProductList', params).then(res => {
              console.log(res)
              this.data = res.products.map(el => ({ ...el, key: el.id }))
              this.pagination = { ...this.pagination, total: parseInt(res.count) }
            })
        }
    },
    created () {
        this.getProductList({ limit: 10, page: 1, jowi: false })
    }
}
</script>

<style>

</style>
