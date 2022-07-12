<template>
  <div>
    <a-card :title="$t('fares')" style="width: 100%">
      <a-button type="primary" slot="extra" @click="addItem">{{ $t('add') }}</a-button>
      <a-row style="margin: 10px 0">
        <a-col :span="16"></a-col>
      </a-row>
       <a-row type="flex" :gutter="[8,8]">
         <template v-if="!isFetching">
         <a-col span="24" v-for="item in tariffs" :key="item.id">
            <card :tariff="item" :removeItem="removeItem"/>
         </a-col>
         </template>
          <template v-else>
            <a-col span="24" v-for="item in 4" :key="item">
             <a-skeleton active />
         </a-col>
          </template>
        </a-row>
    </a-card>

  </div>
</template>
<script>
import card from './card.vue'
export default {
  components: { card },
  data () {
    return {
      visible: false,
      isFetching: false,
      tariffs: [],
      load_tariff: false,
      tariffPagination: {},
      columns: [
        {
          title: this.$t('price'),
          dataIndex: 'base_price',
        },
        {
          title: this.$t('type'),
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: null,
        },
        search: '',
      },
    }
  },
  methods: {
    getAllTariffs () {
      this.isFetching = true
      this.$store.dispatch('getBillingTarif').then(res => {
        console.log(res)
        this.tariffs = res.tariffs
      }).finally(() => {
        this.isFetching = false
      })
    },
    changePagination (e) {
      this.params.pagination = e
      this.getAllTariff(this.params)
    },
    search (value) {
      console.log(value)
      this.params.search = value
      this.getAllTariff(this.params)
    },
    removeItem (item) {
      this.$store.dispatch('deleteBillingTariffId', item.id).then(res => {
                console.log(res)
                this.tariffs = this.tariffs.filter(el => el.id !== item.id)
      })
    },
    addItem () {
      this.$router.push('/billing/tarifs/create')
    },
  },
  computed: {
  },
  created () {
    // this.getBranchNoFare()
    this.getAllTariffs()
  },
}
</script>
<style>
.ant-table-row:hover {
  cursor: pointer;
}
.imagePreview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
}
.colorPick:hover {
  transition: .5s all ease;
  background: rgb(245, 245, 245);
}
</style>
