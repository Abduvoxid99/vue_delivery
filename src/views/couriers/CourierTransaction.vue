<template>
  <a-card :title="$t('Трансакции')" >
    <a-table
      bordered
      :pagination="pagination"
      :loading="loading"
      @change="tableChangeHandler"
      :dataSource="tableData"
      :columns="columns"
    >
      <template slot="summ" slot-scope="row">
        <span v-if="row.credit" class="green" >+{{ row.credit.toLocaleString() }}</span>
        <span v-else class="red" >-{{ row.debit.toLocaleString() }}</span>
      </template>

      <template slot="orderId" slot-scope="text, row">
        <span @click="openModal(row.order_id)" style="color: blue; text-decoration: underline; cursor: pointer" >{{ text }}</span>
      </template>
    </a-table>
     <preview ref="previewModalnew" />
  </a-card>
</template>

<script>
import { mapActions } from 'vuex'
import Preview from '../orderNew/Preview.vue'

export default {
  components: {
    Preview
  },
  data: () => ({
    tableData: [],
    loading: false,
    pagination: {
      current: 1,
      total: 1,
      pageSize: 10
    },
    columns: [
      {
        title: 'Время',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: 'Сумма',
        align: 'center',
        scopedSlots: {
          customRender: 'summ'
        }
      },
      {
        title: 'ИД заказа',
        align: 'center',
        dataIndex: 'external_order_id',
        key: 'external_order_id',
        scopedSlots: {
          customRender: 'orderId'
        }
      }

    ]
  }),
  mounted () {
    this.fetchTableData()
  },
  methods: {
    ...mapActions(['getCourierTransactions', 'getOrderById']),
    fetchTableData () {
      this.loading = true
      this.getCourierTransactions({
        courier_id: this.$route.params.id,
        limit: 10,
        page: this.pagination.current,
        search: this.searchText
      })
        .then(res => {
          this.tableData = res.courier_transactions
          this.pagination.total = res.count
        })
        .finally(() => { this.loading = false })
    },
    tableChangeHandler (pagination) {
      this.pagination = pagination
      this.fetchTableData()
    },
    async openModal (id) {
      this.loading = true
      this.getOrderById(id)
        .then(res => {
          this.$refs.previewModalnew.openModal(res)
        })
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>
  .green {
    color: #76b35c;
  }

  .red {
    color: #F94C50;
  }
</style>
