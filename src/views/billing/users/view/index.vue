<template>
  <div>
      <a-card :title="$t('Transactions')">
    <!-- <a-button slot="extra" type="primary" @click="visitShipper('new')">
      {{ $t('add') }}
    </a-button> -->
    <div style="display: flex; justify-content: space-between">
      <a-col :span="8">
        Name : {{ $route.params.name }}
      </a-col>
      <a-col span="auto">
        Balance : {{ $moneyFormat(balance.balance + '') }}
      </a-col>
    </div>
    <a-table
      bordered
      style="margin-top: 16px"
      :columns="columns"
      :loading="loading"
      :data-source="transactions"
      :pagination="pagination"
      :customRow="customRow"
      @change="getPagination"
    >
      <template slot="time" slot-scope="item">{{ getdate(item.time) }}</template>
      <template slot="creditCustom" slot-scope="">
        <span style="color: green">Кредит</span> / <span style="color: red">Дебет</span>
        </template>
      <template slot="credit" slot-scope="item">
        <a-tag color="green" v-if="item.credit" >
           {{ $moneyFormat(item.credit+' ') + $t('sum') }}
        </a-tag>
        <a-tag v-else color="red">
          {{ $moneyFormat(item.debit+' ') + $t('sum') }}
        </a-tag>
      </template>
      <template v-if="false" slot="action" slot-scope="item">
        <a-tooltip>
          <!-- <template slot="title">{{ $t('update') }}</template> -->
          <a-button
            style="margin: 0 2px"
            id="buttonUpdate"
            type="primary"
            @click="visitShipper(item)"
            icon="edit"
          />
        </a-tooltip>
          <a-tooltip>
            <a-button
              style="margin: 0 2px"
              type="primary"
              @click="visit(item.shipper_id)"
              icon="eye"
            ></a-button>
          </a-tooltip>
      </template>
    </a-table>
  </a-card>
  <Modal :modal="modal"/>
  </div>
</template>

<script>
import Modal from './Modal.vue'
export default {
  components: { Modal },
  data () {
    return {
      transactions: [],
      balance: {},
      loading: false,
      modal: { visible: false, data: null },
      columns: [
        {
          key: 'numbrt',
          title: this.$t('Номер'),
          dataIndex: 'order_num',
        },
        {
          key: 'phone',
          // width: 50,
          slots: { title: 'creditCustom' },
          scopedSlots: { customRender: 'credit' },
        },
        {
          key: 'ksdas',
          // width: 50,
          title: this.$t('createdAt'),
          scopedSlots: { customRender: 'time' },
        }
      ],
      pagination: { current: 1 },
      search: ''
      }
  },
  methods: {
    customRow (row) {
      return {
        on: {
          click: event => {
            this.getShipperTransInfo(row)
          }
        }
      }
    },
    getdate (time) {
      const date = time.split('T')[0].split('-').reverse().join('.')
      const timeRange = time.split('T')[1].substring(0, 8)
      return date + ' ' + timeRange
    },
    getShipperTransInfo (item) {
      console.log(item)
      this.modal.visible = true
      this.modal.data = item
    },
    getTransactions (id, params) {
      this.loading = true
      this.$store.dispatch('getTransactions', { shipper_id: id, ...params }).then(res => {
        console.log(res)
        this.transactions = res.transactions.map((el, i) => ({ ...el, key: i + 44, order_num: i + 1 }))
        this.pagination = { ...this.pagination, total: parseInt(res.count) }
      }).finally(() => {
        this.loading = false
      })
    },
    getPagination (e) {
      console.log(e)
      this.getTransactions(this.$route.params.id, { limit: 10, page: e.current })
      this.pagination.current = e.current
    },
    getShipperBalanceById (id) {
      this.$store.dispatch('getShipperBalanceById', id).then(res => {
        console.log(res)
        this.balance = res
      }).finally(() => {
        console.log()
      })
    },
    onTableChange (val) {
      console.log(val)
    }
  },
  created () {
    console.log(this.$route)
    this.getTransactions(this.$route.params.id)
    this.getShipperBalanceById(this.$route.params.id)
  }
}
</script>

<style>

</style>
