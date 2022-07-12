<template>
  <div>
      <a-row type="flex">
          <a-col span="24">
              <a-row :gutter="[8, 8]" type="flex" justify="space-between">
                       <a-col span="8">
                           <a-input-search spellcheck="false" :placeholder="$t('search')" enter-button @search="onSearch" />
                       </a-col>
                       <a-col span="auto">
                           <a-row type="flex" :gutter="[8, 8]">
                                <a-col span="auto">
                                    <a-button style="margin-bottom: 10px" type="primary" @click="$router.push('/setting/iiko/append-new-branch')">{{ $t('add') }}</a-button>
                                </a-col>
                                <a-col span="auto">
                                    <a-button :loading="isBtnClicked" @click="updateBranch" type="primary" icon="reload">{{ $t('Обновить CRM филиал') }}</a-button>
                                </a-col>
                           </a-row>
                       </a-col>
              </a-row>
          </a-col>
          <a-col span="24">
              <a-table bordered :columns="columns" :data-source="data" @change="getPagination" :pagination="pagination">
                  <span slot="iiko_id" slot-scope="text"><a-tag :color="text.iiko_id ? 'orange' : 'green'">{{ text.iiko_id ? 'Зарегистрирован' : 'Не доступен' }}</a-tag></span>
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
            scopedSlots: { customRender: 'iiko_id' },
            key: 'iiko_id'
          }
        ],
        data: [],
        isBtnClicked: false,
      }
    },
    methods: {
        onSearch (text) {
            if (text) {
            this.globalSearch = text
            this.getBranchesList({ page: 1, limit: 100, search: this.globalSearch, iiko: false })
            } else {
            this.globalSearch = ''
            this.getBranchesList({ page: 1, limit: 100, iiko: false })
            }
            this.pagination.current = 1
        },
        updateBranch () {
            this.isBtnClicked = true
            this.$store.dispatch('updateIikoBranch').then(res => {
                console.log(res)
                this.$message.success('Филиал успешно обновлен')
            }).finally(() => {
                this.isBtnClicked = false
            })
        },
        getPagination (e) {
            if (this.globalSearch) {
            this.getBranchesList({ page: e.current, limit: 10, search: this.globalSearch, iiko: false })
            } else this.getBranchesList({ page: e.current, limit: 10, iiko: false })
            this.pagination.current = e.current
        },
        getBranchesList (params) {
            this.$store.dispatch('getBranchesList', params).then((res) => {
            this.data = res.branches.map(el => ({ ...el, key: el.id }))
            this.pagination = { ...this.pagination, total: parseInt(res.total) }
        })
    },
    },
    created () {
        this.getBranchesList({ page: 1, limit: 10, iiko: false })
    }
}
</script>

<style>

</style>
