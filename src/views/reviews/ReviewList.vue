<template>
  <div>
    <a-card v-action:get :title="$t('reviewReport')" style="width: 100%">
      <h3 slot="extra">{{ $t('reviewCount') }}: <strong>{{ count }}</strong></h3>
      <a-row style="margin-bottom: 15px;">
        <a-col :span="6"></a-col>
        <a-col :span="6"></a-col>
        <a-col :span="6"></a-col>
        <a-col :span="6"><a-button @click="isFilter = !isFilter" style=" width: 100%" icon="filter">{{ !isFilter ? 'Oткрыть' : 'Закрыть' }} фильтры</a-button></a-col>
      </a-row>
      <transition name="slide">
        <div v-if="isFilter">
          <a-divider><span style="cursor: pointer">Фильтры</span></a-divider>
          <a-row style="margin: 20px 0">
            <a-col :span="6" style="padding-right: 5px">
              <a-spin :spinning="getClient">
                <a-auto-complete
                  allowClear
                  style="width: 100%"
                  :data-source="clients"
                  :placeholder="$t('client')"
                  @search="searchClient"
                  @select="filterClient"
                />
              </a-spin>
            </a-col>
            <a-col :span="6" style="padding: 0 5px">
              <a-select allowClear :placeholder="$t('courier')" show-search style="width: 100%" @change="filterCourier" :filter-option="filterOption">
                <a-select-option v-for="c in couriers" :key="c.id" :value="c.id">
                  {{ c.first_name }} {{ c.last_name }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6" style="padding: 0 5px">
              <a-select allowClear :placeholder="$t('operator')" show-search style="width: 100%" @change="filterOperator" :filter-option="filterOption">
                <a-select-option v-for="o in operators" :key="o.id" :value="o.id">
                  {{ o.name }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6" style="padding-left: 5px">
              <a-select allowClear :placeholder="$t('type')" style="width: 100%" @change="filterType">
                <a-select-option value="like">Позитивный</a-select-option>
                <a-select-option value="dislike">Негативный</a-select-option>
                <a-select-option value="custom">Отзыв клиента</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row style="margin: 20px 0">
            <a-col :span="6" style="padding-right: 5px">
              <a-select allowClear :placeholder="$t('branch')" show-search style="width: 100%" @change="filterBranch" :filter-option="filterOption">
                <a-select-option v-for="branch in branches" :key="branch.id" :value="branch.id">
                  {{ branch.name }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="3" style="padding:0 5px">
              <a-select allowClear placeholder="Начало доставки" style="width: 100%" @change="filterDeliveryStart">
                <a-select-option :value="5">5 мин</a-select-option>
                <a-select-option :value="15">15 мин</a-select-option>
                <a-select-option :value="25">25 мин</a-select-option>
                <a-select-option :value="35">35 мин</a-select-option>
                <a-select-option :value="45">45 мин</a-select-option>
                <a-select-option :value="55">55 мин</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="3" style="padding: 0 5px">
              <a-select allowClear placeholder="Окончание доставки" style="width: 100%" @change="filterDeliveryEnd">
                <a-select-option :value="10">10 мин</a-select-option>
                <a-select-option :value="15">20 мин</a-select-option>
                <a-select-option :value="30">30 мин</a-select-option>
                <a-select-option :value="40">40 мин</a-select-option>
                <a-select-option :value="50">50 мин</a-select-option>
                <a-select-option :value="60">60 мин</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="12" style="padding-left: 5px">
              <a-range-picker separator=" - " :placeholder="['Дата начала', 'Дата окончания']" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" @change="filterDate" style="width: 100%"/>
            </a-col>
          </a-row>
        </div>
      </transition>
      <a-table
        :columns="columns"
        :data-source="reviews"
        :loading="loading"
        :rowKey="item => item.id"
        :pagination="pagination"
        @change="changePagination"
        bordered
      >
        <span slot="message.ru" slot-scope="text">{{ text.message.ru }}</span>
        <span slot="type" slot-scope="text">
          <a-icon v-if="text.type=='like'" theme="filled" :style="{ fontSize: '21px', color: 'green' }" type="like" />
          <a-icon v-if="text.type=='dislike'" theme="filled" :style="{ fontSize: '21px', color: 'red' }" type="dislike" />
          <a-icon v-if="text.type=='custom'" :style="{ fontSize: '21px', color: 'grey' }" type="message" />
        </span>
        <template slot="active" slot-scope="text">
          <a-tag v-if="text.active" color="#108ee9">{{ $t('active') }}</a-tag>
          <a-tag v-else color="#f00">{{ $t('inactive') }}</a-tag>
        </template>
        <template slot="time" slot-scope="time">
          {{ timeFormat(parseInt(time) * 1000).time }}
<!--            {{ Math.round(parseInt(time) / 60) + ' : ' + ( parseInt(time) - Math.round(parseInt(time) / 60) * 60) }}-->
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment'
import debounce from 'lodash/debounce'
import { AutoComplete } from 'ant-design-vue'
import i18n from '@/locales'
export default {
  components: {
    'a-auto-complete': AutoComplete
  },
  data () {
    this.searchClient = debounce(this.searchClient, 1000)
    return {
      visible: false,
      loading: false,
      getClient: false,
      isFilter: false,
      deliveryEnd: null,
      deliveryStart: null,
      count: 0,
      reviews: [],
      branches: [],
      couriers: [],
      operators: [],
      clients: [],
      columns: [
        {
          title: this.$t('orderId'),
          dataIndex: 'order_num'
        },
        {
          title: this.$t('client'),
          dataIndex: 'client_name'
        },
        {
          title: this.$t('courier'),
          dataIndex: 'courier_name'
        },
        {
          title: this.$t('operator'),
          dataIndex: 'operator_name'
        },
        {
          title: this.$t('type'),
          scopedSlots: { customRender: 'type' },
          key: 'type',
        },
        {
          title: this.$t('message.title'),
          dataIndex: 'review_message'
        },
        // {
        //   title: this.$t('ordersCount'),
        //   dataIndex: 'order_num'
        // },
        {
          title: this.$t('delivery_time'),
          dataIndex: 'delivery_time',
          scopedSlots: { customRender: 'time' }
        },
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      params: {
        branch_id: null,
        courier_id: null,
        operator_id: null,
        client_id: null,
        type: null,
        start_date: null,
        end_date: null,
        delivery_start_date: undefined,
        delivery_end_date: undefined
      },
    }
  },
  methods: {
    moment,
    timeFormat (value) {
      if (value !== 0) {
        let h, m, s
        // const staticTime = 45 * 60 * 1000
        if (value >= 1000) s = Math.floor(Math.abs((value) / 1000))
        else s = 0
        if (s > 0) {
          m = Math.floor(s / 60)
          s = s - m * 60
        } else m = 0
        if (m > 0) {
          h = Math.floor(m / 60)
          m = m - h * 60
        } else h = 0
        return {
          time: (h !== 0 ? h : '0') + ' : ' + (m !== 0 ? ((m < 10) ? ('0' + m) : m) : '0')
        }
      } else return '0' + ' ' + i18n.t('sec')
    },
    getData () {
      this.loading = true
      this.$store.dispatch('getUserReview', {
        params: this.params,
        pagination: this.pagination
      }).then(res => {
        console.log(res)
        this.reviews = res.reviews
        this.count = parseInt(res.count ? res.count : 0)
        this.pagination.total = parseInt(res.count)
      })
      .finally(() => {
        this.loading = false
      })
    },
    changePagination (e) {
      console.log(e)
      this.pagination = e
      this.getData()
    },
    searchClient (val) {
      if (val && val.length > 0) {
        this.getClient = true
        this.$store.dispatch('getCustomerList', {
          page: 1,
          limit: 5,
          search: val
        }).then(res => {
          this.clients = res.customers.map(e => {
            return {
              text: e.name,
              value: e.id
            }
          })
        }).finally(() => {
          this.getClient = false
        })
      } else {
        this.params.client_id = null
        this.getData()
      }
    },
    filterBranch (val) {
      this.params.branch_id = val
      this.getData()
    },
    filterClient (val) {
      this.params.client_id = val
      this.getData()
      console.log(val)
    },
    filterCourier (val) {
      this.params.courier_id = val
      this.getData()
    },
    filterDate (val) {
      this.params.start_date = val[0]
      this.params.end_date = val[1]
      this.getData()
      console.log(val)
    },
    filterType (val) {
      this.params.type = val
      this.getData()
    },
    filterOperator (val) {
     this.params.operator_id = val
      this.getData()
    },
    filterDeliveryStart (val) {
      this.deliveryStart = val
      this.params.delivery_start_date = (val * 60) || undefined
      if (this.deliveryEnd) this.getData()
    },
    filterDeliveryEnd (val) {
      console.log(val)
      this.deliveryEnd = val
      this.params.delivery_end_date = (val * 60) || undefined
      if (this.deliveryStart) this.getData()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  mounted () {
    this.getData()
    this.$store.dispatch('getBranchesList').then(res => {
      console.log(res)
      this.branches = res.branches
    })
    this.$store.dispatch('getCouriersList', { page: 1, limit: 1000 }).then(res => {
      this.couriers = res.couriers
    })
    this.$store.dispatch('getSystemUsersList').then(res => {
      this.operators = res
    })
  }
}
</script>
<style>

.slide-enter-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-in;
  -webkit-transition-timing-function: ease-in;
  -o-transition-timing-function: ease-in;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave {
  max-height: 200px;
  overflow: hidden;
}

.slide-enter, .slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
