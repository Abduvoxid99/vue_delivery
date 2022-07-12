<template>
  <div>
      <a-row type="flex" justify="space-between">
        <a-col span="8">
            <a-input-search spellcheck="false" :placeholder="$t('search')" enter-button @search="onSearch" />
        </a-col>
          <a-col span="auto">
              <a-row :gutter="[8, 8]" type="flex" justify="end">
                    <a-col span="auto">
                      <a-button style="margin-bottom: 10px" type="primary" @click="$router.push('/setting/iiko/append-new-terminal')">{{ $t('add') }}</a-button>
                    </a-col>
                    <a-col span="auto">
                      <a-button :loading="isBtnClicked" @click="updateIikoTerminal" type="primary" icon="reload">{{ $t('Обновить терминал') }}</a-button>
                    </a-col>
              </a-row>
          </a-col>
          <a-col span="24">
              <a-table :columns="columns" :data-source="data">
                  <span slot="iiko_terminal_id" slot-scope="text"><a-tag :color="text.iiko_terminal_id ? 'orange' : 'green'">{{ text.iiko_terminal_id ? 'Зарегистрирован' : 'Не доступен' }}</a-tag></span>
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
            scopedSlots: { customRender: 'iiko_terminal_id' },
            key: 'iiko_terminal_id'
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
            this.getBranchesList({ page: 1, limit: 10, search: this.globalSearch, iiko: false })
            } else {
            this.globalSearch = ''
            this.getBranchesList({ page: 1, limit: 10, iiko: false })
            }
            this.pagination.current = 1
        },
        getPagination (e) {
            if (this.globalSearch) {
            this.getBranchesList({ page: e.current, limit: 10, search: this.globalSearch, iiko: false })
            } else this.getBranchesList({ page: e.current, limit: 10, iiko: false })
            this.pagination.current = e.current
        },
        updateIikoTerminal () {
            this.isBtnClicked = true
            this.$store.dispatch('updateIikoTerminal').then(res => {
                console.log(res)
                this.$message.success('Terminal успешно обновлен')
            }).finally(() => {
                this.isBtnClicked = false
            })
        },
        getBranchesList (params) {
            this.$store.dispatch('getBranchesList', params).then((res) => {
            console.log(res)
            this.data = res.branches.map(el => ({ ...el, key: el.id }))
            this.pagination = { ...this.pagination, total: parseInt(res.total) }
        })
        },
    },
    created () {
        this.getBranchesList({ page: 1, size: 10 })
    }
}
</script>

<style>

</style>
