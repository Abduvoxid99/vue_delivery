<template>
  <a-card :title="$t('Общий агрегатор')">
    <div>
      <div class="flex">
        <a-range-picker v-model="selectedDate" style="margin-bottom: 20px"></a-range-picker>
        <a-button style="margin-bottom: 20px" @click="downloadExcel" :disabled="buttonLoading">
          <a-icon :type="buttonLoading ? 'loading' : 'download'" style="color: blue; font-size: 1.1rem;"></a-icon>
        </a-button>
      </div>
      <a-table
        bordered
        :pagination="true"
        :loading="loading"
        @change="tableChangeHandler"
        :dataSource="tableData"
        :columns="columns"
        :scroll="{ y: 400 }"
      >
        <template slot="payment_type" slot-scope="text">
          <span>{{ text === 'cash' ? 'Нал' : 'Без нал' }}</span>
        </template>

        <template slot="date" slot-scope="text">
          <span>{{ text ? moment(text).format('DD/MM/YYYY') : '' }}</span>
        </template>

        <template slot="time" slot-scope="text">
          <span>{{ text ? moment(text).format('HH:mm') : '' }}</span>
        </template>

        <!-- Filter -->
        <div slot="dateFilter">
          <a-range-picker v-model="selectedDate" style="width: 280px"></a-range-picker>
        </div>

        <div slot="branchFilter">
          <a-select
            allowClear
            v-model="params.branch_ids"
            @change="
            e => {
              $router.replace({ query: { ...$route.query, branch_ids: (e && e.join(',')) || undefined } })
            }
          "
            style="margin: 10px 5px; width: 200px"
            placeholder="Филиалы"
          >
            <a-select-option v-for="r in branchesList" :key="r.id" :value="r.id">
              <a-tooltip>
                <template slot="title">{{ r.name }}</template>
                {{ r.name }}
              </a-tooltip>
            </a-select-option>
          </a-select>
        </div>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import Preview from '../orderNew/Preview.vue'

export default {
  components: {
    Preview
  },
  // eslint-disable-next-line
  props: ['filter'],
  data () {
    return {
      tableData: [],
      branchesList: [],
      loading: false,
      selectedDate: [moment().subtract(1, 'day'), moment()],
      columns: [
        {
          title: this.$t('orderId'),
          dataIndex: 'external_order_id',
          key: 'external_order_id'
        },
        {
          title: this.$t('aggregator'),
          dataIndex: 'aggregator_name',
          key: 'aggregator_name'
        },
        {
          title: this.$t('date'),
          dataIndex: 'date',
          key: 'date',
          scopedSlots: { customRender: 'date', filterDropdown: 'dateFilter' }
        },
        {
          title: this.$t('time'),
          dataIndex: 'date',
          key: 'time',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: this.$t('operator'),
          dataIndex: 'operator_name',
          key: 'operator_name'
        },
        {
          title: this.$t('branch'),
          dataIndex: 'branch_name',
          key: 'branch_name',
          scopedSlots: { filterDropdown: 'branchFilter' }
        },
        {
          title: this.$t('summ'),
          dataIndex: 'price',
          key: 'price'
        },
        {
          title: this.$t('payment_type'),
          dataIndex: 'payment_type',
          key: 'payment_type',
          scopedSlots: { customRender: 'payment_type' }
        },
        {
          title: this.$t('status'),
          dataIndex: 'status',
          key: 'status'
        }
      ],
      params: {
        branch_ids: null,
        start_date: moment()
          .subtract(1, 'day')
          .format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        source: undefined,
        aggregator_id: undefined,
        payment_type: undefined,
        delivery_type: undefined,
        customer_id: undefined,
        courier_id: undefined
      }
    }
  },
  watch: {
    selectedDate (e) {
      console.log(e)
      if (!e.length) {
        this.$router.replace({ query: { start_date: '', end_date: '' } })
        this.fetchTableData({
          start_date: moment()
            .subtract(1, 'day')
            .format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD')
        })
        this.filter.start_date = moment()
          .subtract(1, 'day')
          .format('YYYY-MM-DD')
        this.filter.end_date = moment().format('YYYY-MM-DD')
      } else {
        this.fetchTableData({
          start_date: this.selectedDate[0]?.format('YYYY-MM-DD'),
          end_date: this.selectedDate[1]?.format('YYYY-MM-DD')
        })
        this.filter.start_date = this.selectedDate[0]?.format('YYYY-MM-DD')
        this.filter.end_date = this.selectedDate[1]?.format('YYYY-MM-DD')
      }
    },
    'params.branch_ids' (newVal) {
      console.log('bbb =>', newVal)
      this.fetchTableData({
        branch_id: newVal,
        start_date: this.selectedDate[0]?.format('YYYY-MM-DD'),
        end_date: this.selectedDate[1]?.format('YYYY-MM-DD')
      })
    }
  },
  mounted () {
    this.fetchTableData({
      start_date: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD')
    })
    this.getBranches()
  },
  methods: {
    ...mapActions(['getAggregatorReport', 'getBranches']),
    moment,
    downloadExcel () {
      const params = {
        ...this.params,
        start_date: this.selectedDate[0]?.format('YYYY-MM-DD'),
        end_date: this.selectedDate[1]?.format('YYYY-MM-DD')
      }
      this.$store
        .dispatch('getAggregatorXLSX', params)
        .then(res => {
          console.log(res)
          window.location.href = res.url
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {})
    },
    getBranches (params) {
      this.$store.dispatch('getBranchesList', { limit: 100 }).then(res => {
        this.branchesList = res.branches
      })
    },
    fetchTableData (params) {
      this.loading = true
      this.getAggregatorReport({
        ...params,
        limit: 100
      })
        .then(res => {
          this.tableData = res.aggregator_order_reports
          this.pagination.total = res.count
        })
        .finally(() => {
          this.loading = false
        })
    },
    tableChangeHandler (pagination) {
      this.pagination = pagination
      this.fetchTableData()
    }
  }
}
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
