<template>
  <div>
    <a-card :title="$t('fares')" style="width: 100%">
      <a-button type="primary" slot="extra" @click="addItem">{{ $t('add') }}</a-button>
      <a-row style="margin: 10px 0">
        <a-col :span="16"></a-col>
        <a-col :span="8">
          <a-input v-debounce="search" :placeholder="$t('search')" />
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="tariffs"
        :loading="load_tariff"
        :rowKey="item => item.id"
        :pagination="tariffPagination"
        @change="changePagination"
        bordered
      >
        <template slot="type" slot-scope="item">
          {{ $t(`${item}`) }}
        </template>
        <template slot="action" slot-scope="item">
<!--          <a-tooltip>-->
<!--            <template slot="title">{{ $t('assignBranch') }}</template>-->
<!--            <a-button style="margin: 0 2px" type="primary" ghost @click="assign(item)" icon="apartment"></a-button>-->
<!--          </a-tooltip>-->
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button style="margin: 0 2px" type="primary" @click="editItem(item)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="removeItem(item)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button
                style="margin: 0 2px"
                type="danger"
                icon="delete"
              ></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <!-- MODALS -->
    <item-create ref="createItem" :editable="false" :params="params"/>
    <item-create ref="editItem" :editable="true" :params="params"/>
    <assign_branch :params="params" ref="assign"/>
  </div>
</template>
<script>
import create from './TariffCreateWithUpdate'
import { mapActions, mapGetters } from 'vuex'
import TariffAssignBranch from './TariffAssignBranch'
export default {
  components: {
    'item-create': create,
    'assign_branch': TariffAssignBranch
  },
  data () {
    return {
      visible: false,
      loading: false,
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
    ...mapActions(['getAllTariff', 'deleteTariff', 'getAllBranches', 'getBranchNoFare']),
    assign (item) {
      console.log(item)
      this.$refs.assign.assigned = item.branches ? item.branches.map(e => { return e.id }) : []
      this.$refs.assign.show({ ...item })
    },
    editItem (item) {
      console.log(item)
      this.$refs.editItem.show(item)
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
      console.log(item)
      this.deleteTariff(item.id).then(res => {
        this.getAllTariff(this.params)
      })
    },
    addItem () {
      this.$refs.createItem.show()
    },
  },
  computed: {
    ...mapGetters(['tariffs', 'load_tariff', 'tariffPagination']),
  },
  mounted () {
    // this.getBranchNoFare()
    this.getAllBranches()
    this.getAllTariff(this.params)
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
</style>
