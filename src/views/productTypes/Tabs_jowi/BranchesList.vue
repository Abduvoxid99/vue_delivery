<template>
  <div>
      <a-row type="flex">
          <a-col span="24">
              <a-row :gutter="[8, 8]" type="flex" justify="space-between">
                   <a-col span="8">
                           <a-input-search spellcheck="false" :placeholder="$t('search')" enter-button @search="onSearch" />
                       </a-col>
                    <a-col span="auto">
                      <a-button style="margin-bottom: 10px" type="primary" @click="$router.push('/setting/jowi/append-new-branch')">{{ $t('add') }}</a-button>
                    </a-col>
              </a-row>
          </a-col>
          <a-col span="24">
              <a-table :columns="columns" :data-source="data" :pagination="pagination" @change="getPagination">
                  <span slot="jowi_id" slot-scope="text"><a-tag :color="text.jowi_id ? 'orange' : 'green'">{{ text.jowi_id ? 'Зарегистрирован' : 'Доступен' }}</a-tag></span>
              </a-table>
          </a-col>
      </a-row>
  </div>
</template>

<script>
export default {
    data () {
      return {
        globalSearch: '',
        pagination: { current: 1 },
        columns: [
          {
            title: this.$t('name'),
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: 'Ориентир',
            dataIndex: 'destination',
            key: 'destination'
          },
          {
            title: 'Статус',
            scopedSlots: { customRender: 'jowi_id' },
            key: 'jowi_id'
          }
        ],
        data: [],
        isBtnClicked: false
      }
    },
    methods: {
        onSearch (text) {
            if (text) {
            this.globalSearch = text
            this.getBranchesList({ page: 1, limit: 10, search: this.globalSearch, jowi: false })
            } else {
            this.globalSearch = ''
            this.getBranchesList({ page: 1, limit: 10, jowi: false })
            }
            this.pagination.current = 1
        },
        getBranchesList (params) {
            this.$store.dispatch('getBranchesList', params).then((res) => {
            console.log(res)
            this.data = res.branches.map(el => ({ ...el, key: el.id }))
            this.pagination = { ...this.pagination, total: parseInt(res.count) }
        })
        },
        getPagination (e) {
          console.log(e)
          if (this.globalSearch) {
            this.getBranchesList({ page: e.current, limit: 10, search: this.globalSearch, jowi: false })
          } else this.getBranchesList({ page: e.current, limit: 10, jowi: false })
          this.pagination.current = e.current
        },
    },
    created () {
        this.getBranchesList({ page: 1, limit: 10, jowi: false })
    }
}
</script>

<style>

</style>
