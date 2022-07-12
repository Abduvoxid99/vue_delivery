<template>
  <div>
    <a-card title="Click" style="width: 100%">
      <a-button type="primary" slot="extra" @click="$router.push('/setting/click/new')">{{ $t('add') }}</a-button>
    </a-card>
    <a-card style="width: 100%">
        <a-table :columns="columns" :data-source="data" :pagination="false">
          <span slot="branch_name" slot-scope="text">{{ text.branch_name }}</span>
          <span slot="created_at" slot-scope="text">{{ text.created_at | moment('DD/MM/YYYY HH:mm') }}</span>
          <span slot="actions" slot-scope="text">
            <a-row type="flex" :gutter="[8, 8]">
              <a-col span="auto"><a-button icon="edit" @click="$router.push(`/setting/click/${text.branch_id}`)"></a-button></a-col>
              <a-col span="auto">
                  <a-popconfirm
                      title="Вы уверены, чтобы удалить этот ?"
                      ok-text="Да"
                      v-action:delete
                      cancel-text="Нет"
                      @confirm="deletePayme(text)"
                      @cancel="cancel => null"
                    >
                      <a-tooltip placement="bottomLeft" :title="$t('delete')">
                        <a-button type="danger" icon="delete" />
                      </a-tooltip>
                    </a-popconfirm>
                </a-col>
            </a-row>
          </span>
        </a-table>
    </a-card>

  </div>
</template>
<script>

export default {

  data () {
    return {
      visible: false,
      data: [],
      columns: [
        {
            key: 'branch_name',
            title: 'название филиала',
            scopedSlots: { customRender: 'branch_name' },
        },
        {
            key: 'key',
            title: this.$t('merchant_id'),
            dataIndex: 'merchant_id'
        },
        {
            key: 'createedd_at',
            title: this.$t('createdAt'),
            scopedSlots: { customRender: 'created_at' },
        },
        {
            key: 'action',
            title: this.$t('action'),
            scopedSlots: { customRender: 'actions' },
        },
      ]
    }
  },
  methods: {
    deletePayme (e) {
      console.log(e)
      this.$store.dispatch('deleteClick', e.branch_id).then(res => {
        console.log(res)
        this.data = this.data.filter(el => el.branch_id !== e.branch_id)
      })
    },
      getClick (params) {
          this.$store.dispatch('getClick', {
            page: 1,
            limit: 100
          }).then(res => {
              console.log(res)
              this.data = res.click_infos.map(el => ({ ...el, key: el.key }))
          })
      },
      addPayme (params) {
          this.$store.dispatch('getBranchesList', params).then(res => {
              console.log(res)
          })
      }
  },
  computed: {
  },
  created () {
      this.getClick()
  }
}
</script>
<style lang="less" scoped>
.click {
  border-radius: 5px;
  width: 100%;
  box-shadow: 2px 2px 15px #02f6dc;
}
.click:hover {
  box-shadow: 4px 4px 15px #07aad9;
}
</style>
