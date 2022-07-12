<template>
  <div>
    <a-card v-action:get :title="$t('free.geozone.list')" style="width: 100%">
      <a-button type="primary" slot="extra" @click="$router.push({ name: 'FreeGeozoneCreate' })">{{ $t('add') }}</a-button>
      <a-table
        :columns="columns"
        :data-source="allFreeGeozone"
        :loading="freeGeozoneLoad"
        :rowKey="item => item.id"
        :pagination="freeGeozonePagination"
        @change="changePagination"
        bordered
      >
        <template slot="status" slot-scope="is_blocked">
          <a-tag v-if="!is_blocked" color="#108ee9">{{ $t('active') }}</a-tag>
          <a-tag v-else color="#f00">{{ $t('inactive') }}</a-tag>
        </template>
        <template slot="action" slot-scope="item">
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button style="margin: 0 2px" id="buttonUpdate" type="primary" @click="edit(item)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="topRight"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="remove(item)"
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
    <!--    <customer-create ref="customerCreate" :params="params"></customer-create>-->
    <!--    <customer-create ref="customerEdit" :params="params" :edit="true"></customer-create>-->
    <!--    <customer-view ref="customerView"></customer-view>-->
  </div>
</template>
<script>
// import CustomerCreate from './CustomerCreate'
// import CustomerView from './PreviewCustomer'
import { mapActions, mapGetters } from 'vuex'
export default {
  // components: {
  //   'customer-create': CustomerCreate,
  //   'customer-view': CustomerView
  // },
  data () {
    return {
      visible: false,
      loading: false,
      slug: null,
      columns: [
        {
          title: this.$t('name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        // {
        //   title: this.$t('phone'),
        //   dataIndex: 'phone',
        // },
        // {
        //   title: this.$t('status'),
        //   dataIndex: 'is_blocked',
        //   align: 'center',
        //   scopedSlots: { customRender: 'status' },
        // },
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
    ...mapActions(['getFreeGeozoneList', 'deleteFreeGeozone']),
    edit (item) {
      this.$router.push({
        name: 'FreeGeozoneEdit',
        params: {
          id: item.id
        }
      })
      console.log(item)
    },
    changePagination (e) {
      this.params.pagination = e
      this.getFreeGeozoneList(this.params)
    },
    // search (value) {
    //   console.log(value)
    //   this.params.search = value
    //   this.getGeozoneList(this.params)
    // },
    remove (item) {
      this.deleteFreeGeozone(item.id).then(res => {
        this.getFreeGeozoneList(this.params)
      })
    },
    // addCustomer () {
    //   this.$refs.customerCreate.show()
    // }
  },
  computed: {
    ...mapGetters(['allFreeGeozone', 'freeGeozoneLoad', 'freeGeozonePagination']),
  },
  mounted () {
    this.getFreeGeozoneList(this.params)
  },
}
</script>
