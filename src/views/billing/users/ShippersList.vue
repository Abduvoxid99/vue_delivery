<template>
  <a-card :title="$t('Shipper balance')">
    <div slot="extra" style="display: flex">
      <a-button @click="openBalanceModal">
        {{ $t('top.up.balance') }}
      </a-button>
      <a-button type="primary" style="margin-left: 10px" @click="visitShipper('new')">
        {{ $t('add') }}
      </a-button>
    </div>
    <!-- <div style="display: flex; justify-content: space-between">
      <a-col :span="8">
        <a-input-search
          v-model="name"
          :placeholder="$t('search')"
        />
      </a-col>
    </div> -->
    <a-table
      bordered
      style="margin-top: 16px"
      :columns="columns"
      :loading="loading"
      :data-source="shippers"
      :pagination="pagination"
      @change="getPagination"
    >
      <template slot="action" slot-scope="item">
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
              @click="visit(item)"
              icon="eye"
            ></a-button>
          </a-tooltip>
      </template>
    </a-table>
    <top-up-balance :modal="balanceModal" />
  </a-card>
</template>

<script>
import TopUpBalance from './TopUpBalance.vue'

export default {
  name: 'ShippersList',
  components: {
    'top-up-balance': TopUpBalance
  },
  data () {
    return {
      loading: false,
      shippers: [],
      // name: '',
      pagination: {},
      balanceModal: {
        visible: false
      },
      columns: [
        {
          key: 'name',
          // width: 50,
          title: this.$t('номер'),
          dataIndex: 'order_num',
        },
        {
          key: 'phone',
          // width: 50,
          title: this.$t('name'),
          dataIndex: 'shipper_name',
        },
        {
          key: 'balance',
          // width: 50,
          title: this.$t('Баланс'),
          dataIndex: 'balance',
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' },
        }
      ]
    }
  },
  methods: {
    getShippers (params) {
      this.loading = true
      this.$store.dispatch('getShipperBalance', params).then(res => {
        console.log(res)
        this.shippers = res.shipper_balances.map((el, i) => ({ ...el, order_num: i + 1, key: i + 334 }))
        this.pagination = { ...this.pagination, total: parseInt(res.count) }
        window.scrollTo(0, 0)
      }).finally(() => {
        this.loading = false
      })
    },
    visit (item) {
      console.log(item)
      this.$router.push({ path: `/billing/shippers/list/${item.shipper_id}/transactions/${item.shipper_name}` })
    },
    getPagination (page) {
      console.log(page)
      this.getShippers({ page: page.current, limit: page.pageSize })
    },
    visitShipper (item) {
      console.log(item)
      if (item === 'new') {
        this.$router.push('/billing/shippers/create')
      } else {
        this.$router.push('/billing/shippers/' + item.shipper_id)
      }
    },
    openBalanceModal () {
      this.balanceModal.visible = true
    }
  },
  created () {
    this.getShippers()
  }
}
</script>
